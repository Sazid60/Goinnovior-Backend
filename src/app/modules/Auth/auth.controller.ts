import { NextFunction, Request, Response } from "express"

import passport from "passport"
import ApiError from "../../errors/ApiError"
import { createUserToken } from "../../helpers/userToken"
import { setAuthCookie } from "../../helpers/setToken"

import httpStatus from 'http-status';
import config from "../../config"
import { AuthServices } from "./auth.service"
import { sendResponse } from "../../shared/sendResponse"
import { catchAsync } from "../../shared/catchAsync"

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate("local", async (err: any, user: any, info: any) => {
        if (err) {


            return next(new ApiError(401, err))
        }

        if (!user) {
            return next(new ApiError(401, info.message))
        }

        const userTokens = await createUserToken(user)


        const { password: pass, ...rest } = user


        setAuthCookie(res, userTokens)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            }
        })
    })(req, res, next)
})
const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        throw new ApiError(httpStatus.BAD_REQUEST, "No Access Token Received")
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken)

    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Generated Successfully",
        data: tokenInfo
    })
})


const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;

    let redirectTo = req.query.state ? req.query.state as string : ""

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User Not Found")
    }

    const tokenInfo = createUserToken(user)

    setAuthCookie(res, tokenInfo)

    res.redirect(`${config.FRONTEND_URL}/${redirectTo}`)

})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    googleCallbackController
};