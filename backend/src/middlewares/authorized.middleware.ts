import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";
import { HttpException } from "../exceptions/http-exception";
import { IUser } from "../models/user.model";
import { UserMongoRepository } from "../repositories/user.repository";
import { ApiResponseHelper } from "../utils/apihelper.util";

declare global {
    namespace Express {
        interface Request {
            user?: Record<string, unknown> | IUser;
        }
    }
}

const userRepository = new UserMongoRepository();

export const authorizedMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new HttpException(401, "Unauthorized: invalid JWT");
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new HttpException(401, "Unauthorized: JWT missing");
        }

        const decodedToken = jwt.verify(token, SECRET_KEY) as Record<string, unknown>;
        if (!decodedToken?.id) {
            throw new HttpException(401, "Unauthorized: JWT unverified");
        }

        const user = await userRepository.getUserById(String(decodedToken.id));
        if (!user) {
            throw new HttpException(401, "Unauthorized: user not found");
        }

        req.user = user;
        return next();
    } catch (err: unknown) {
        const error = err as { message?: string; status?: number };
        return ApiResponseHelper.error(
            res,
            error.message || "Internal Server Error",
            error.status || 500
        );
    }
};
