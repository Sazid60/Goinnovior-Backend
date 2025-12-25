import { Request } from "express";
import prisma from "../../shared/prisma";
import { Prisma } from "@prisma/client";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

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

const getBanners = async () => {
    return prisma.banner.findMany();
};

const getBannerById = async (id: string) => {
    return prisma.banner.findUnique({ where: { id } });
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

export const cmsService = {
    createBanner,
    getBanners,
    getBannerById,
    updateBanner
};
