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


//Am saying brfore saving a user,this function should execute
User.pre('save', async function(next){
    // before saving a user
    const user=this
    //checking if password was modified ny the user
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,10)
    }
    next()
})

//Adding a function to the user schema
//We dont know the user yet,so we use .statics
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
//We know the user,so wuserAuth,ser's Field in the database
  //   user.userTokens = await user.userTokens.concat({token });
  //   await  user.save()

 


  // }; 
const userMOdel = mongoose.model("users", User);
module.exports = userMOdel;
