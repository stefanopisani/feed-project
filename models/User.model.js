const mongoose = require('mongoose');
const {
  Schema,
  model
} = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  bio: String,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  imageUrl: String
});

module.exports = model('User', userSchema);