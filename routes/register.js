const express = require("express");
const router = express.Router();

const User = require("../model/User.js");

require("dotenv").config();
const NUM_IMAGES_PER_SET = Number(process.env.NUM_IMAGES_PER_SET);

const shuffleArray = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));

    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};

module.exports = (unsplash) => {
  
  
  router.post("/", async (req, res) => {
    const userData = req.body;
    console.log("userData",userData)
    const user = await User.findOne({ email: userData.email })

    if (user) {
      return res.status(200).json({ msg: "user already exists" });
    }
    else {
      try {
        let newUser = await new User({
          name: userData.name,
          email: userData.email,
          encryptedImages: userData.encryptedImages,
          captions: userData.captions,
          passwordHash: userData.passwordHash,
          roundHash:userData.roundHash
        });
        let data = await newUser.save()

        if (data) {
          return res.status(200).json({ msg: "registeration successful" });
        } else {
          return res.status(500).json({ msg: "couldn't save new user" });
        }
      } catch (error) {
        console.log("error",error)
      }

    }
   
    
  });
  return router;
};
