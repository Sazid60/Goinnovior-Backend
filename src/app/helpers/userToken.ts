import httpStatus from "http-status-codes";
import { jwtHelper } from "./jwtHelper";
import config from "../config";

import { Status, User } from "@prisma/client";

import ApiError from "../errors/ApiError";
import prisma from "../shared/prisma";





export const createUserToken = (user: Partial<User>) => {
    const jwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtHelper.generateToken(
        jwtPayload,
        config.jwt.jwt_secret as string,
        config.jwt.expires_in as string
    );

    const refreshToken = jwtHelper.generateToken(
        jwtPayload,
        config.jwt.refresh_token_secret as string,
        config.jwt.refresh_token_expires_in as string
    );

    return { accessToken, refreshToken };
};


export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = jwtHelper.verifyToken(
        refreshToken,
        config.jwt.refresh_token_secret as string
    )

    if (!verifiedRefreshToken || !verifiedRefreshToken.email) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
    }

    const user = await prisma.user.findUnique({
        where: { email: verifiedRefreshToken.email },
    });

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User does not exist");
    }


    if (user.status === Status.BLOCKED) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            `Sorry! You are blocked.`
        );
    }

    const jwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtHelper.generateToken(
        jwtPayload,
        config.jwt.jwt_secret as string,
        config.jwt.expires_in as string
    );

    const newRefreshToken = jwtHelper.generateToken(
        jwtPayload,
        config.jwt.refresh_token_secret as string,
        config.jwt.refresh_token_expires_in as string
    );


    return { accessToken, refreshToken: newRefreshToken };
};
