// Load environment variables from .env into process.env
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import our event routes
const eventRoutes = require('./routes/eventRoutes');

// Create the Express application
const app = express();

// Middleware: lets our server accept JSON in request bodies
app.use(express.json());

// Middleware: allows our frontend (different origin) to call this API
app.use(cors({
  origin: 'https://campus-event-discovery.vercel.app'
}));

// Connect to MongoDB using the connection string from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Mount our event routes — any request to /api/events/* is handled by eventRoutes.js
app.use('/api/events', eventRoutes);

// A simple test route to confirm the server is alive
app.get('/', (req, res) => {
  res.send('Campus Event & Club Discovery API is running');
});

// Start the server, listening on the port from .env (or 5000 by default)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});