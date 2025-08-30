import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User, { IUser } from '../models/User';
import { sendOTPEmail } from '../utils/email';
import { validateSignup } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
};

// Signup route - no password required
router.post('/signup', validateSignup, async (req, res) => {
  try {
    const { name, email, dateOfBirth } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email }).exec() as IUser | null;
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      dateOfBirth,
      authMethod: 'email'
    });

    // Generate OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, name);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the signup if email fails
    }

    return res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for OTP.',
      data: {
        userId: user._id,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during signup',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get OTP route
router.post('/get-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email }).exec() as IUser | null;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, user.name);
      return res.json({
        success: true,
        message: 'OTP sent successfully'
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }

  } catch (error: any) {
    console.error('Get OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting OTP',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Verify OTP route
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const user = await User.findOne({ email }).exec() as IUser | null;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.verifyOTP(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isEmailVerified = true;
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken((user._id as any).toString());

    return res.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin
        },
        token
      }
    });

  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Google OAuth Sign Up
router.post('/google/signup', async (req, res) => {
  try {
    const { googleToken, dateOfBirth } = req.body;

    if (!googleToken || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: 'Google token and date of birth are required'
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google token'
      });
    }

    const { sub: googleId, email, name, email_verified } = payload;

    // Check if user already exists
    let user = await User.findOne({ email }).exec() as IUser | null;
    
    if (user) {
      if (user.authMethod === 'google') {
        // User exists with Google, generate token and log them in
        const token = generateToken((user._id as any).toString());
        user.lastLogin = new Date();
        await user.save();
        
        return res.json({
          success: true,
          message: 'Signed in successfully',
          data: {
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              isEmailVerified: user.isEmailVerified,
              lastLogin: user.lastLogin
            },
            token
          }
        });
      } else {
        // User exists with email/OTP, can't use Google
        return res.status(400).json({
          success: false,
          message: 'Account already exists with email/OTP. Please sign in with OTP.'
        });
      }
    }

    // Create new Google user
    user = new User({
      name,
      email,
      dateOfBirth,
      googleId,
      googleEmail: email,
      authMethod: 'google',
      isEmailVerified: email_verified || false
    });

    await user.save();

    // Generate token
    const token = generateToken((user._id as any).toString());

    return res.status(201).json({
      success: true,
      message: 'Account created successfully with Google',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin
        },
        token
      }
    });

  } catch (error: any) {
    console.error('Google signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during Google signup',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Google OAuth Sign In
router.post('/google/signin', async (req, res) => {
  try {
    const { googleToken } = req.body;

    if (!googleToken) {
      return res.status(400).json({
        success: false,
        message: 'Google token is required'
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google token'
      });
    }

    const { sub: googleId, email } = payload;

    // Find user by Google ID or email
    const user = await User.findOne({ 
      $or: [{ googleId }, { email }],
      authMethod: 'google'
    }).exec() as IUser | null;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'No Google account found. Please sign up first.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken((user._id as any).toString());

    return res.json({
      success: true,
      message: 'Signed in successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin
        },
        token
      }
    });

  } catch (error: any) {
    console.error('Google signin error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during Google signin',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Logout route
router.post('/logout', authenticateToken, (req, res) => {
  return res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Get current user route
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user?.userId).exec() as IUser | null;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin,
          authMethod: user.authMethod
        }
      }
    });

  } catch (error: any) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting user data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;
