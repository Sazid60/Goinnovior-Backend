import prisma from "../../shared/prisma";
import { Prisma } from "@prisma/client";

const createBanner = async (bannerData: Prisma.BannerCreateInput) => {
    return prisma.banner.create({ data: bannerData });
};

const getBanners = async () => {
    return prisma.banner.findFirst();
};

const getBannerById = async (id: string) => {
    return prisma.banner.findUnique({ where: { id } });
};

const updateBanner = async (id: string, bannerData: Prisma.BannerUpdateInput) => {
    return prisma.banner.update({ where: { id }, data: bannerData });
};

export const cmsService = {
    createBanner,
    getBanners,
    getBannerById,
    updateBanner
};
