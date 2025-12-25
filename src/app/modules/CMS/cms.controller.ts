import { Request, Response } from "express";
import httpStatus from "http-status";
import { cmsService } from "./cms.service";
import { cmsValidation } from "./cms.validation";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const createBanner = catchAsync(async (req: Request, res: Response) => {
  const banner = await cmsService.createBanner(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Banner created successfully!",
    data: banner,
  });
});

const getBanner = catchAsync(async (req: Request, res: Response) => {
  const banner = await cmsService.getBanner();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Banner retrieved successfully!",
    data: banner,
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
    data: banner,
  });
});

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await cmsService.createProduct(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully!",
    data: product,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validated = cmsValidation.updateProductSchema.parse(req.body);
  const product = await cmsService.updateProduct(id, validated);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully!",
    data: product,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await cmsService.deleteProduct(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product deleted successfully!",
    data: null,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await cmsService.getAllProducts(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const cmsController = {
  createBanner,
  getBanner,
  updateBanner,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
};
