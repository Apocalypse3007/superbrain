"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("./middleware");
const config_1 = require("./config");
const db_1 = require("./db");
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const types_1 = require("./types");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.SignupSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        return res.json({
            error: "Incorrect inputs"
        });
    }
    try {
        const hashedPwd = yield bcrypt_1.default.hash(parsedData.data.password, 10);
        const user = yield db_1.Usermodel.create({
            email: parsedData.data.email,
            password: hashedPwd,
            name: parsedData.data.name,
        });
        return res.json({
            userId: user.id
        });
    }
    catch (error) {
        console.log(error);
        res.status(411).json({
            error: "User already exists"
        });
    }
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        return res.json({
            error: "Incorrect inputs"
        });
    }
    try {
        const user = yield db_1.Usermodel.findOne({
            email: parsedData.data.email
        });
        if (!user) {
            return res.json({
                error: "User not found"
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(parsedData.data.password, user.password);
        if (!isPasswordValid) {
            return res.json({
                error: "Invalid password"
            });
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id
        }, config_1.JWT_SECRET);
        res.json({
            token
        });
    }
    catch (e) {
        console.log(e);
        res.status(411).json({
            error: "Something went wrong"
        });
    }
}));
app.post("/content", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.ContentSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        return res.json({
            error: "Not login"
        });
    }
    try {
        const contentData = {
            title: parsedData.data.title,
            link: parsedData.data.link,
            userId: req.userId
        };
        if (parsedData.data.tags && parsedData.data.tags.length > 0) {
            const tagPromises = parsedData.data.tags.map((tagTitle) => __awaiter(void 0, void 0, void 0, function* () {
                let tag = yield db_1.Tagmodel.findOne({ title: tagTitle });
                if (!tag) {
                    tag = yield db_1.Tagmodel.create({ title: tagTitle });
                }
                return tag._id;
            }));
            const tagIds = yield Promise.all(tagPromises);
            contentData.tags = [{
                    tags: tagIds
                }];
        }
        const content = yield db_1.Contentmodel.create(contentData);
        return res.json({
            contentId: content.id
        });
    }
    catch (e) {
        console.log(e);
        res.status(411).json({
            error: "Something went wrong"
        });
    }
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
