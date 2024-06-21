import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const fetchUser = (req,res,next)=>{
    //get token from request
    const token = req.header('auth-token');
    //if token is not present in request
    if(!token) {
       return  res.status(401).send("Please authenticate using a valid token");
    }
    try{
        //verify token // function verify return the payload object
        const data = jwt.verify(token,process.env.AUTH_SECRET_KEY);
        //change request and added id from token
        req.id = data.id;
        //call the next middleware function
        next();
    }
    catch(err){
         res.status(401).send("Please authenticate using a valid token");
    }

}

export default fetchUser;