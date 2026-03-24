const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true, // Prevents duplicate accounts
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    path: {
      type: String,
      required: [true, 'Please select a path (Tech, Arts, etc.)'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('User', userSchema);