import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from 'http-status';
import { userService } from "./user.service";



const register = catchAsync(async (req: Request, res: Response) => {

    const result = await userService.register(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Client Created successfully!",
        data: result
    })
});


export const userControllers = {
    register
};