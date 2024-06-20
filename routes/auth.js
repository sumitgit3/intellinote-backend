/* express.Router
Use the express.Router class to create modular, mountable route handlers. A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”. */
import express from 'express'
import User from '../models/Users.js'
import { body, validationResult } from 'express-validator';


const router = express.Router();
//create a User using POST "api/auth": doesn't require authentication
router.post('/', [
    body('name', "Enter a valid Name").isLength({ min: 5, max: 20 }),
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Enter a password of length at least 8").isLength({ min: 8 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    const {name,email,password} = req.body;
    User.create({
        name,
        email,
        password:password
    }).then(user => res.json(user))
        .catch(err => {
            res.json({ error: "Please enter a unique email" })
        });
});

export default router;