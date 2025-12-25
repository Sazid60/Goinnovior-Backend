import { z } from "zod";

export const createBannerSchema = z.object({
    title: z.string().nonempty("Title is required"),
    description: z.string().nonempty("Description is required"),
    email: z.string().nonempty("Email is required"),
    phone: z.string().nonempty("Phone is required")
});

export const updateBannerSchema = z.object({
    video: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional()
});

export const createProductSchema = z.object({
    name: z.string().nonempty("Name is required"),
    description: z.string().nonempty("Description is required"),
    maxPrice: z.number(),
    minPrice: z.number(),
    quantity: z.number(),
});

export const updateProductSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    maxPrice: z.number().optional(),
    minPrice: z.number().optional(),
    quantity: z.number().optional(),
    image: z.string().optional(),
});

export const cmsValidation = {
    createBannerSchema,
    updateBannerSchema,
    createProductSchema,
    updateProductSchema
};
