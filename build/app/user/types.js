"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
exports.types = `
    type User {
        id: ID!
        email: String!
        password: String!
        name: String!
        role: String!
        address: String!
        phone: String!
        Orders: [Order] 
        createdAt: String!
        updatedAt: String!
    }
    
    type Order {
        id: ID!
        user: User!
        total: Float!
        items: [Item]!
        createdAt: String!
        updatedAt: String!
    }

    type Item {
        id: ID!
        name: String!
        price: Float!
        quantity: Int!
        order: Order!
        createdAt: String!
        updatedAt: String!
    }
`;
