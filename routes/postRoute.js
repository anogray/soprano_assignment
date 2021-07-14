import express from "express";
import { isAuth } from "../util.js";
import Post from "../model/postModel.js";

const router = express.Router();
//isAuth middleware is needed in all routes to see/update/modify data
//route for getting all users posts
router.get("/all", isAuth, async (req, res) => {
  try{
    const data = await Post.find({});
    console.log("get allusers Posts", data);
    return res.status(200).json({ "success":true, "posts": data });

  }catch(err){
    return res.status(200).json({ "status":"false", "errorMessage":err.message });

  }
});

//route for getting only posts created by user
router.get("/", isAuth, async (req, res) => {
  try {
    
    const data = await Post.find({ user: req.user._id });
    res.status(200).json({ "sucess":true, "posts": data });
  } catch (err) {
    res.status(200).json({"sucess":false, msg:err.message});
  }
});

//route for getting a specific post
router.get("/:id", isAuth, async (req, res) => {

  try{
    const postId = req.params.id;
    const postData = await Post.findById(postId);
    if (postData) {
      return res.status(200).json({ Post: postData });
    } else {
      return res.status(404).send({ success:false, msg: "Post Not Found" });
    }
  }catch(err){
    return res.status(404).send({ success:false, msg: err.message });
  }
});

//route for creating a new Post
router.post("/", isAuth, async (req, res) => {
  try{
    const { title, description, image } = req.body;
  
    if (!title || !description || !image) {
      return res
        .status(400)
        .json({ errorMessage: "Please fill complete fields !" });
    }
  
    const newPost = new Post({
      user: req.user._id,
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
    });
  
    const newPosted = await newPost.save();
  
    if (newPosted) {
      return res
        .status(201)
        .send({ message: "New Post Created", data: newPosted });
    }
    return res.status(500).send({ success:false, message: " Error in Creating Post." });

  }catch(err){
    return res.status(500).send({ success:false, message: err.message });

  }
});

//route for a user who can removing a post with id
router.delete("/:id", isAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const deletedProduct = await Post.deleteOne({_id:id});
    if (deletedProduct) {
      res.status(202).send({ message: "Post Deleted" });
    } else {
      res.statu(404).send("Error in Deletion.");
    }
  } catch (err) {
    res.status(404).send({ errorMessage: "Post not found" });
  }
});

//route for updating the Post
router.put("/:id", isAuth, async (req, res) => {
  try {
    const updatePost = req.body;
    const updatedPost = await Post.updateOne(
      { _id: req.params.id },
      updatePost
    );
    res.status(201).json({ "Data updated ": "Post Updated" });
  } catch (err) {
    res.status(404).json({ errorMessage: "Error in Updating Unkown Post " });
  }
});

export default router;
