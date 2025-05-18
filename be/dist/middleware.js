"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const config_1 = require("./config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers["authorization"]) !== null && _a !== void 0 ? _a : "";
    if (!config_1.JWT_SECRET) {
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        res.status(403).json({ message: "Unauthorized" });
    }
};
exports.middleware = middleware;
