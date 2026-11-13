import mongoose from 'mongoose';

const UserPreferencesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    uiLanguage: {
      type: String,
      enum: ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'ur'],
      default: 'en'
    },
    targetSignDialect: {
      type: String,
      enum: ['ISL', 'ASL', 'BSL'],
      default: 'ISL'
    },
    avatarSpeed: {
      type: Number,
      min: 0.5,
      max: 2.0,
      default: 1.0
    },
    voiceOutputGender: {
      type: String,
      enum: ['female', 'male', 'neutral'],
      default: 'female'
    },
    voicePitch: {
      type: Number,
      min: 0.5,
      max: 1.5,
      default: 1.0
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'light'
    },
    accentColor: {
      type: String,
      default: 'coral'
    },
    highContrastMode: {
      type: Boolean,
      default: false
    },
    onboardingCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const UserPreferences = mongoose.model('UserPreferences', UserPreferencesSchema);

