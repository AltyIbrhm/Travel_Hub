const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  emergencyName: {
    type: String,
    required: true,
    trim: true
  },
  emergencyPhone: {
    type: String,
    required: true,
    trim: true
  },
  emergencyRelationship: {
    type: String,
    required: true,
    enum: ['Parent', 'Spouse', 'Sibling', 'Friend', 'Other']
  }
}, {
  timestamps: true
});

// Add any instance methods here
emergencyContactSchema.methods.toJSON = function() {
  const contact = this.toObject();
  delete contact.__v;
  return contact;
};

// Add any static methods here
emergencyContactSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactSchema);

module.exports = EmergencyContact; 