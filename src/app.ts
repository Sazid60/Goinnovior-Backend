
import cookieParser from 'cookie-parser';
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express()
// Parse Cookie header and populate req.cookies with an object keyed by cookie names
// This middleware is essential for reading cookies sent by the client (e.g., for authentication, sessions, preferences)
// Allows you to easily access cookies via req.cookies in your route handlers
app.use(cookieParser())



app.use(cors({
    origin: ['http://localhost:3000', 'https://yourdomain.com'],
    credentials: true
}));

app.use(express.json());


app.use(express.urlencoded({ extended: true }));


app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "Goinnovior Task Running Successfully"
    })
});

// use the router 

// global error handler 

// not found route 

export default app;