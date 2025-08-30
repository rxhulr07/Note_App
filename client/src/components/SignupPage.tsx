import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import './SignupPage.css';
import hdLogo from '../assets/hd.png';
import heroImg from '../assets/hero_img.jpg';
import mobileImage from '../assets/img.svg';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, getOTP, verifyOTP, googleSignUp } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    email: '',
    otp: ''
  });
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // First signup the user
      await signup(formData.name, formData.email, formData.dateOfBirth);
      
      // Then get OTP
      await getOTP(formData.email);
      
      setMessage('OTP sent to your email!');
      setMessageType('success');
      setShowOtpSection(true);
    } catch (error: any) {
      setMessage(error.message);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setMessage('');
      
      await verifyOTP(formData.email, formData.otp);
      
      setMessage('Account created successfully! Redirecting...');
      setMessageType('success');
      
      // Redirect to dashboard after successful verification
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error: any) {
      setMessage(error.message);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsLoading(true);
      setMessage('');
      
      // For Google signup, we need date of birth
      if (!formData.dateOfBirth) {
        setMessage('Please enter your date of birth first');
        setMessageType('error');
        return;
      }

      await googleSignUp(credentialResponse.credential, formData.dateOfBirth);
      setMessage('Account created successfully with Google!');
      setMessageType('success');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error: any) {
      setMessage(error.message || 'Google sign up failed');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setMessage('Google sign up failed. Please try again.');
    setMessageType('error');
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
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
          <form onSubmit={(e) => e.preventDefault()} className="signup-form">
            <div className="title-section">
              <h1 className="title">Sign up</h1>
              <p className="subtitle">Sign up to enjoy the feature of HD</p>
            </div>

            {message && (
              <div className={`message ${messageType === 'success' ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <div className="form-group">
              <div className="floating-label-container">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder=" "
                />
                <label htmlFor="name" className="floating-label">Your Name</label>
              </div>
            </div>

            <div className="form-group">
              <div className="floating-label-container">
                <div className="date-input-container">
                  <span className="calendar-icon">📅</span>
                  <input
                    type="text"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder=" "
                  />
                </div>
                <label htmlFor="dateOfBirth" className="floating-label">Date of Birth</label>
              </div>
            </div>

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

            {showOtpSection && (
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
            )}

            {/* Google OAuth button */}
            <div className="google-auth-section">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_blue"
                size="large"
                text="signup_with"
                shape="rectangular"
              />
            </div>

            <button 
              type="button" 
              onClick={handleGetOtp} 
              disabled={isLoading}
              className={`get-otp-button ${showOtpSection ? 'hidden' : ''}`}
            >
              {isLoading ? 'Processing...' : 'Get OTP'}
            </button>
            
            <button 
              type="button" 
              onClick={handleSubmit}
              disabled={isLoading}
              className={`signup-button ${!showOtpSection ? 'hidden' : ''}`}
            >
              {isLoading ? 'Verifying...' : 'Sign up'}
            </button>

            <div className="signin-link">
              <span>Already have an account?? </span>
              <Link to="/login" className="link">Sign in</Link>
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

export default SignupPage;
