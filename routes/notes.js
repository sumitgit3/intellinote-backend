/* express.Router
Use the express.Router class to create modular, mountable route handlers. A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”. */


import express from 'express';

// Create a new router instance
const router = express.Router();

router.get('/',(req,res)=>{
    res.send([])
});

export default router;