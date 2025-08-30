import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotes } from '../contexts/NotesContext';
import { userAPI } from '../services/api';
import NoteCard from './NoteCard';
import NoteForm from './NoteForm';
import type { Note } from '../types/notes';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const { notes, loading, error, pagination, fetchNotes } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    dateOfBirth: user?.dateOfBirth || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [activeTab, setActiveTab] = useState<'notes' | 'profile'>('notes');

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

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowNoteForm(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowNoteForm(true);
  };

  const handleCloseNoteForm = () => {
    setShowNoteForm(false);
    setEditingNote(null);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}! 👋</h1>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          📝 My Notes ({notes.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
      </div>

      {activeTab === 'notes' && (
        <div className="notes-section">
          <div className="notes-header">
            <h2>My Notes</h2>
            <button onClick={handleCreateNote} className="create-note-btn">
              ✨ Create Note
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {loading ? (
            <div className="loading-spinner">Loading notes...</div>
          ) : notes.length === 0 ? (
            <div className="empty-notes">
              <div className="empty-icon">📝</div>
              <h3>No notes yet</h3>
              <p>Create your first note to get started!</p>
              <button onClick={handleCreateNote} className="create-first-note-btn">
                Create Your First Note
              </button>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onEdit={handleEditNote}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="profile-section">
          <h2>Profile Information</h2>
          
          {message && (
            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          {isEditing ? (
            <div className="edit-form">
              <div className="form-group">
                <label htmlFor="edit-name">Name:</label>
                <input
                  type="text"
                  id="edit-name"
                  value={editData.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-dob">Date of Birth:</label>
                <input
                  type="date"
                  id="edit-dob"
                  value={editData.dateOfBirth}
                  onChange={(e) => setEditData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
              
              <div className="form-actions">
                <button onClick={handleSave} disabled={isLoading} className="save-btn">
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <div className="info-row">
                <strong>Name:</strong> {user.name}
              </div>
              <div className="info-row">
                <strong>Email:</strong> {user.email}
              </div>
              <div className="info-row">
                <strong>Date of Birth:</strong> {user.dateOfBirth}
              </div>
              <div className="info-row">
                <strong>Authentication Method:</strong> {user.authMethod}
              </div>
              
              <div className="profile-actions">
                <button onClick={handleEdit} className="edit-btn">
                  Edit Profile
                </button>
                <button onClick={handleDeleteAccount} className="delete-btn">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <NoteForm
        note={editingNote}
        onClose={handleCloseNoteForm}
        isOpen={showNoteForm}
      />
    </div>
  );
};

export default Dashboard;
