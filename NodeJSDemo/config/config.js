// config.js

require('dotenv').config();

module.exports = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "SECRET_KEY",
  MONGO_URI: process.env.MONGO_URI || `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '27017'}/${process.env.DB_NAME || 'evolvenode'}`,
  DB_CONFIG: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "evolvenode",
  },
};
