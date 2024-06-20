/* express.Router
Use the express.Router class to create modular, mountable route handlers. A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”. */
import express from 'express'
//import model of user
import User from '../models/Users.js'   

const router = express.Router();
//create a User using POST "api/auth": doesn't require authentication
router.post('/',(req,res)=>{
    const user = new User(req.body);
    user.save();
    res.send("Welcome to authentication")
});

export default router;