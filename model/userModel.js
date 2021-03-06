  
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String, required: true , useCreateIndex: true,
  },
  password: { type: String, required: true },
  image: {type:String, required:true},
  loggedIn:{type:Boolean, required: true, default:true},
  loginId:{type:mongoose.Schema.Types.ObjectId}
});

const User = mongoose.model('user', userSchema);

export default User ;