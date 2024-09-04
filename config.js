require('dotenv').config(); // Load environment variables

module.exports = {
  viewportWidth: parseInt(process.env.VIEWPORT_WIDTH, 10) || 960,
  viewportHeight: parseInt(process.env.VIEWPORT_HEIGHT, 10) || 1080,
  korailUrl: process.env.WEBPAGE_URL,
  trainType: process.env.TRAIN_TYPE,
  maxRetries: parseInt(process.env.MAX_RETRIES, 10) || 1000,
  emailTo: process.env.EMAIL_TO
};