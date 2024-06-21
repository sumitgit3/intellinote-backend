
import  mongoose  from "mongoose";

const NotesSchema = new mongoose.Schema({
   //contain the id of user whose note is this
   user :{
      type : mongoose.Schema.Types.ObjectId,
      ref : 'User'
   },
   title:{
    type:String,
    required:true
   },
   description:{
    type : String,
    required : true,
   },
   tag : {
    type:String,
    default: "general"
   },
   date: {
    type: Date,
    default : Date.now
   }
  });

  const Notes = mongoose.model('Notes',NotesSchema);
  export default Notes;