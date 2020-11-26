const jwt=require('jsonwebtoken')
const User=require('../models/User')

module.exports={
  
  userAuth: async function (req,res,next){
    try{
      const token=req.header('Authorization').replace('Bearer ','')
      const verifyData=jwt.verify(token,'myfirstjsw')
      const user=await user.findOne({_id:verifyData._id.toString(),'userTokens.token':token})
      if(!user){
        throw new Error()
      }

      req.user=user
      next()
    }
    catch (e) {
      res.status(401).send({error: "Please login"});
  }



  }
           
  
} 
