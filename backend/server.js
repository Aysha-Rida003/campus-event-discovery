// Load environment variables from .env into process.env
require('dotenv').config();
// add near the top, with your other requires
const eventRoutes = require('./routes/eventRoutes');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create the Express application
const app = express();

// Middleware: lets our server accept JSON in request bodies
app.use(express.json());

// Middleware: allows our frontend (different origin) to call this API
app.use(cors());
// add after app.use(cors()); and before your app.get('/') route
app.use('/api/events', eventRoutes);

// Connect to MongoDB using the connection string from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// A simple test route to confirm the server is alive
app.get('/', (req, res) => {
  res.send('Campus Event & Club Discovery API is running');
});

// Start the server, listening on the port from .env (or 5000 by default)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});