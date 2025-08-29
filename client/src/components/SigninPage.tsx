import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SigninPage.css';
import hdLogo from '../assets/hd.png';
import heroImg from '../assets/hero_img.jpg';
import mobileImage from '../assets/img.svg';

const SigninPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: 'jonas_kahnwald@gmail.com',
    otp: ''
  });

  const [showOtp, setShowOtp] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signin logic here
    console.log('Signin data:', formData);
  };

  const toggleOtpVisibility = () => {
    setShowOtp(!showOtp);
  };

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
          <form onSubmit={handleSubmit} className="signin-form">
            <div className="title-section">
              <h1 className="title">Sign in</h1>
              <p className="subtitle">Please login to continue to your account</p>
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

            <div className="form-group">
              <div className="otp-input-container">
                <input
                  type={showOtp ? "text" : "password"}
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="OTP"
                />
                <span 
                  className="eye-icon"
                  onClick={toggleOtpVisibility}
                >
                  {showOtp ? '👁️' : '🙈'}
                </span>
              </div>
            </div>

            <div className="resend-otp">
              <Link to="/resend-otp" className="resend-link">
                Resend OTP
              </Link>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Keep me logged in
              </label>
            </div>

            <button type="submit" className="signin-button">
              Sign in
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
