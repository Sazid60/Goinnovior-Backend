
import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import config from "../../config";
import { AuthControllers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";


const router = Router()

router.post("/login", AuthControllers.credentialsLogin)
router.post("/refresh-token", AuthControllers.getNewAccessToken)

router.get(
    '/me',
    auth(Role.ADMIN, Role.USER),
    AuthControllers.getMe
)

router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})

router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${config.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!` }), AuthControllers.googleCallbackController)




export const AuthRoutes = router