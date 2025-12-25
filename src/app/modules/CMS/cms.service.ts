import { Request } from "express";
import prisma from "../../shared/prisma";
import { Prisma } from "@prisma/client";
import {
  deleteImageFromCloudinary,
  uploadBufferToCloudinary,
} from "../../config/cloudinary.config";
import pick from "../../shared/pick";
import { paginationHelper } from "../../helpers/paginationHelper";

const createBanner = async (req: Request) => {
  let videoUrl = "";

  // Upload file buffer to Cloudinary if file exists
  if (req.file) {
    videoUrl = await uploadBufferToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );
  }

  try {
    const existingBanner = await prisma.banner.findFirst({
      where: { title: req.body.title, email: req.body.email },
    });
    if (existingBanner) {
      throw new Error("Banner with this title and email already exists");
    }
    const bannerData: Prisma.BannerCreateInput = {
      ...req.body,
      video: videoUrl,
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

const updateBanner = async (id: string, bannerData: any, req?: Request) => {
  let videoUrl = "";
  let updateData: Prisma.BannerUpdateInput;

  // Handle file upload if present
  if (req && req.file) {
    videoUrl = await uploadBufferToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );
    updateData = { ...bannerData, video: videoUrl };
  } else {
    updateData = bannerData;
  }

  try {
    if (updateData.video) {
      const oldBanner = await prisma.banner.findUnique({ where: { id } });
      if (
        oldBanner &&
        oldBanner.video &&
        oldBanner.video !== updateData.video
      ) {
        await deleteImageFromCloudinary(oldBanner.video);
      }
    }
    const updated = await prisma.banner.update({
      where: { id },
      data: updateData,
    });
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

  // Upload file buffer to Cloudinary if file exists
  if (req.file) {
    imageUrl = await uploadBufferToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );
  }

  try {
    const existingProduct = await prisma.product.findFirst({
      where: { name: req.body.name },
    });
    if (existingProduct) {
      throw new Error("Product with this name already exists");
    }
    const productData: Prisma.ProductCreateInput = {
      ...req.body,
      image: imageUrl,
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

const updateProduct = async (id: string, productData: any, req?: Request) => {
  let imageUrl = "";
  let updateData: Prisma.ProductUpdateInput;

  // Handle file upload if present
  if (req && req.file) {
    imageUrl = await uploadBufferToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );
    updateData = { ...productData, image: imageUrl };
  } else {
    updateData = productData;
  }

  try {
    if (updateData.image) {
      const oldProduct = await prisma.product.findUnique({ where: { id } });
      if (
        oldProduct &&
        oldProduct.image &&
        oldProduct.image !== updateData.image
      ) {
        await deleteImageFromCloudinary(oldProduct.image);
      }
    }
    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });
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
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

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
    prisma.product.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: products,
  };
};

export const cmsService = {
  createBanner,
  getBanner,
  updateBanner,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
};
