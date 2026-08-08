const mongoose = require('mongoose');

// A Schema defines the "shape" of documents in this collection —
// what fields exist, their types, and validation rules.
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true // removes accidental leading/trailing spaces
  },
  club: {
    type: String,
    required: [true, 'Club name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // automatically adds createdAt and updatedAt fields
});

// Compile the schema into a Model — this gives us an object
// we can use to create, read, update, and delete documents.
// Mongoose will store these in a MongoDB collection called "events"
// (it auto-lowercases and pluralizes the model name "Event").
module.exports = mongoose.model('Event', eventSchema);