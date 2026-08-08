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

module.exports = router;