const express = require("express");
const User = require("../../../models/User");
const Task = require("../../../models/task");
const router = express.Router();
const bcrypt = require("bcryptjs");
const {userAuth}=require('../../../middlewares/auth')

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
  const user=  await User.findOne({ email })
    if (user) {
      res.status(400).send({ error: "User already Exists!" });
    }
    const newUser = await new User({
      name,
      email,
      password,
      age,
    });
    await newUser.save()
   const token=await newUser.AuhthToken()

    res.status(201).send({token,newUser})
   
  
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.loginFunc(email, password);
  //user.AuthToken is referencing the authenticated user above
  const token = await user.AuhthToken();

  res.status(200).send({ user, token });
});

//Getting specific user
router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  await User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//Getting all users
router.get("/", userAuth,async (req, res) => {
  await User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  //The body constant will return the fields the user changed.
  //maybe if its name and email,that place will be {email,name}=req.body

  //Checking if user update is valid
  let userUpdate = Object.keys(body);
  //am getting the keys from the object the user is sending to the erver. i.e:name,email,age,password
  let allowedUpdates = ["name", "email", "age",];
  let canUpdate = userUpdate.every((update) => {
    //checking if the key is in the allowedUpdates array
    return allowedUpdates.includes(update);
  });

  if (!canUpdate) {
    return res.status(400).send({ error: "RESOURCE NOT FOUND!" });
  }

  const user = await User.findById(id);
  if (!user) {
      return res.status(404).send({ error: "User not found" });
  }
  userUpdate.forEach((update) => {
    user[update] = req.body[update];
    //This is like user.name=req.body.name

     user.save()
    res.status(200).send(user)

  });
  

});

//Changing Password
router.patch("/update/:id", async (req, res) => {
  let { password, current } = req.body;
  const user = await User.findById(req.params.id).then((user) => {
    if (!user) {
      res.status(404).send({ error: "User Not Found" });
    }

    //console.log(user.password)
    bcrypt.compare(current, user.password, (err, isMatch) => {
      if (err) {
        return res.status(400).send({ error: err });
      }
      if (isMatch) {
          user.password=password
          user.save()
          res.send(user)
          
      } else {
        res
          .status(400)
          .send({
            error: "Your Old Password Did Not Match With What You Provided",
          });
      }
    });
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndUpdate(id).then((user) => {
    if (!user) {
      return res.status(404).send({ error: "User Not Found" });
    }
    user.remove();
    res
      .status(200)
      .send({ success: `User with id ${id} is succesfully removed` });
  });
});

module.exports = router;
