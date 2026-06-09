import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { HttpException } from "../exceptions/http-exception";
import { IUser } from "../models/user.model";
import { UserMongoRepository } from "../repositories/user.repository";
import { SECRET_KEY } from "../configs/constant";

const userRepository = new UserMongoRepository();

export class UserService {
    async createUser(userData: CreateUserDTO): Promise<IUser> {
        const existingEmail = await userRepository.getUserByEmail(userData.email);
        if (existingEmail) {
            throw new HttpException(400, "Email already exists");
        }

        const hashedPassword = await bcryptjs.hash(userData.password, 10);
        const user = await userRepository.createUser({
            ...userData,
            password: hashedPassword,
        });

        return user;
    }

    async loginUser(loginData: LoginUserDTO) {
        const user = await userRepository.getUserByEmail(loginData.email);
        if (!user) {
            throw new HttpException(400, "Invalid email");
        }

        const isPasswordValid = await bcryptjs.compare(
            loginData.password,
            user.password
        );
        if (!isPasswordValid) {
            throw new HttpException(400, "Invalid password");
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: "30d" }
        );

        return { user, token };
    }
}
