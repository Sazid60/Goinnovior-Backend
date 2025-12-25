import { Request } from "express";
import prisma from "../../shared/prisma";
import { Prisma } from "@prisma/client";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import pick from "../../shared/pick";
import { paginationHelper } from "../../helpers/paginationHelper";
import ApiError from "../../errors/ApiError";
import httpStatus from 'http-status-codes';

const createBanner = async (req: Request) => {
    let videoUrl = "";
    videoUrl = req.file?.path || "";
    try {
        const existingBanner = await prisma.banner.findFirst({
            where: { title: req.body.title, email: req.body.email }
        });
        if (existingBanner) {
            throw new Error("Banner with this title and email already exists");
        }
        const bannerData: Prisma.BannerCreateInput = {
            ...req.body,
            video: videoUrl
        };
        const banner = await prisma.banner.create({ data: bannerData });
        return banner;
    } catch (error) {
        if (videoUrl) {
            console.log("Deleting from Cloudinary:", videoUrl);
            await deleteImageFromCloudinary(videoUrl);
        }
        throw error;
    }
};

const getBanner = async () => {
    return prisma.banner.findFirstOrThrow();
};

const updateBanner = async (id: string, reqOrBannerData: any) => {
    let videoUrl = "";
    let bannerData: Prisma.BannerUpdateInput;
    if (reqOrBannerData && reqOrBannerData.file) {
        videoUrl = reqOrBannerData.file?.path || "";
        bannerData = { ...reqOrBannerData.body, video: videoUrl };
    } else {
        bannerData = reqOrBannerData;
    }
    try {
        if (bannerData.video) {
            const oldBanner = await prisma.banner.findUnique({ where: { id } });
            if (!oldBanner) {
                throw new ApiError(httpStatus.NOT_FOUND, "Banner not found");
            }
            if (oldBanner && oldBanner.video && oldBanner.video !== bannerData.video) {
                await deleteImageFromCloudinary(oldBanner.video);
            }
        }
        const updated = await prisma.banner.update({ where: { id }, data: bannerData });
        return updated;
    } catch (error) {
        if (videoUrl) {
            console.log("Deleting from Cloudinary (update):", videoUrl);
            await deleteImageFromCloudinary(videoUrl);
        }
        throw error;
    }
};

const createProduct = async (req: Request) => {
    let imageUrl = "";
    imageUrl = req.file?.path || "";
    try {
        const existingProduct = await prisma.product.findFirst({
            where: { name: req.body.name }
        });
        if (existingProduct) {
            throw new Error("Product with this name already exists");
        }
        const productData: Prisma.ProductCreateInput = {
            ...req.body,
            image: imageUrl
        };
        const product = await prisma.product.create({ data: productData });
        return product;
    } catch (error) {
        if (imageUrl) {
            console.log("Deleting from Cloudinary (product):", imageUrl);
            await deleteImageFromCloudinary(imageUrl);
        }
        throw error;
    }
};

const updateProduct = async (id: string, reqOrProductData: any) => {
    let imageUrl = "";
    let productData: Prisma.ProductUpdateInput;
    if (reqOrProductData && reqOrProductData.file) {
        imageUrl = reqOrProductData.file?.path || "";
        productData = { ...reqOrProductData.body, image: imageUrl };
    } else {
        productData = reqOrProductData;
    }
    try {
        if (productData.image) {
            const oldProduct = await prisma.product.findUnique({ where: { id } });
            if (!oldProduct) {
                 throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
            }
            if (oldProduct && oldProduct.image && oldProduct.image !== productData.image) {
                await deleteImageFromCloudinary(oldProduct.image);
            }
        }
        const updated = await prisma.product.update({ where: { id }, data: productData });
        return updated;
    } catch (error) {
        if (imageUrl) {
            console.log("Deleting from Cloudinary (product update):", imageUrl);
            await deleteImageFromCloudinary(imageUrl);
        }
        throw error;
    }
};

const deleteProduct = async (id: string) => {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new Error("Product not found");
    if (product.image) {
        await deleteImageFromCloudinary(product.image);
    }
    return prisma.product.delete({ where: { id } });
};

const getAllProducts = async (query: any) => {
    const paginationFields = ["page", "limit", "sortBy", "sortOrder"];
    const filterFields = ["name", "description"];
    const paginationOptions = pick(query, paginationFields);
    const filters = pick(query, filterFields);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(paginationOptions);

    const where: any = {};
    if (filters.name) {
        where.name = { contains: filters.name, mode: "insensitive" };
    }
    if (filters.description) {
        where.description = { contains: filters.description, mode: "insensitive" };
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
        }),
        prisma.product.count({ where })
    ]);

    return {
        meta: {
            page,
            limit,
            total
        },
        data: products
    };
};

export const cmsService = {
    createBanner,
    getBanner,
    updateBanner,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts
};
