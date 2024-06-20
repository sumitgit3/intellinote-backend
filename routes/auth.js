/* express.Router
Use the express.Router class to create modular, mountable route handlers. A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”. */
import express from 'express'
import User from '../models/Users.js'
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();
//create a User using POST "api/auth/createuser": doesn't require login
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
            const authToken = jwt.sign(
                { id: user._id }, 
                signatureKey,
                { expiresIn: '1h' } //token expire in 1h
            );

            res.json({authToken});
        }
        catch (err) {
            console.log(err.message);
            res.status(500).send("Some error occured");
        }
    }

});

export default router;