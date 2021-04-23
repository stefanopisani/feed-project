const mongoose = require('mongoose');
const {
  Schema,
  model
} = mongoose;

const recipeSchema = new Schema({
  title: String,
  description: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User' // relates to the Author model
  },
  imageUrl: String
}, {
  timestamps: true
});

module.exports = model('Recipe', bookSchema);