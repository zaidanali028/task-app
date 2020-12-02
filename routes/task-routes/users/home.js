const express = require("express");
const User = require("../../../models/User");
const Task = require("../../../models/task");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../../middlewares/auth");
//Status Codes
//200=Ok!
//201=Something has been Created!
//400=Bad Request!
//500=INTERNAL server error
//404=When something is not found
//503=Service unavailable
//401=Unauthorized

//Registering a user
router.post("/", async (req, res) => {
  const { name, email, password, age } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res.status(400).send({ error: "User already Exists!" });
  }
  const newUser = await new User({
    name,
    email,
    password,
    age,
  });
  await newUser.save();
  const token = await newUser.AuhthToken();

  res.status(201).send({ token, newUser });
});
//Login in User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body)
  const user = await User.loginFunc(email, password);
  //user.AuthToken is referencing the authenticated user above
  const token = await user.AuhthToken();

  res.status(200).send({ user, token });
});

//Logout with authenticated user's token
router.post("/logout", auth, async (req, res) => {
  try {
    const user = req.user;
    const userToken = req.token;
    //console.log(user,userToken)
    user.userTokens = user.userTokens.filter((token) => {
      return token.token != userToken;
      //The above line is simple,if the  gotten looped token is not equal to the user's token,then I will leave it in the array
      //And remove it if otherwise
    });
    await user.save();
    res.status(200).send({ success: "Successfully Killed Session" });
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

//logout all authenticated tokens
router.post("/logloutall", auth, async (req, res) => {
  try {
    const user = req.user;
    const userToken = req.token;
    user.userTokens.splice(0, user.userTokens.length);
    //Am looping through the userTokens array and removing all tokens from 0 index upto the last one
    await user.save();
    res.status(200).send({ success: "Deleted all user tokens" });
  } catch (e) {
    res.status(500).send({ error: "Error deleting tokens" });
  }
});

//Getting authenticated an user
router.get("/profile", auth, async (req, res) => {
  const user = req.user;
  res.status(200).send(user);
});

//Editing userProfile
router.patch("/me", auth, (req, res) => {
  const { body } = req;
  //The body constant will return the fields the user changed.
  //maybe if its name and email,that place will be {email,name}=req.body
  const user = req.user;
  // //Checking if user update is valid
  let userUpdate = Object.keys(body);
  //am getting the keys from the object the user is sending to the erver. i.e:name,email,age,password
  let allowedUpdates = ["name", "email", "age"];
  let canUpdate = userUpdate.every((update) => {
    //checking if the key is in the allowedUpdates array
    return allowedUpdates.includes(update);
  });
  if (!canUpdate) {
    return res.status(400).send({ error: "RESOURCE NOT FOUND!" });
  }
  try {
    userUpdate.forEach(async (update) => {
      user[update] = req.body[update];
      //This is like user.name=req.body.name
      await user.save();
      res.status(200).send(user);
    });
  } catch (e) {
    res.status(400).send({ error: e });
  }
});

//Changing Password
router.patch("/update/mypassword", auth, async (req, res) => {
  let { password, current } = req.body;
  const user = req.user;
  try {
    const isMatch = bcrypt.compare(current, user.password);
    if (isMatch) {
      user.password = password;
      await user.save();
      return res.status(200).send(user);
    }
    res
      .status(400)
      .send({
        error: "Your Old Password Did Not Match With What You Provided",
      });
  } catch (e) {
    res.status(400).send({ error: err });
  }

  
});

router.delete("/me", auth, async (req, res) => {
  try {
    const user = req.user;
    await user.remove();
    
    res.status(200).send({user});
  } 
  catch (e) {
    res.status(400).send({ error: e });
  }
});

module.exports = router;
