const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// @route   POST /api/events
// @desc    Create a new event
router.post('/', async (req, res) => {
  try {
    // req.body contains the JSON the frontend sent us
    const { title, club, category, date, venue, description } = req.body;

    // Create a new Event document using our model
    const newEvent = new Event({ title, club, category, date, venue, description });

    // Save it to MongoDB — this is where Mongoose validates
    // against the "required" rules we defined in the schema
    const savedEvent = await newEvent.save();

    // 201 = "Created" — the correct HTTP status for a successful POST
    res.status(201).json(savedEvent);
  } catch (err) {
    // 400 = "Bad Request" — likely a validation error (missing field, etc.)
    res.status(400).json({ error: err.message });
  }
});

// @route   GET /api/events
// @desc    Get all events — supports optional search, filter by club/category, and date filtering
// Example: /api/events?search=workshop&club=Coding Club&category=Tech
router.get('/', async (req, res) => {
  try {
    const { search, club, category, date } = req.query;

    // Build a MongoDB query object step by step, only adding
    // conditions the user actually asked for
    let query = {};

    if (search) {
      // $regex does a partial text match; 'i' means case-insensitive
      // $or means "match if EITHER title OR description contains this text"
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (club) {
      query.club = club;
    }

    if (category) {
      query.category = category;
    }

    if (date) {
      // Match events on this exact calendar day, regardless of time-of-day stored
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    // .sort({ date: 1 }) orders soonest events first
    const events = await Event.find(query).sort({ date: 1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/events/:id
// @desc    Get one event by its MongoDB ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   PUT /api/events/:id
// @desc    Update an existing event
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,           // return the UPDATED document, not the old one
        runValidators: true  // re-apply our schema's required/validation rules on update
      }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully', deletedEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;