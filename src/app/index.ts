import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";

export async function initServer() {
  const app = express();
  app.use(express.json());
  const graphQLServer = new ApolloServer({
    typeDefs: `
      type Query {
        sayHello: String
      }
    `,
    resolvers: {
      Query:{
        sayHello: () => "Hello World!"
      },
    },
  });
  await graphQLServer.start();
  app.use("/graphql", expressMiddleware(graphQLServer));
  return app;
}
