import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  userId: mongoose.Types.ObjectId;
  isPinned: boolean;
  tags: string[];
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>({
  title: { 
    type: String, 
    required: true, 
    trim: true, 
    maxlength: [100, 'Title cannot exceed 100 characters'] 
  },
  content: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: [10000, 'Content cannot exceed 10000 characters'] 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  isPinned: { 
    type: Boolean, 
    default: false 
  },
  tags: [{ 
    type: String, 
    trim: true 
  }],
  color: { 
    type: String, 
    default: '#ffffff',
    enum: ['#ffffff', '#f28b82', '#fbbd04', '#fff475', '#ccff90', '#a7ffeb', '#aecbfa', '#d7aefb', '#fdcfe8', '#e6c9a8', '#e8eaed']
  }
}, { 
  timestamps: true 
});

// Index for faster queries
noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ userId: 1, isPinned: -1, updatedAt: -1 });

export default mongoose.model<INote>('Note', noteSchema);
