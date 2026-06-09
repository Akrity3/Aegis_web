import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
// import morgan from "morgan";
import { HttpException } from "./exceptions/http-exception";
import userRoutes from "./routes/user.route";
import { ApiResponseHelper } from "./utils/apihelper.util";

const app: Application = express();

const corsOptions = {
    origin: ["*"],
    successStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(morgan("combined"));

app.use("/api/v1/auth", userRoutes);

app.use((_req: Request, res: Response) => {
    return res.status(404).json({ message: "API not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Error:", err);
    if (err instanceof HttpException) {
        return ApiResponseHelper.error(res, err.message, err.status);
    }
    return ApiResponseHelper.error(
        res,
        err?.message || "Internal Server Error",
        500
    );
});

export default app;
