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
exports.resolvers = void 0;
const prismaClient_1 = require("../../client/db/prismaClient");
const jwt_1 = __importDefault(require("../../services/jwt"));
const argon2 = require('argon2');
const queries = {
    getCurrentUser: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const id = (_a = ctx.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!id)
            return null;
        const user = yield prismaClient_1.prismaClient.user.findUnique({ where: { id } });
        if (user)
            return user;
        else
            throw new Error("User not found in database!");
    })
};
const mutations = {
    login: (parent_1, _a) => __awaiter(void 0, [parent_1, _a], void 0, function* (parent, { email, password }) {
        try {
            if (!email || !password)
                throw new Error('Email and password are required');
            console.log(email, password);
            const userInDb = yield prismaClient_1.prismaClient.user.findUnique({ where: {
                    email: email,
                } });
            if (!userInDb)
                throw new Error('Invalid email');
            if (yield argon2.verify(userInDb.password, password, {
                type: argon2.argon2id,
                memoryCost: 2 ** 16,
                hashLength: 50,
            })) {
                const jwt_token = jwt_1.default.generateWebToken(userInDb);
                // res.cookie('jwt', jwt_token, {httpOnly: true, secure: true});
                return jwt_token;
            }
            else
                throw new Error('Invalid password');
        }
        catch (error) {
            throw new Error(error.message);
        }
    }),
    registerUser: (parent_1, _a) => __awaiter(void 0, [parent_1, _a], void 0, function* (parent, { email, password, name, address, phone, role }) {
        try {
            if (!email || !password || !name)
                throw new Error('Email, password and name are required');
            const hashedPassword = yield argon2.hash(password, {
                type: argon2.argon2id,
                memoryCost: 2 ** 16,
                hashLength: 50,
            });
            const user = yield prismaClient_1.prismaClient.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    address,
                    phone,
                    role,
                }
            });
            if (!user)
                throw new Error('Internal Server Error');
            return user;
        }
        catch (error) {
            throw new Error(error.message);
        }
    })
};
exports.resolvers = { queries, mutations };
