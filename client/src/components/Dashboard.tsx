import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotes } from '../contexts/NotesContext';
import NoteForm from './NoteForm';
import type { Note } from '../types/notes';
import './Dashboard.css';
import mobileImage from '../assets/img.svg';
import hdLogo from '../assets/hd.png';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { notes, loading, error, deleteNote } = useNotes();
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

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

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(noteId);
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* iOS Status Bar */}
      <div className="status-bar">
      <div className="mobile-image-section">
          <img src={mobileImage} alt="Mobile" className="mobile-image" />
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="nav-bar">
        <div className="nav-left">
        <div className="logo">
              <img src={hdLogo} alt="HD Logo" className="hd-logo" />
            </div>
          <h1 className="nav-title">Dashboard</h1>
        </div>
        <button onClick={logout} className="sign-out-btn">
          Sign Out
        </button>
      </div>

      {/* Welcome Section */}
      <div className="welcome-section">
        <h2 className="welcome-title">Welcome, {user.name} !</h2>
        <p className="welcome-email">Email: {user.email}</p>
      </div>

      {/* Create Note Button */}
      <div className="create-note-section">
        <button onClick={handleCreateNote} className="create-note-btn">
          Create Note
        </button>
      </div>

      {/* Notes Section */}
      <div className="notes-section">
        <h3 className="notes-title">Notes</h3>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="empty-notes">
            <p>No notes yet. Create your first note!</p>
          </div>
        ) : (
          <div className="notes-list">
            {notes.map((note) => (
              <div key={note._id} className="note-item">
                <span 
                  className="note-text"
                  onClick={() => handleEditNote(note)}
                >
                  {note.title || 'Untitled Note'}
                </span>
                <button
                  onClick={() => handleDeleteNote(note._id)}
                  className="delete-note-btn"
                  aria-label="Delete note"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* iOS Home Indicator */}
      <div className="home-indicator"></div>

      {/* Note Form Modal */}
      <NoteForm
        note={editingNote}
        onClose={handleCloseNoteForm}
        isOpen={showNoteForm}
      />
    </div>
  );
};

export default Dashboard;
