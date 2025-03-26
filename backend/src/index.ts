import express, { Request, Response } from "express";
import cookieParser from 'cookie-parser';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(cookieParser());


import userRouter from './routes/user.routes';
import todoRouter from './routes/todo.routes';

app.use('/api/v1/users', userRouter);
app.use('/api/v1/todos', todoRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`App is running on PORT: ${PORT}`);
});