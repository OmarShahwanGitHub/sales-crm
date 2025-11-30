const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema({
  // References
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },

  // Call Details
  callType: {
    type: String,
    enum: ['outbound', 'inbound', 'follow-up', 'demo', 'proposal', 'negotiation', 'closing'],
    required: true
  },
  subject: {
    type: String,
    required: [true, 'Call subject is required']
  },

  // Call Outcome
  outcome: {
    type: String,
    enum: ['qualified', 'proposal-sent', 'negotiation', 'closed-won', 'closed-lost', 'no-answer', 'voicemail', 'callback-requested', 'not-interested'],
    required: true
  },

  // Duration and Status
  duration: {
    type: Number, // in minutes
    default: 0
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'closed'],
    default: 'open'
  },

  // Notes and Communication
  notes: {
    type: String,
    required: [true, 'Call notes are required']
  },

  // Deal Information (when deal is closed)
  dealInfo: {
    dealValue: Number,
    contractTerm: String,
    startDate: Date,
    renewalDate: Date
  },

  // Follow-up
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  followUpNotes: String,

  // Timestamps
  callDate: {
    type: Date,
    default: Date.now
  },
  closedDate: Date

}, {
  timestamps: true
});

// Index for faster queries
callLogSchema.index({ agent: 1, callDate: -1 });
callLogSchema.index({ client: 1, callDate: -1 });

module.exports = mongoose.model('CallLog', callLogSchema);
