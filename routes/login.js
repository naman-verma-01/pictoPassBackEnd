const express = require("express");
const router = express.Router();

const User = require("../model/User.js");
//const decryptImage = require("../utils/decryption");
const decryptWithPrivateKey = require("./decryptWithPrivateKey.js");

require("dotenv").config();
const NUM_IMAGES_PER_SET = Number(process.env.NUM_IMAGES_PER_SET);
const TOTAL_ITERATIONS = Number(process.env.TOTAL_ITERATIONS);

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

    let user = await User.findOne({ email: req.body.email })

    console.log("REQ NUMBER => ", req.body.iterationNum)

    if (user) {
      if (req.body.iterationNum === TOTAL_ITERATIONS) {
        console.log("COMPARING", req.body.passwordHash, user.passwordHash)
        if (req.body.passwordHash === user.passwordHash) {
          return res.status(200).json({ msg: "login successful" });
        } else {
          return res.status(200).json({ msg: "login unsuccessful" });
        }
      } else {


        if (req.body.iterationNum > 0 && user.roundHash[req.body.iterationNum - 1] !== req.body.thisRoundHash) {
          let unsplash = await fetch("https://api.unsplash.com/photos/random?client_id=Yt4yF7Azqh58X5uQ7KTaVqQiQ6Ja4X5aRzMiND8Rcu4&count=12")

          let response = await unsplash.json()

          let imageCount = NUM_IMAGES_PER_SET;
          let imagesLink = []
          console.log("FALSE HASH RESPINSE")
          console.log(user.roundHash[req.body.iterationNum],req.body.thisRoundHash)
          for (let i = 0; i <= imageCount; i++) {
            imagesLink.push(response[i].urls.raw + "&crop=faces&fit=crop&h=250&w=250")
          }

          shuffleArray(imagesLink);

          return res.status(200).json({ images: imagesLink, caption: user.captions[req.body.iterationNum] });
        }

        let correctImage = user.encryptedImages[req.body.iterationNum]

        let correctImageLink = await decryptWithPrivateKey(correctImage)
        console.log("correctImageLink", correctImageLink)
        let imagesLink = [correctImageLink]

        let unsplash = await fetch("https://api.unsplash.com/photos/random?client_id=Yt4yF7Azqh58X5uQ7KTaVqQiQ6Ja4X5aRzMiND8Rcu4&count=12")

        let response = await unsplash.json()

        let imageCount = NUM_IMAGES_PER_SET;

        for (let i = 1; i <= imageCount; i++) {
          imagesLink.push(response[i - 1].urls.raw + "&crop=faces&fit=crop&h=250&w=250")
        }

        shuffleArray(imagesLink);

        return res.status(200).json({ userFound:true,images: imagesLink, caption: user.captions[req.body.iterationNum] });
      }
    } else {
      return res.status(200).json({ userFound:false,msg: "USER NOT FOUND" });
    }

  });
  return router;
};
