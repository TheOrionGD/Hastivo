import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    displayName: {
      type: String,
      trim: true,
      default: ''
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator', 'guest'],
      default: 'user',
      index: true
    },
    status: {
      type: String,
      enum: ['active', 'restricted', 'suspended', 'deactivated'],
      default: 'active',
      index: true
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    restrictions: [
      {
        type: String,
        enum: ['chat_disabled', 'translation_throttled', 'video_disabled', 'moderation_flagged']
      }
    ],
    restrictionExpiresAt: {
      type: Date,
      default: null
    },
    lastLoginAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model('User', UserSchema);

