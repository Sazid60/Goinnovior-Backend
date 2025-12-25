
import { Role } from "@prisma/client";
import { Router } from "express";




const router = Router()


router.post('/register', async (req, res, next) => {
    res.send('User register route')
});



export const UserRoutes = router