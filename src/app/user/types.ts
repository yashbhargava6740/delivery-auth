export const types = `
    type User {
        id: ID!
        email: String!
        password: String!
        name: String!
        role: String!
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
`