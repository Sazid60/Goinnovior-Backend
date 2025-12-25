import { Request, Response } from "express";

import httpStatus from 'http-status';
import { userService } from "./user.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";



const register = catchAsync(async (req: Request, res: Response) => {

    const result = await userService.register(req);
    console.log(result)
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