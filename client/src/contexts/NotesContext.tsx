import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { notesAPI } from '../services/api';
import type { Note } from '../types/notes';
import { useAuth } from './AuthContext';

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalNotes: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  fetchNotes: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    tag?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => Promise<void>;
  createNote: (data: {
    title: string;
    content: string;
    tags?: string[];
    color?: string;
    isPinned?: boolean;
  }) => Promise<Note>;
  updateNote: (id: string, data: {
    title?: string;
    content?: string;
    tags?: string[];
    color?: string;
    isPinned?: boolean;
  }) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  clearError: () => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalNotes: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchNotes = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    tag?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notesAPI.getNotes(params);
      
      if (response.success) {
        setNotes(response.data.notes);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Failed to fetch notes');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (data: {
    title: string;
    content: string;
    tags?: string[];
    color?: string;
    isPinned?: boolean;
  }): Promise<Note> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notesAPI.createNote(data);
      
      if (response.success) {
        const newNote = response.data.note;
        setNotes(prev => [newNote, ...prev]);
        return newNote;
      } else {
        throw new Error(response.message || 'Failed to create note');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create note');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateNote = async (id: string, data: {
    title?: string;
    content?: string;
    tags?: string[];
    color?: string;
    isPinned?: boolean;
  }): Promise<Note> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notesAPI.updateNote(id, data);
      
      if (response.success) {
        const updatedNote = response.data.note;
        setNotes(prev => prev.map(note => 
          note._id === id ? updatedNote : note
        ));
        return updatedNote;
      } else {
        throw new Error(response.message || 'Failed to update note');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to update note');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notesAPI.deleteNote(id);
      
      if (response.success) {
        setNotes(prev => prev.filter(note => note._id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete note');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to delete note');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const togglePin = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notesAPI.togglePin(id);
      
      if (response.success) {
        const updatedNote = response.data.note;
        setNotes(prev => prev.map(note => 
          note._id === id ? updatedNote : note
        ));
      } else {
        throw new Error(response.message || 'Failed to toggle pin');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to toggle pin');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Load notes only when user is authenticated
  useEffect(() => {
    if (user) {
      fetchNotes();
    } else {
      // Clear notes when user is not authenticated
      setNotes([]);
      setError(null);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const value: NotesContextType = {
    notes,
    loading,
    error,
    pagination,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    clearError
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
