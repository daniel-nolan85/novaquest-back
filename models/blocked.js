const mongoose = require('mongoose');

const blockedSchema = new mongoose.Schema(
  {
    email: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model('Blocked', blockedSchema);
