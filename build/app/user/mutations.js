"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutations = void 0;
exports.mutations = `#graphql
    registerUser(email: String!, password: String!, name: String!, address: String!, phone: String!, role: String!): User
    login(email: String!, password: String!): String
`;
