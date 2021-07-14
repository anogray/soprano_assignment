import express from "express";
import { getToken, isAuth, validateEmail } from "../util.js";
import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

//creating a new user to register
router.post("/register", async (req, res) => {
  try {
    
    const { name, email, password, verifyPassword, image } = req.body;
    console.log("reqformdata",req.body);

    //validating the field to register
    if (!email || !password || !verifyPassword || !image) {
      return res
        .status(400)
        .json({ errorMessage: "Please fill complete fields !" });
    } else if (password !== verifyPassword) {
      return res
        .status(400)
        .json({
          errorMessage: "Please enter same password as password field !",
        });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ errorMessage: " Invalid Email Format !" });
    }

    //hashing the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //checking if an email is already present in the db/system
    const checkUser = await User.findOne({ email: email });

    if (checkUser) {
      return res
        .status(400)
        .json({ errorMessage: "Email is already registered !" });
    }

    //saving the new user
    const user = new User({
      name: name,
      email: email,
      password: passwordHash,
      image: image,
      loginId: new ObjectId()
    });

    const newUser = await user.save();

    //setting up the header by adding the token
    res.setHeader("authorization", getToken(newUser));

    res.status(200).send({
      name: newUser.name,
    });
  } catch (err) {
    res.status(409).json({ message: `${err.message} Invalid User Data.` });
  }
});

//route for user signin
router.post("/signin",  async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ errorMessage: "Please fill complete fields !" });
    }

    const signinUser = await User.findOne({ email: email });
    console.log({ signinUser });

    if (!signinUser) {
      return res
        .status(400)
        .json({ errorMessage: "Wrong email or password !" });
    }

    const correctPassword = await bcrypt.compare(password, signinUser.password);

    //if password entered is wrong
    if (!correctPassword) {
      return res
        .status(400)
        .json({ errorMessage: "Wrong email or password !" });
    }

    signinUser.loginId = new ObjectId();
    signinUser.loggedIn = true;

    res.setHeader("authorization", getToken(signinUser));
    let loggedInUser = await User.findById(signinUser._id);
    console.log("loggedin",loggedInUser,"signinUser",signinUser._id);
    await User.updateOne({_id:loggedInUser._id}, signinUser );

    return res.status(200).json({
      Message: `User logged in ${signinUser.name}`,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(401).send({ message: "Invalid Email or Password." });
  }
});

//route for a user to signout
router.post("/signout", isAuth, async (req, res) => {
  // res.removeHeader("authorization");

  try{
    let loggedInUser = await User.findById(req.user._id);
    if(req.user.loginId != loggedInUser.loginId){
      return res.status(401).send({ success:false, message: "Unauthorized  !" });
  
    }
    
    console.log({loggedInUser});
    const logOut = await User.updateOne({_id:loggedInUser._id}, {loggedIn:false});
    return res.status(200).send({ message: "User Signed out !" });

  }catch(err){
    return res.status(404).send({ success:false, message: err.message });

  }
  
});

export default router;
