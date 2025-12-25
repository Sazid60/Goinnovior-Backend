import express from 'express';
import { UserRoutes } from '../modules/User/user.routes';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { CMSRoutes } from '../modules/CMS/cms.routes';



const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/cms',
        route: CMSRoutes
    }

];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;