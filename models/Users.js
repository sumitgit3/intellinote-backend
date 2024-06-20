import mongoose from "mongoose";

// Define the schema for the User collection
const UserSchema = new mongoose.Schema({
   name: {
    type: String,
    required: true
   },
   email: {
    type: String,
    required: true,
    unique: true  // Unique index on email field
   },
   password: {
    type: String,
    required: true
   },
   date: {
    type: Date,
    default: Date.now
   }
});

// Create a Mongoose model for the User collection
const User = mongoose.model('User', UserSchema);

// Export the model
export default User;
