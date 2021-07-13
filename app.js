import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import config from "./config.js";
import userRoute from "./routes/userRoute.js"
import postRoute from "./routes/postRoute.js"


const app = express();
app.use(express.json());

dotenv.config();
app.use(morgan('tiny'));

mongoose.connect(config.MONGODB_URL ,  
{ useNewUrlParser: true , useUnifiedTopology: true }, (err)=>{

if(err) return console.error(err);

console.log("Connected to MongoDb");
});

const PORT = process.env.PORT || 3002;

app.get("/",(req,res)=>{
    res.send("server accessible");
})

//User Routes
app.use('/api/users', userRoute);

//Posts Routes
app.use("/api/posts",postRoute);



app.listen(PORT, ()=> console.log(`Server is running up at ${PORT}`));
