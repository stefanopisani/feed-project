const mongoose = require('mongoose');
const {
  Schema,
  model
} = mongoose;

const favoriteSchema = new Schema({
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = model('Favorite', favoriteSchema);