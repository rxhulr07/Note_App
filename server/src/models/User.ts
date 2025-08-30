import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  dateOfBirth: string;
  googleId?: string;
  googleEmail?: string;
  authMethod: 'email' | 'google';
  otp?: string;
  otpExpiry?: Date;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  generateOTP(): string;
  verifyOTP(otp: string): boolean;
}

const userSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: true, 
    trim: true, 
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true, 
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'] 
  },
  dateOfBirth: { 
    type: String, 
    required: true 
  },
  googleId: { 
    type: String, 
    sparse: true, 
    unique: true 
  },
  googleEmail: { 
    type: String, 
    sparse: true 
  },
  authMethod: { 
    type: String, 
    enum: ['email', 'google'], 
    default: 'email' 
  },
  otp: { 
    type: String, 
    default: null 
  },
  otpExpiry: { 
    type: Date, 
    default: null 
  },
  isEmailVerified: { 
    type: Boolean, 
    default: false 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: { 
    type: Date, 
    default: null 
  }
}, { 
  timestamps: true 
});

// Generate OTP method
userSchema.methods.generateOTP = function(): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = otp;
  this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return otp;
};

// Verify OTP method
userSchema.methods.verifyOTP = function(otp: string): boolean {
  if (!this.otp || !this.otpExpiry) return false;
  return this.otp === otp && new Date() < this.otpExpiry;
};

export default mongoose.model<IUser>('User', userSchema);
