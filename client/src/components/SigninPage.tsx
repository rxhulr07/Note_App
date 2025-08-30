import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import './SigninPage.css';
import hdLogo from '../assets/hd.png';
import heroImg from '../assets/hero_img.jpg';
import mobileImage from '../assets/img.svg';

const SigninPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getOTP, verifyOTP, googleSignIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    otp: ''
  });

  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [otpSent, setOtpSent] = useState(false);
  const [otpEntered, setOtpEntered] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Track when OTP is entered
    if (name === 'otp') {
      setOtpEntered(value.length > 0);
    }
  };


  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsLoading(true);
      setMessage('');
      await googleSignIn(credentialResponse.credential);
      setMessage('Signed in successfully with Google!');
      setMessageType('success');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error: any) {
      setMessage(error.message || 'Google sign in failed');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setMessage('Google sign in failed. Please try again.');
    setMessageType('error');
  };

  // const toggleOtpVisibility = () => {
  //   setShowOtp(!showOtp);
  // };

  return (
    <div className="signin-container">
      <div className="signin-content">
        {/* Mobile Image */}
        <div className="mobile-image-section">
          <img src={mobileImage} alt="Mobile" className="mobile-image" />
        </div>
        
        {/* Left Column - Form */}
        <div className="form-section">
          {/* Header */}
          <div className="header">
            <div className="logo">
              <img src={hdLogo} alt="HD Logo" className="hd-logo" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()} className="signin-form">
            <div className="title-section">
              <h1 className="title">Sign in</h1>
              <p className="subtitle">Please login to continue to your account</p>
            </div>

            {message && (
              <div className={`message ${messageType === 'success' ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <div className="form-group">
              <div className="floating-label-container">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder=" "
                />
                <label htmlFor="email" className="floating-label">Email</label>
              </div>
            </div>

            <div className="form-group">
              <div className="otp-input-container">
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  placeholder="OTP"
                  className="form-input"
                />
                <span className="eye-icon">👁️</span>
              </div>
            </div>

            <div className="resend-otp">
              <button 
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtpEntered(false);
                  setFormData(prev => ({ ...prev, otp: '' }));
                  setMessage('');
                }}
                className="resend-link"
              >
                Resend OTP
              </button>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Keep me logged in
              </label>
              
              {/* Google OAuth button next to checkbox */}
              <div className="google-auth-section">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="filled_blue"
                  size="medium"
                  text="signin_with"
                  shape="rectangular"
                />
              </div>
            </div>

            <button 
              type="button"
              onClick={async () => {
                if (otpSent && otpEntered) {
                  // Handle sign in
                  try {
                    setIsLoading(true);
                    setMessage('');
                    await verifyOTP(formData.email, formData.otp);
                    setMessage('Sign in successful! Redirecting...');
                    setMessageType('success');
                    setTimeout(() => navigate('/dashboard'), 2000);
                  } catch (error: any) {
                    setMessage(error.message || 'Sign in failed');
                    setMessageType('error');
                  } finally {
                    setIsLoading(false);
                  }
                } else {
                  // Handle get OTP
                  if (!formData.email) {
                    setMessage('Please enter your email first');
                    setMessageType('error');
                    return;
                  }
                  try {
                    setIsLoading(true);
                    setMessage('');
                    await getOTP(formData.email);
                    setOtpSent(true);
                    setOtpEntered(false);
                    setFormData(prev => ({ ...prev, otp: '' }));
                    setMessage('OTP sent to your email! Please check and enter above.');
                    setMessageType('success');
                  } catch (error: any) {
                    setMessage(error.message || 'Failed to send OTP');
                    setMessageType('error');
                  } finally {
                    setIsLoading(false);
                  }
                }
              }}
              disabled={isLoading}
              className={otpSent && otpEntered ? "signin-button" : "get-otp-button"}
            >
              {isLoading ? 'Processing...' : 
                otpSent && otpEntered ? 'Sign in' : 'Get OTP'
              }
            </button>

            <div className="signup-link">
              <span>Need an account? </span>
              <Link to="/signup" className="link">Create one</Link>
            </div>
          </form>
        </div>

        {/* Right Column - Hero Image (Desktop only) */}
        <div className="graphic-section">
          <div className="hero-image-container">
            <img src={heroImg} alt="Hero" className="hero-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
