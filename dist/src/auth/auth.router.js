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
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_service_1 = require("./auth.service");
const verifyJWT_1 = __importDefault(require("../middleware/verifyJWT"));
const prisma_1 = require("../../db/prisma");
const utils_1 = require("../../utils/utils");
exports.authRouter = express_1.default.Router();
exports.authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const foundUser = yield (0, auth_service_1.findUser)(username);
        if (!foundUser) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const match = yield bcrypt_1.default.compare(password, foundUser.password);
        if (!match)
            return res.status(401).json({ message: 'Unauthorized' });
        const accessToken = jsonwebtoken_1.default.sign({
            UserInfo: {
                username: foundUser.username,
                roles: foundUser.role,
            },
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ username: foundUser.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        // Create secure cookie with refresh token
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match
        });
        // Send accessToken containing username and roles
        res.json({ accessToken });
    }
    catch (error) {
        (0, utils_1.handleError)(res, error);
    }
}));
exports.authRouter.get('/refresh', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies;
        console.log(cookies);
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
            return res.status(401).json({ message: 'Unauthorized' });
        const refreshToken = cookies.jwt;
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (err)
                    return res.status(403).json({ message: 'Forbidden' });
                const foundUser = yield (0, auth_service_1.findUser)(decoded.username);
                if (!foundUser)
                    return res.status(401).json({ message: 'Unauthorized' });
                const accessToken = jsonwebtoken_1.default.sign({
                    UserInfo: {
                        username: foundUser.username,
                        roles: foundUser.role,
                    },
                }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                res.json({ accessToken });
            }
            catch (error) {
                if (error instanceof Error) {
                    return res.status(500).json({ error: true, message: error.message });
                }
                res.status(500).json({ error });
            }
        }));
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: true, message: error.message });
        }
        res.status(500).json({ error });
    }
}));
exports.authRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        (0, utils_1.handleError)(res, error);
    }
}));
exports.authRouter.get('/get', verifyJWT_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.prisma.user.findMany();
        res.status(201).json(user);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: true, message: error.message });
        }
        res.status(500).json({ error });
    }
}));
exports.authRouter.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
            return res.sendStatus(204); //No content
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none' });
        res.json({ message: 'Cookie cleared' });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: true, message: error.message });
        }
        res.status(500).json({ error });
    }
}));
//# sourceMappingURL=auth.router.js.map