
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

// parser 
// Parse incoming JSON payloads (e.g. from fetch / axios requests)
// Allows access to request body via req.body for APIs
app.use(express.json());

// Parse URL-encoded form data (e.g. HTML <form> submissions)
// Required to read form fields sent as application/x-www-form-urlencoded
// `extended: true` enables rich objects & arrays in form data
app.use(express.urlencoded({ extended: true }));


// basic usage 
app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "Uns Chat App is running"
    })
});

// use the router 

// global error handler 

// not found route 

export default app;