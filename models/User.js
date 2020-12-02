const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Task=require('../models/User')

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

//Any time user triggers user.remove() ,I will remove the user's tasks
User.pre('remove', async function(next){
  const user=this
  await Task.deleteMany({worker:user._id})
  //Deleting many where Worker has the authenticated user's id
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

 //User is known
User.methods.AuhthToken=function(){
  const user=this
  const token=jwt.sign({_id:user._id.toString()},'myfirstjsw')
  user.userTokens=user.userTokens.concat({token:token})
  user.save()
  return token

}

//This method prevents a user from seeing his/her array of tokens or password when res.send(user)
//is triggered
User.methods.toJSON= function(){
  const user=this
  const userObject=user.toObject()
  delete userObject.password
  delete userObject.userTokens

  return userObject
}


//Creating a virtual property to match Users and their Tasks
User.virtual('Tasks',{
  ref:'tasks',
  localField:'_id',
  foreignField:'worker'
})
//ref:references the collection in the other db
//localField:The middleman b/n Users and Tasks, that is the User._id
//foreignField:The object property that relates to the User

//the 'tasks' field can be anything
const userMOdel = mongoose.model("users", User);
module.exports = userMOdel;
