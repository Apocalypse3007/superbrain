"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentSchema = exports.SigninSchema = exports.SignupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.SignupSchema = zod_1.default.object({
    name: zod_1.default.string().min(1),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(1),
});
exports.SigninSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(1),
});
exports.ContentSchema = zod_1.default.object({
    title: zod_1.default.string().min(1),
    link: zod_1.default.string().url(),
    type: zod_1.default.enum(["youtube", "twitter", "instagram", "link"]),
    tags: zod_1.default.array(zod_1.default.string()).min(1).optional()
});
