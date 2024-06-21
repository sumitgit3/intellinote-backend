/* express.Router
Use the express.Router class to create modular, mountable route handlers. A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”. */
import express from 'express';
import fetchUser from '../Middleware/fetchuser.js';
import Notes from '../models/Notes.js';
import { body, validationResult } from 'express-validator';
// Create a new router instance
const router = express.Router();

//ROUTE 1:Fetch all user notes using GET containing token "api/notes/fetchallnotes": Login required
router.get('/fetchallnotes',fetchUser, async (req,res)=>{
    try {
        const allNotes =await Notes.find({user:req.id});
        res.send(allNotes);
    } 
    catch (err) {
        res.send("Internal Server Error");
    }
});
//ROUTE 2:Add a note using POST containing token "api/notes/addnote": Login required
 const validateNote = [
    body('title','Please Enter a valid title').isLength({min:3}),
    body('description','Description must be atleast 5 characters').isLength({min:5})
];
router.post('/addnote',fetchUser,validateNote,async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {title,description,tag} = req.body;
        const note = await Notes.create({
            title,
            description,
            tag,
            user:req.id
        });
        res.send(note);
    } 
    catch (err) {
        res.status(500).send("Internal Server Error");
    }
});
//ROUTE 2:Modify a note using PUT containing authtoken "api/notes/updatenote": Login required
router.put('/updatenote/:id',fetchUser,validateNote,async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {title,description,tag} = req.body;
        const newNote = {};
        if(title) newNote.title = title;
        if(description) newNote.description = description;
        if(tag) newNote.tag = tag;

        //check if updating their own note
        let note = await Notes.findById(req.params.id);
        if(note && (note.user.toString() !== req.id)){
           return res.status(401).send("Not Allowed");
        }
        //Give response if note exists or not
        if(!note) return res.status(404).send("Not found");

        note = await Notes.findByIdAndUpdate(req.params.id,{$set: newNote},{new : true});
        res.json(note);
        
    } 
    catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});
export default router;