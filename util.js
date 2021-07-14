import jwt from 'jsonwebtoken';
import config from './config.js';
import User from ".//model/userModel.js";

// function for creating a jwt token and returned when being sent in response
const getToken = (user) => {

  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      loginId: user.loginId
    },
    config.JWT_SECRET,
    {
      expiresIn: '48h',
    }
  );
};

//authenticating function / middleware function inorder to check if user is logged in/verified with jwt token
const isAuth = (req, res, next) => {

  try{
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, config.JWT_SECRET, async(err, decode) => {
        if (err) {
          return res.status(400).send({ success:true, message: 'Invalid Token' });
        }
        req.user = decode;
        let loggedInUser = await User.findById(req.user._id);

        if(!loggedInUser.loggedIn){
          return res.status(401).send({ success:false, message: 'Token is invalid.' });
        }
        await User.updateOne({_id:req.user_id}, {loggedIn:true});
        
        next();
        return;
      });
    } else {
      return res.status(401).send({success:false,  message: 'Token is not supplied.' });
    }
  }catch(err){
    return res.status(401).send({success:false,  message: err.message });

  }
  };

const validateEmail = (emailAdress)=>
{
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  
  return regexEmail.test(String(emailAdress).toLowerCase());

}

  export { getToken, isAuth, validateEmail };