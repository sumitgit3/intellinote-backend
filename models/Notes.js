
import  mongoose  from "mongoose";

const NotesSchema = new mongoose.Schema({
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
    type: date,
    default : Date.now,
   }
  });

  const Notes = mongoose.model('Notes',NotesSchema);
  export default Notes;