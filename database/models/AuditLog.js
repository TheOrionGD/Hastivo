import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: String,
      required: true,
      default: 'System'
    },
    role: {
      type: String,
      default: 'system'
    },
    action: {
      type: String,
      required: true,
      index: true
    },
    target: {
      type: String,
      default: 'system'
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'error', 'critical'],
      default: 'info',
      index: true
    },
    details: {
      type: String,
      default: ''
    },
    ip: {
      type: String,
      default: '127.0.0.1'
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Cap collection or auto-expire index after 180 days
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 180 * 24 * 60 * 60 });

export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);

