import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { user } from "./user";
import cors from "cors";
import { Request } from "express";
import JWTService from "../services/jwt";
import cookieParser from "cookie-parser";
export async function initServer() {
  const app = express();
  app.use(express.json());
  app.use(cors<Request>());
  app.use(cookieParser());
  const graphQLServer = new ApolloServer({
    typeDefs: `
      ${user.types}
      type Query {
        sayHello: String
        ${user.queries}
      }
      type Mutation{
        ${user.mutations}
      }
    `,
    resolvers: {
      Query:{
        sayHello: () => "Hello World!",
        ...user.resolvers.queries
      },
      Mutation: {
        ...user.resolvers.mutations
      }
    },
  });
  await graphQLServer.start();
  app.use("/graphql", expressMiddleware(graphQLServer, {
    context: async({req, res}) => {
      return {
        user: req.headers.authorization ? JWTService.decodeToken(req.headers.authorization.split(' ')[1]) : undefined
      }
    }
  }));
  return app;
}
