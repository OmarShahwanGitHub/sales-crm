const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  // Sales rep who manages this lead/contact
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Contact Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  jobTitle: {
    type: String,
    trim: true
  },

  // Company Information
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  industry: {
    type: String,
    enum: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Education', 'Real Estate', 'Other'],
    default: 'Other'
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    default: '1-10'
  },
  website: {
    type: String,
    trim: true
  },

  // Address
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String, default: 'USA' }
  },

  // Sales Pipeline Information
  opportunityStage: {
    type: String,
    enum: ['lead', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
    default: 'lead'
  },
  dealValue: {
    type: Number,
    default: 0
  },
  probability: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  expectedCloseDate: {
    type: Date
  },
  closedDate: {
    type: Date
  },

  // Additional Info
  leadSource: {
    type: String,
    enum: ['Website', 'Referral', 'Cold Call', 'Email Campaign', 'Social Media', 'Trade Show', 'Partner', 'Other'],
    default: 'Other'
  },
  preferredContactMethod: {
    type: String,
    enum: ['Email', 'Phone', 'In-Person', 'Video Call'],
    default: 'Email'
  },
  notes: String,

  // Important Dates
  lastContactDate: Date,
  nextFollowUpDate: Date

}, {
  timestamps: true
});

// Virtual for full name
clientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
clientSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Ensure virtuals are included in JSON
clientSchema.set('toJSON', { virtuals: true });
clientSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Client', clientSchema);
