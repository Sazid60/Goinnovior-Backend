import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

import expressSession from "express-session";
import config from "./app/config";
import passport from "passport";
import "./app/config/passport";

const app: Application = express();

app.use(
  expressSession({
    secret: config.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.set("trust proxy", 1);

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    return next();
  }
  express.json({ limit: "50mb" })(req, res, next);
});

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    return next();
  }
  express.urlencoded({ extended: true, limit: "50mb" })(req, res, next);
});

app.use(
  cors({
    origin: [config.FRONTEND_URL],
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Goinnovior Task Running Successfully",
  });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use(notFound);

export default app;
