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
exports.findUser = exports.createUser = void 0;
const prisma_1 = require("../../db/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
function createUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPwd = yield bcrypt_1.default.hash('admin123', 10);
        return prisma_1.prisma.user.create({
            data: {
                email: 'Daniel@gmail.com',
                name: 'lezzgoo',
                password: hashedPwd,
                username: 'danzxc123',
                role: 'Admin',
            },
        });
    });
}
exports.createUser = createUser;
function findUser(username) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.prisma.user.findUnique({
            where: {
                username: username,
            },
        });
    });
}
exports.findUser = findUser;
//# sourceMappingURL=auth.service.js.map