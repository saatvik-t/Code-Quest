import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import DBConnection from './database/db.js';
import express, { urlencoded } from 'express';

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.use("/auth", authRouter);

app.get('/', (req, res) => {
    res.send('Hello world')
});

DBConnection().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port : ${port}`);
    });
}).catch((error) => {
    console.error('Failed to connect to the database :', error);
});