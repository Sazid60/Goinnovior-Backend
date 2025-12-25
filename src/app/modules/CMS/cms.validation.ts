import { z } from "zod";

export const createBannerSchema = z.object({
    video: z.string().nonempty("Video is required"),
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

export const cmsValidation = {
    createBannerSchema,
    updateBannerSchema
};
