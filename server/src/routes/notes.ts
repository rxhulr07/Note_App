import express from 'express';
import { authenticateToken } from '../middleware/auth';
import Note from '../models/Note';

const router = express.Router();

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { title, content, tags, color, isPinned } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    if (title.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Title cannot exceed 100 characters'
      });
    }

    if (content.length > 10000) {
      return res.status(400).json({
        success: false,
        message: 'Content cannot exceed 10000 characters'
      });
    }

    // Create note
    const note = new Note({
      title: title.trim(),
      content: content.trim(),
      userId,
      tags: tags || [],
      color: color || '#ffffff',
      isPinned: isPinned || false
    });

    await note.save();

    return res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: { note }
    });

  } catch (error: any) {
    console.error('Create note error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating note',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/notes
// @desc    Get all notes for the authenticated user
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const userId = req.user.userId;
    const { page = 1, limit = 20, search, tag, sortBy = 'updatedAt', sortOrder = 'desc' } = req.query;

    // Build query
    const query: any = { userId };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
    
    // Always show pinned notes first
    if (sortBy === 'updatedAt') {
      sort.isPinned = -1;
    }

    // Execute query
    const notes = await Note.find(query)
      .sort(sort)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    // Get total count for pagination
    const total = await Note.countDocuments(query);

    return res.json({
      success: true,
      data: { 
        notes,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalNotes: total,
          hasNextPage: Number(page) * Number(limit) < total,
          hasPrevPage: Number(page) > 1
        }
      }
    });

  } catch (error: any) {
    console.error('Get notes error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching notes',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/notes/:id
// @desc    Get a specific note by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { id } = req.params;
    const userId = req.user.userId;

    const note = await Note.findOne({ _id: id, userId });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    return res.json({
      success: true,
      data: { note }
    });

  } catch (error: any) {
    console.error('Get note error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching note',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { id } = req.params;
    const userId = req.user.userId;
    const { title, content, tags, color, isPinned } = req.body;

    // Validation
    if (title && title.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Title cannot exceed 100 characters'
      });
    }

    if (content && content.length > 10000) {
      return res.status(400).json({
        success: false,
        message: 'Content cannot exceed 10000 characters'
      });
    }

    // Find and update note
    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      {
        ...(title && { title: title.trim() }),
        ...(content && { content: content.trim() }),
        ...(tags !== undefined && { tags }),
        ...(color !== undefined && { color }),
        ...(isPinned !== undefined && { isPinned })
      },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    return res.json({
      success: true,
      message: 'Note updated successfully',
      data: { note }
    });

  } catch (error: any) {
    console.error('Update note error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating note',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { id } = req.params;
    const userId = req.user.userId;

    const note = await Note.findOneAndDelete({ _id: id, userId });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    return res.json({
      success: true,
      message: 'Note deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete note error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting note',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/notes/:id/pin
// @desc    Toggle pin status of a note
// @access  Private
router.put('/:id/pin', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { id } = req.params;
    const userId = req.user.userId;

    const note = await Note.findOne({ _id: id, userId });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    return res.json({
      success: true,
      message: `Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully`,
      data: { note }
    });

  } catch (error: any) {
    console.error('Toggle pin error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error toggling pin status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;
