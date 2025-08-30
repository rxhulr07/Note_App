import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    dateOfBirth: user?.dateOfBirth || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleEdit = () => {
    setEditData({
      name: user?.name || '',
      dateOfBirth: user?.dateOfBirth || ''
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await userAPI.updateProfile(editData);
      
      if (response.success) {
        updateUser(editData);
        setMessage('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setMessage(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      setMessage(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage('');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsLoading(true);
      
      try {
        await userAPI.deleteProfile();
        logout();
      } catch (error: any) {
        setMessage(error.message || 'Failed to delete account');
        setIsLoading(false);
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}! 👋</h1>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="profile-section">
          <h2>Profile Information</h2>
          
          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="profile-info">
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Date of Birth:</label>
                  <input
                    type="text"
                    value={editData.dateOfBirth}
                    onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div className="edit-actions">
                  <button 
                    onClick={handleSave} 
                    disabled={isLoading}
                    className="save-button"
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={handleCancel} 
                    disabled={isLoading}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-display">
                <div className="info-row">
                  <span className="label">Name:</span>
                  <span className="value">{user.name}</span>
                </div>
                
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{user.email}</span>
                </div>
                
                <div className="info-row">
                  <span className="label">Date of Birth:</span>
                  <span className="value">{user.dateOfBirth}</span>
                </div>
                
                <div className="info-row">
                  <span className="label">Email Verified:</span>
                  <span className="value">
                    {user.isEmailVerified ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                
                {user.lastLogin && (
                  <div className="info-row">
                    <span className="label">Last Login:</span>
                    <span className="value">
                      {new Date(user.lastLogin).toLocaleString()}
                    </span>
                  </div>
                )}

                <button onClick={handleEdit} className="edit-button">
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="danger-zone">
          <h3>Danger Zone</h3>
          <p>These actions cannot be undone.</p>
          <button 
            onClick={handleDeleteAccount}
            disabled={isLoading}
            className="delete-button"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
