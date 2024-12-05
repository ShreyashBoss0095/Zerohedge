// db/db.js
const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/config');

// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true, // This option is deprecated in MongoDB 4+, but still works for older versions
    useUnifiedTopology: true, // Same here; helps with connection management
})
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Export the mongoose connection
module.exports = mongoose;
