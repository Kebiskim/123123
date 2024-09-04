require('dotenv').config(); // Load environment variables

module.exports = {
  viewportWidth: parseInt(process.env.VIEWPORT_WIDTH, 10) || 960,
  viewportHeight: parseInt(process.env.VIEWPORT_HEIGHT, 10) || 1080,
  korailUrl: process.env.WEBPAGE_URL,
  memberNumber: process.env.MEMBER_NUMBER,
  password: process.env.PASSWORD,
  startLocation: process.env.START_LOCATION,
  endLocation: process.env.END_LOCATION,
  dateId: process.env.DATE_ID,
  departureTime: process.env.DEPARTURE_TIME,
  trainType: process.env.TRAIN_TYPE,
  maxRetries: parseInt(process.env.MAX_RETRIES, 10) || 1000,
  emailTo: process.env.EMAIL_TO
};