
import { Request, Response } from "express";
import httpStatus from 'http-status';
import { cmsService } from "./cms.service";
import { cmsValidation } from "./cms.validation";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const createBanner = catchAsync(async (req: Request, res: Response) => {
    const validated = cmsValidation.createBannerSchema.parse(req.body);
    const banner = await cmsService.createBanner(validated);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Banner created successfully!",
        data: banner
    });
});

const getBanners = catchAsync(async (req: Request, res: Response) => {
    const banners = await cmsService.getBanners();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Banners retrieved successfully!",
        data: banners
    });
});

const getBannerById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const banner = await cmsService.getBannerById(id);
    if (!banner) {
        sendResponse(res, {
            statusCode: httpStatus.NOT_FOUND,
            success: false,
            message: "Banner not found",
            data: null
        });
        return;
    }
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Banner retrieved successfully!",
        data: banner
    });
});

const updateBanner = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const validated = cmsValidation.updateBannerSchema.parse(req.body);
    const banner = await cmsService.updateBanner(id, validated);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Banner updated successfully!",
        data: banner
    });
});

export const cmsController = {
    createBanner,
    getBanners,
    getBannerById,
    updateBanner
};
