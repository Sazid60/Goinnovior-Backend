import { Client, Role } from "@prisma/client";
import { deleteImageFromCloudinary } from "../../../config/cloudinary.config";
import prisma from "../../../shared/prisma";
import config from "../../../config";
import bcrypt from "bcryptjs";
import { Request } from "express";



const register = async (req: Request): Promise<Client> => {

    let imageUrl = "";

    imageUrl = req.file?.path || "";

    const existingUser = await prisma.user.findUnique({
        where: { email: req.body.client.email }
    });

    if (existingUser) {
        if (imageUrl) await deleteImageFromCloudinary(imageUrl);
        throw new Error("User with this email already exists");
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, Number(config.salt_round))

    const userData = {
        email: req.body.client.email,
        password: hashedPassword,
        role: Role.USER,
        name: req.body.client.name 
    }
    console.log(userData)

    try {
        const result = await prisma.$transaction(async (transactionClient) => {
            await transactionClient.user.create({
                data: {
                    ...userData,
                }
            });

            const createdClientData = await transactionClient.client.create({
                data: {
                    ...req.body.client,
                    profilePhoto: imageUrl
                }
            });

            return createdClientData;
        });

        return result;
    } catch (error) {
        if (imageUrl) await deleteImageFromCloudinary(imageUrl);
        throw error;
    }
};


export const userService = {
    register
};