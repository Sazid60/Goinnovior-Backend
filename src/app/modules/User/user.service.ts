import { AuthProvider, Client, Provider, Role, User } from "@prisma/client";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

import config from "../../config";
import bcrypt from "bcryptjs";
import { Request } from "express";
import prisma from "../../shared/prisma";



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
    }
    console.log(userData)

    try {
        const result = await prisma.$transaction(async (transactionClient) => {
            const user = await transactionClient.user.create({
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

            await transactionClient.authProvider.create({
                data: {
                    provider: Provider.CREDENTIALS,
                    providerId: req.body.client.email,
                    userId: user.id
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