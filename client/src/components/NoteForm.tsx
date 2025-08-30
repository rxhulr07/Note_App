import React, { useState, useEffect } from 'react';
import { useNotes } from '../contexts/NotesContext';
import type { Note } from '../types/notes';
import './NoteForm.css';

interface NoteFormProps {
  note?: Note | null;
  onClose: () => void;
  isOpen: boolean;
}

const NoteForm: React.FC<NoteFormProps> = ({ note, onClose, isOpen }) => {
  const { createNote, updateNote } = useNotes();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    color: '#ffffff',
    isPinned: false
  });
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const colorOptions = [
    '#ffffff', '#f28b82', '#fbbd04', '#fff475', '#ccff90', 
    '#a7ffeb', '#aecbfa', '#d7aefb', '#fdcfe8', '#e6c9a8', '#e8eaed'
  ];

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        tags: [...note.tags],
        color: note.color,
        isPinned: note.isPinned
      });
    } else {
      setFormData({
        title: '',
        content: '',
        tags: [],
        color: '#ffffff',
        isPinned: false
      });
    }
    setErrors({});
  }, [note]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length > 10000) {
      newErrors.content = 'Content cannot exceed 10000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (note) {
        await updateNote(note._id, formData);
      } else {
        await createNote(formData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="note-form-overlay" onClick={onClose}>
      <div className="note-form-modal" onClick={e => e.stopPropagation()}>
        <div className="note-form-header">
          <h2>{note ? 'Edit Note' : 'Create New Note'}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit} className="note-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={errors.title ? 'error' : ''}
              maxLength={100}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className={errors.content ? 'error' : ''}
              rows={8}
              maxLength={10000}
            />
            {errors.content && <span className="error-message">{errors.content}</span>}
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tag-input-container">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a tag and press Enter"
              />
              <button type="button" onClick={handleAddTag} className="add-tag-btn">
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="tags-display">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="remove-tag-btn"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-options">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${formData.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isPinned}
                onChange={(e) => setFormData(prev => ({ ...prev, isPinned: e.target.checked }))}
              />
              Pin this note
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="save-btn">
              {isLoading ? 'Saving...' : (note ? 'Update Note' : 'Create Note')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;
