const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupLocation: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lon: Number
    }
  },
  destination: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lon: Number
    }
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  passengers: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  luggage: {
    type: Number,
    required: true,
    min: 0
  },
  vehicleType: {
    type: String,
    enum: ['sedan', 'suv', 'van'],
    required: true
  },
  price: {
    base: {
      type: Number,
      required: true
    },
    distance: {
      type: Number,
      required: true
    },
    time: {
      type: Number,
      required: true
    },
    luggage: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  distance: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
reservationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema); 