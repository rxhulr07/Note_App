import React, { useState } from 'react';
import { useNotes } from '../contexts/NotesContext';
import type { Note } from '../types/notes';
import './NoteCard.css';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit }) => {
  const { deleteNote, togglePin } = useNotes();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setIsDeleting(true);
      try {
        await deleteNote(note._id);
      } catch (error) {
        console.error('Failed to delete note:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleTogglePin = async () => {
    try {
      await togglePin(note._id);
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div 
      className={`note-card ${note.isPinned ? 'pinned' : ''}`}
      style={{ backgroundColor: note.color }}
    >
      {note.isPinned && (
        <div className="pin-indicator">
          📌
        </div>
      )}
      
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
        <div className="note-actions">
          <button
            onClick={handleTogglePin}
            className="action-btn pin-btn"
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            {note.isPinned ? '📌' : '📍'}
          </button>
          <button
            onClick={() => onEdit(note)}
            className="action-btn edit-btn"
            title="Edit note"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="action-btn delete-btn"
            title="Delete note"
            disabled={isDeleting}
          >
            {isDeleting ? '⏳' : '🗑️'}
          </button>
        </div>
      </div>

      <div className="note-content">
        {note.content.length > 200 
          ? `${note.content.substring(0, 200)}...` 
          : note.content
        }
      </div>

      {note.tags.length > 0 && (
        <div className="note-tags">
          {note.tags.map((tag, index) => (
            <span key={index} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="note-footer">
        <span className="note-date">
          {formatDate(note.updatedAt)}
        </span>
      </div>
    </div>
  );
};

export default NoteCard;
