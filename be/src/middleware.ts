import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "./config";
import jwt from "jsonwebtoken";

export const middleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers["authorization"] ?? "";

    if (!JWT_SECRET) {
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

        // @ts-ignore
        req.userId = decoded.id;

        next();
    } catch (err) {
        res.status(403).json({ message: "Unauthorized" });
    }
};
