import mongoose from 'mongoose';

const PasswordResetTokenSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // MongoDB TTL index to auto-remove expired tokens
    },
    used: {
      type: Boolean,
      default: false
    },
    ipAddress: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const PasswordResetToken = mongoose.model('PasswordResetToken', PasswordResetTokenSchema);

