const mongoose = require('mongoose');
const {
  Schema,
  model
} = mongoose;

const recipeSchema = new Schema({
  title: String,
  description: String,
<<<<<<< HEAD
  user: String,
  // {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User' // relates to the Author model
  // },
=======
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
>>>>>>> e63cf323ecff6033ce1f7646f5b9f3138fdcf259
  imageUrl: String
}, {
  timestamps: true
});

module.exports = model('Recipe', recipeSchema);