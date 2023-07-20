const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  encryptedImages: {
    type: [String],
    required: true,
  },
  // hash of each round
  roundHash:{
    type:[String],
    required: true
  },
  captions: {
    type: [String]
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
