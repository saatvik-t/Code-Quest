import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { judgeRouter } from './routes/judge.js';
import { problemRouter } from './routes/problems.js';
import { runRouter } from './routes/run.js';
import DBConnection from './database/db.js';
import express, { urlencoded } from 'express';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/judge', judgeRouter);
app.use('/problems', problemRouter);
app.use('/run', runRouter);

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