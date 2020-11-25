const User=require('../models/User')
const jwt=require('jsonwebtoken')

module.exports={
    userAuth: async (req,res,next)=>{


      try{
        const token = req.header("Authorization").replace("Bearer ", "");
        const verifyData = jwt.verify(token, 'myfirstjsw');
        const user = await User.findOne({_id: verifyData._id, "userTokens.token": token});

        req.token = token;
        req.user = user;
        next()
    }catch (e) {
        res.status(401).send({error: "Please login"});
    }



        }
             
    
} 