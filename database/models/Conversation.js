import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true
  },
  senderRole: {
    type: String,
    enum: ['speaker', 'signer', 'system'],
    default: 'speaker'
  },
  originalText: {
    type: String,
    default: ''
  },
  glossSequence: [
    {
      type: String
    }
  ],
  translatedSpeech: {
    type: String,
    default: ''
  },
  detectedGesture: {
    type: String,
    default: null
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 1.0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ConversationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Sign Dialogue Session'
    },
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        name: String,
        role: {
          type: String,
          enum: ['hearing', 'deaf', 'interpreter', 'guest']
        }
      }
    ],
    roomCode: {
      type: String,
      index: true
    },
    status: {
      type: String,
      enum: ['active', 'ended', 'archived'],
      default: 'active',
      index: true
    },
    sourceLanguage: {
      type: String,
      default: 'en'
    },
    targetSignDialect: {
      type: String,
      default: 'ISL'
    },
    messages: [MessageSchema],
    startedAt: {
      type: Date,
      default: Date.now
    },
    endedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const Conversation = mongoose.model('Conversation', ConversationSchema);

