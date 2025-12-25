import { Router, Request, Response, NextFunction } from "express";
import { cmsController } from "./cms.controller";
import { cmsValidation } from "./cms.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
    "/banner",
    multerUpload.single("video"),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.file) req.body.video = req.file.path;
        if (req.body.data) {
            const parsed = JSON.parse(req.body.data);
            req.body = { ...parsed, video: req.body.video };
        }
        req.body = cmsValidation.createBannerSchema.parse(req.body);
        return cmsController.createBanner(req, res, next);
    }
);

router.get("/banner", cmsController.getBanners);
router.get("/banner/:id", cmsController.getBannerById);
router.patch(
    "/banner/:id",
    multerUpload.single("video"),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.file) req.body.video = req.file.path;
        if (req.body.data) {
            const parsed = JSON.parse(req.body.data);
            req.body = { ...parsed, video: req.body.video };
        }
        req.body = cmsValidation.updateBannerSchema.parse(req.body);
        return cmsController.updateBanner(req, res, next);
    }
);

export const CMSRoutes = router;