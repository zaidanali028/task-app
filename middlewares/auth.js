const jwt=require('jsonwebtoken')
const User=require('../models/User')

const auth = async (req, res, next)=>{
    
    try {
        
        const token = req.header('Authorization').replace('Bearer ','');
        const verifyData = jwt.verify(token, 'put your jwt secret here');
        const user = await User.findOne({_id:verifyData._id, 'userTokens.token':token});

        if(!user) {
            throw new Error()
        };
        req.token = token
        req.user = user;
        next();

    } catch (error) {
        res.status(401).send({error:'Please Login'})
    }
}

module.exports = auth;
