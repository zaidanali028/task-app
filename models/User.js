const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Email Is Not Valid");
        }
      },
      trim: true,
      lowercase: true,
    },
    age: {
      type: Number,
      validate: (value) => {
        if (value < 0) {
          throw new Error("Age cannot be a negative number");
        }
      },
      required: true,
      maxlength: 3,
    },
    password: {
      type: String,
      required: true,
      validate: (value) => {
        if (value.length < 6) {
          throw new Error(
            "Password length should be at least,6(six) characters"
          );
        }
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot be "password"');
        }
      },
      trim: true,
    },
    userTokens: [
      {
        token: {
          type: String,
          required: true,
        }
      }
    ]
  },
  { timestamps: true }
);

//Adding a function to the user schema
User.statics.loginFunc = async (email, password) => {
  //the userMOdel can be accessessed from here,don't worry :)
  const user = await userMOdel.findOne({ email: email });
  if (!user) {
    throw new Error("User Does Not Exist");
  }
  const isMAtch = await bcrypt.compare(password, user.password);

  if (!isMAtch) {
    throw new Error("Wrong User Password");
  }
  return user;

  
};

//Adding a function to a single User
User.methods.AuhthToken = async function () {
    //Getting the specific user who invoked this function
    const user = this;
    const token = await jwt.sign({ _id: user._id.toString() }, "myfirstjsw");
    //Adding token to user's Field in the database
    user.userTokens = await user.userTokens.concat({token });
    await  user.save()




  }; 
const userMOdel = mongoose.model("users", User);
module.exports = userMOdel;
