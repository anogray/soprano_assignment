import jwt from 'jsonwebtoken';
import config from './config.js';

// function for creating a jwt token and returned when being sent in response
const getToken = (user) => {

  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    config.JWT_SECRET,
    {
      expiresIn: '48h',
    }
  );
};

//authenticating function / middleware function inorder to check if user is logged in/verified with jwt token
const isAuth = (req, res, next) => {

    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, config.JWT_SECRET, (err, decode) => {
        if (err) {
          return res.status(401).send({ message: 'Invalid Token' });
        }
        req.user = decode;
        next();
        return;
      });
    } else {
      return res.status(401).send({ message: 'Token is not supplied.' });
    }
  };

const validateEmail = (emailAdress)=>
{
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  
  return regexEmail.test(String(emailAdress).toLowerCase());

}

  export { getToken, isAuth, validateEmail };