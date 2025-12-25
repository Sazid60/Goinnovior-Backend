import { NextFunction, Request, Response } from "express";

import passport from "passport";
import ApiError from "../../errors/ApiError";
import { createUserToken } from "../../helpers/userToken";
import { setAuthCookie } from "../../helpers/setToken";
import { convertExpiresInToMs } from "../../helpers/convertExpiresInToMs";

import httpStatus from "http-status";
import config from "../../config";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import { catchAsync } from "../../shared/catchAsync";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(new ApiError(401, err));
      }

      if (!user) {
        return next(new ApiError(401, info.message));
      }

      const userTokens = await createUserToken(user);

      const { password: pass, ...rest } = user;

      const accessTokenMaxAge = convertExpiresInToMs(
        config.jwt.expires_in,
        1000 * 60 * 60
      );
      const refreshTokenMaxAge = convertExpiresInToMs(
        config.jwt.refresh_token_expires_in,
        1000 * 60 * 60 * 24 * 30
      );

      const tokenInfo = {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        accessTokenMaxAge: accessTokenMaxAge,
        refreshTokenMaxAge: refreshTokenMaxAge,
      };

      setAuthCookie(res, tokenInfo);

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
  }
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new ApiError(httpStatus.BAD_REQUEST, "No Refresh Token Received");
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

    const accessTokenMaxAge = convertExpiresInToMs(
      config.jwt.expires_in,
      1000 * 60 * 60
    );
    const refreshTokenMaxAge = convertExpiresInToMs(
      config.jwt.refresh_token_expires_in,
      1000 * 60 * 60 * 24 * 30
    );

    const cookieInfo = {
      ...tokenInfo,
      accessTokenMaxAge: accessTokenMaxAge,
      refreshTokenMaxAge: refreshTokenMaxAge,
    };

    setAuthCookie(res, cookieInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "New Access Token Generated Successfully",
      data: tokenInfo,
    });
  }
);

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await AuthServices.getMe(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    console.log("Google Callback - User:", user ? "Found" : "Not Found");
    console.log("Google Callback - State:", req.query.state);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
    }

    let redirectTo = req.query.state
      ? decodeURIComponent(req.query.state as string)
      : "";

    if (redirectTo && redirectTo !== "/" && redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    if (redirectTo === "/" || !redirectTo) {
      redirectTo = "";
    }

    const userTokens = createUserToken(user);

    const accessTokenMaxAge = convertExpiresInToMs(
      config.jwt.expires_in,
      1000 * 60 * 60
    );
    const refreshTokenMaxAge = convertExpiresInToMs(
      config.jwt.refresh_token_expires_in,
      1000 * 60 * 60 * 24 * 30
    );

    const tokenInfo = {
      ...userTokens,
      accessTokenMaxAge: accessTokenMaxAge,
      refreshTokenMaxAge: refreshTokenMaxAge,
    };

    setAuthCookie(res, tokenInfo);

    const redirectUrl = redirectTo
      ? `${config.FRONTEND_URL}/${redirectTo}`
      : config.FRONTEND_URL;

    console.log("Google Callback - Redirecting to:", redirectUrl);

    res.redirect(redirectUrl);
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  googleCallbackController,
  getMe,
};
