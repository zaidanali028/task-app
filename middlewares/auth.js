const User = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports = {
  userAuth: (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    //  console.log(token)
    const verifyData = jwt.verify(token, "myfirstjsw");
    //  console.log(verifyData._id)
    const user = User.findOne({
      _id: verifyData._id.toString(),
      "userTokens.token": token,
    });
    //'userTokens.token':'token' am checking the user the server returned if he/she still has the token he/she provided
    //in the req.header
    //console.log('Am working!')
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
    return res.status(401).send({ error: "Invalid User" });
  },
};
