const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean']
  },
  address: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Add any instance methods here
profileSchema.methods.toJSON = function() {
  const profile = this.toObject();
  delete profile.__v;
  return profile;
};

// Add any static methods here
profileSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile; 