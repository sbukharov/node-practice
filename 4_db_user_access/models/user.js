var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

//User schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    profileimage: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

/** 
  External function allowing to search for users by id.
  @param {number} id the id of the user
*/
module.exports.getUserById = function(id, callback) {
  User.findById(id,callback);
}

/** 
  External function allowing to search for users by username.
  @param {number} id the username of the user
*/
module.exports.getUserByUsername = function(username, callback) {
  var query = {username: username};
  User.findOne(query, callback);
}

/** 
  External function allowing to compare candidate password to user password.
  @param {string} candidateFunction the candidate hash
  @param {string} hash the password hash to compare to the candidate passwordpassword
*/
module.exports.comparePassword = function(candidatePassword, hash, callback) {
  // Load hash from your password DB.
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      callback(null, isMatch);
  });
}

/** 
  External function allowing to create user by passing in new User.
  @param newUser, new user to create, should include:
    username (String)
    password (String)
    email (String)
    name (String)
    profileimage (String) (optional)
*/
module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash; 
        newUser.save(callback);
      });
    });  
}