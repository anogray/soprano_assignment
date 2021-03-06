import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    description : {type: String, required : true}
  });
  
  const Post = mongoose.model('post', postSchema);
  
  export default Post;