import { Request, Response } from "express";
import { z } from "zod";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { UserService } from "../services/user.service";
import { ApiResponseHelper } from "../utils/apihelper.util";

const userService = new UserService();

export class UserController {
    async createUser(req: Request, res: Response) {
        try {
            const userData = CreateUserDTO.safeParse(req.body);
            if (!userData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(userData.error),
                    400
                );
            }

            const user = await userService.createUser(userData.data);
            const safeUser = {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            };

            return ApiResponseHelper.success(
                res,
                safeUser,
                "User registered successfully",
                201
            );
        } catch (error: unknown) {
            const err = error as { message?: string; status?: number };
            return ApiResponseHelper.error(
                res,
                err.message || "Internal Server Error",
                err.status || 500
            );
        }
    }

    async loginUser(req: Request, res: Response) {
        try {
            const parsedData = LoginUserDTO.safeParse(req.body);
            if (!parsedData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(parsedData.error),
                    400
                );
            }

            const { user, token } = await userService.loginUser(parsedData.data);
            const safeUser = {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            };

            return ApiResponseHelper.success(
                res,
                { user: safeUser, token },
                "Login successful"
            );
        } catch (error: unknown) {
            const err = error as { message?: string; status?: number };
            return ApiResponseHelper.error(
                res,
                err.message || "Internal Server Error",
                err.status || 500
            );
        }
    }
}
