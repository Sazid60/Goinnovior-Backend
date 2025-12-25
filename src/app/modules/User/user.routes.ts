

import { NextFunction, Request, Response, Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { userValidation } from "./user.validation";
import { userControllers } from "./user.controller";




const router = Router()


router.post(
    "/register",
    multerUpload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createClient.parse(JSON.parse(req.body.data))
        return userControllers.register(req, res, next)
    }
);

router.get("/:id", userControllers.getUserById);



export const UserRoutes = router