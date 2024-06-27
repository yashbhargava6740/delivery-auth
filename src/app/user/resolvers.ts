import { prismaClient } from '../../client/db/prismaClient';
import { GraphQlContext } from '../../interfaces';
import JWTService from '../../services/jwt';
import express from 'express';
import { redisClient } from '../../redis';
const argon2 = require('argon2');
const queries = {
    getCurrentUser: async (parent: any, args: any, ctx: GraphQlContext) => {
        const id = ctx.user?.id;
        if (!id) return null;

        try {
            const userDataFromRedis = await redisClient.get(`user:${id}:info`);
            if (userDataFromRedis) {
                return JSON.parse(userDataFromRedis);
            }

            const user = await prismaClient.user.findUnique({ where: { id } });
            if (user) {
                await redisClient.set(`user:${id}:info`, JSON.stringify(user), 'EX', 3600);
                return user;
            } else {
                throw new Error("User not found in database!");
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            throw new Error("Failed to fetch user information");
        }
    }
};

const mutations = {
    login: async (parent: any, { email, password }: { email: string, password: string }) => {

        try {
            if (!email || !password) throw new Error('Email and password are required');
            console.log(email, password);
            const userInDb = await prismaClient.user.findUnique({
                where: {
                    email: email,
                }
            });
            if (!userInDb) throw new Error('Invalid email');
            if (await argon2.verify(userInDb.password, password, {
                type: argon2.argon2id,
                memoryCost: 2 ** 16,
                hashLength: 50,
            })) {
                const jwt_token = JWTService.generateWebToken(userInDb);

                await redisClient.set(`user:${userInDb.id}:token`, JSON.stringify(userInDb), 'EX', 3600);

                // res.cookie('jwt', jwt_token, {httpOnly: true, secure: true});
                return jwt_token;
            }
            else throw new Error('Invalid password');
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    registerUser: async (parent: any, { email, password, name, address, phone, role }: { email: string, password: string, name: string, address: string, role: string, phone: string }) => {
        try {
            if (!email || !password || !name) throw new Error('Email, password and name are required');
            const hashedPassword = await argon2.hash(password, {
                type: argon2.argon2id,
                memoryCost: 2 ** 16,
                hashLength: 50,
            });
            const user = await prismaClient.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    address,
                    phone,
                    role,
                }
            });
            if (!user) throw new Error('Internal Server Error');
            return user;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export const resolvers = { queries, mutations };