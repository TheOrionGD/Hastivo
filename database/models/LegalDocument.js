import mongoose from 'mongoose';

const LegalDocumentSchema = new mongoose.Schema(
  {
    docType: {
      type: String,
      enum: ['privacy_policy', 'terms_and_conditions'],
      required: true,
      unique: true,
      index: true
    },
    version: {
      type: String,
      required: true
    },
    effectiveDate: {
      type: String,
      required: true
    },
    revisionDate: {
      type: String,
      required: true
    },
    requiresAcknowledgement: {
      type: Boolean,
      default: true
    },
    sections: [
      {
        id: String,
        title: String,
        content: String
      }
    ],
    history: [
      {
        version: String,
        date: String,
        summary: String
      }
    ]
  },
  {
    timestamps: true
  }
);

export const LegalDocument = mongoose.model('LegalDocument', LegalDocumentSchema);

