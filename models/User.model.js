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
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
<<<<<<< HEAD
    }
  });

module.exports = model('User', userSchema);

=======
  }
});

module.exports = model('User', userSchema);
>>>>>>> e63cf323ecff6033ce1f7646f5b9f3138fdcf259
