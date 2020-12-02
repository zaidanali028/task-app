const jwt=require('jsonwebtoken')
const User=require('../models/User')

const auth= async (req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        //myfirstjsw
        const decoded=jwt.verify(token,'myfirstjsw')
        const user=await User.findOne({_id:decoded._id,'userTokens.token':token})
        if(!user){
            throw new Error()
        }
        req.user=user
        req.token=token
        next()
    }
    catch(e){
        res.status(401).send({error:'Please login'})
    }

}

module.exports=auth