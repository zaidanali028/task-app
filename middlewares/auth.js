const jwt=require('jsonwebtoken')
const User=require('../models/User')

module.exports={
  
  userAuth: async function (req,res,next){
    try{
      const token=req.header('Authorization').replace('Bearer ','')
      const verifyData=jwt.verify(token,'myfirstjsw')
      const user = await User.findOne({_id:verifyData._id,'userTokens.token':token})
      if(!user){
        throw new Error()
      }

      req.token = token
      req.user=user
      next()
    }
    catch (e) {
      res.status(401).send({error: "Please login"});
  }



  }
           
  
} 
