import mongoose from 'mongoose';

const AccountVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    code: {
      type: String,
      required: true,
      length: 6,
      index: true
    },
    token: {
      type: String,
      default: ''
    },
    verified: {
      type: Boolean,
      default: false,
      index: true
    },
    verifiedAt: {
      type: Date,
      default: null
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // MongoDB TTL index to auto-remove unverified codes
    },
    attempts: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const AccountVerification = mongoose.model('AccountVerification', AccountVerificationSchema);

