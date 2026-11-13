import mongoose from 'mongoose';

const ModerationRecordSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      enum: ['message', 'user', 'transcript', 'system_event'],
      required: true,
      index: true
    },
    targetId: {
      type: String,
      required: true,
      index: true
    },
    flaggedBy: {
      type: String,
      enum: ['ai_filter', 'user_report', 'admin_review'],
      default: 'ai_filter'
    },
    reason: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true
    },
    contentSnippet: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed', 'escalated'],
      default: 'pending',
      index: true
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolutionNote: {
      type: String,
      default: ''
    },
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const ModerationRecord = mongoose.model('ModerationRecord', ModerationRecordSchema);

