export const mutations = `#graphql
    registerUser(email: String!, password: String!, name: String!, address: String!, phone: String!, role: String!): User
    login(email: String!, password: String!): String
`