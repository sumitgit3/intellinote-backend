import { connect } from 'mongoose';
//import dotenv from 'dotenv'
//dotenv.config();

//const mongoURI = process.env.MONGO_URI;
const mongoURI = 'mongodb://127.0.0.1:27017/';
const connectToMongo =  ()=>{
  connect(mongoURI)
 .then((res)=>{console.log("connected")})
 .catch((err)=>{console.log(err)});
}

export default connectToMongo;