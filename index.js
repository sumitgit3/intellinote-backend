import connectToMongo from './db.js';
import express from 'express';
//import route handler
import authRouter from './routes/auth.js'
import notesRouter from './routes/notes.js'
import cors from 'cors';
//connect to dataBase
connectToMongo();


const app = express()
const port = 5000
//use req-->use middleware to make it happen
app.use(express.json());
//use cors middleware
app.use(cors());
//available routes
app.use('/api/auth',authRouter);
app.use('/api/notes',notesRouter);

app.get('/', (req, res)=> {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`intelliNote app listening on port ${port}`)
})

