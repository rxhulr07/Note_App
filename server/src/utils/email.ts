import nodemailer from 'nodemailer';

// Create transporter (for development, you can use Gmail or other services)
const createTransporter = () => {
  // For development, you can use Gmail with app password
  // For production, use services like SendGrid, AWS SES, etc.
  
  if (process.env.NODE_ENV === 'production') {
    // Production email service configuration
    return nodemailer.createTransporter({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // Development - using Gmail (you'll need to set up app password)
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });
  }
};

export const sendOTPEmail = async (email: string, otp: string, name: string): Promise<void> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Your OTP for HD App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #007bff; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">HD App</h1>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #333;">Hello ${name}!</h2>
            
            <p style="color: #666; font-size: 16px;">
              Your OTP (One-Time Password) for HD App is:
            </p>
            
            <div style="background: #007bff; color: white; padding: 15px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              This OTP will expire in 10 minutes.
            </p>
            
            <p style="color: #666; font-size: 14px;">
              If you didn't request this OTP, please ignore this email.
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2024 HD App. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error('Failed to send OTP email');
  }
};

// For development/testing without actual email sending
export const sendOTPEmailDev = async (email: string, otp: string, name: string): Promise<void> => {
  console.log('📧 [DEV MODE] OTP Email would be sent:');
  console.log('To:', email);
  console.log('Name:', name);
  console.log('OTP:', otp);
  console.log('📧 [DEV MODE] Email simulation complete');
};
