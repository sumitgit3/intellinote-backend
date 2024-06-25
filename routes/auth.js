/* express.Router
Use the express.Router class to create modular, mountable route handlers. A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”. */
import express from 'express'
import User from '../models/Users.js'
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import fetchUser from '../Middleware/fetchuser.js';

// Load environment variables
dotenv.config();
const router = express.Router();

//ROUTE 1:Create a User using POST "api/auth/createuser": doesn't require login
router.post('/createuser', [
    body('name', "Enter a valid Name").isLength({ min: 5, max: 20 }),
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Enter a password of length at least 8").isLength({ min: 8 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    else {
        try {
            const { name, email, password } = req.body;
            //check if email already exist
            const userExist = await User.findOne({ "email": email });
            if (userExist) {
                return res.status(400).send("Please try a different email. This email already exist");
            }
            //hash password using bcryptjs
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password,salt);
            //User.create return a promise, we are waiting for promise to be resolved
            const user = await User.create({
                name,
                email,
                password: hash
            });
            //create a JWT Token
            const signatureKey = process.env.AUTH_SECRET_KEY;
            const payload = { id: user._id };
            const authToken = jwt.sign(
                payload, 
                signatureKey,
                { expiresIn: '1h' } //token expire in 1h
            );

            res.json({authToken});
        }
        catch (err) {
            res.status(500).send("Internal Server Error");
        }
    }

});
//ROUTE 2:AUTHENTICATE a User using POST "api/auth/login": doesn't require login
const loginValidator = [
    body('email','Please Enter a valid Email').isEmail(),
    body('password','Please enter a password').exists()
];
router.post('/login',loginValidator, async (req,res)=>{
    const errors = validationResult(req);
    //check for error in validation
    if (!errors.isEmpty()) {  
       return res.status(400).json({errors: errors.array() });
    }
    try {
        const {email,password} = req.body;
        //check if email is in database
        const user = await User.findOne({ "email": email });
        if (!user) {
            return res.status(400).send("Please try again with correct credentials ");
        }
        //check if password is correct
        const isPasswordValid =await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).send("Please try again with correct credentials ");
        }
         //create a JWT Token
         const signatureKey = process.env.AUTH_SECRET_KEY;
         const payload = { id: user._id };
         const authToken = jwt.sign(
             payload, 
             signatureKey
              // can add token expire  { expiresIn: '1h' }
         );
         res.status(200).json({authToken});

    }
    catch(err){
        res.status(500).send("Internal Server Error");
    }

})
//ROUTE 3:Get loggedin user details using POST "api/auth/getuser": Login required
//using a middleware to get user id from auth token
router.post('/getuser',fetchUser, async (req,res)=>{
    try{
        //get user Data from database using id
        const user = await User.findById(req.id,{password:0,_id:0,__v:0});
        res.send(user);
    }
    catch(err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});
export default router;