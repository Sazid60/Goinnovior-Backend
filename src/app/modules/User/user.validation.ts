
import { Role } from "@prisma/client";
import { z } from "zod";




export const createClient = z.object({
    password: z.string({
        error: "Password is required",
    }),

    client: z.object({
        name: z.string({
            error: "Name is required!",
        }),

        email: z.string({
            error: "Email is required!",
        }),

        contactNumber: z.string({
            error: "Contact Number is required!",
        }),

    }),
});




const sharedFields = {
    name: z.string().optional(),
    profilePhoto: z.string().url().optional(),
    contactNumber: z.string().optional()
};


const updateAdmin = z.object({
    role: z.literal(Role.ADMIN).optional(),
    admin: z.object({
        ...sharedFields,
    }).partial(),
});


const updateClient = z.object({
    role: z.literal(Role.USER).optional(),
    client: z.object({
        ...sharedFields
    }).partial(),
});




 const updateProfile = z.union([updateAdmin, updateClient]);

export const userValidation = {
    createClient,
    updateProfile
};