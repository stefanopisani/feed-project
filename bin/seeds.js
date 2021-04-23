const mongoose = require('mongoose');
const Recipe = require('../models/Recipe.model');
const DB_NAME = 'feed-project';
mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const recipes = [
  {
    title: 'Hummus and Egg Toast',
    description:
      'Protein rich breakfast',
    user: 'seedy_user1',
    imageUrl: 'image-url'
  },
  {
    title: 'Kimchi Pancake',
    description: 'Simple, savory, spicy',
    user: 'seedy_user2',
    imageUrl: 'image-url'
  },
  {
    title: 'Cereal',
    description:
      'More than just milk and muesli',
    user: 'cerealgrl92',
    imageUrl: 'image-url'
  }
];

Recipe.create(recipes)
  .then(recipesFromDB => {
    console.log(`Created ${recipesFromDB.length} recipes`);
    // Once created, close the DB connection
    mongoose.connection.close();
  })
  .catch(err => console.log(`An error occurred while creating books from the DB: ${err}`));