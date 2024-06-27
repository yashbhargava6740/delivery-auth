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
exports.initServer = initServer;
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const express_1 = __importDefault(require("express"));
const user_1 = require("./user");
const jwt_1 = __importDefault(require("../services/jwt"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
function initServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use((0, cookie_parser_1.default)());
        const graphQLServer = new server_1.ApolloServer({
            typeDefs: `
      ${user_1.user.types}
      type Query {
        sayHello: String
        ${user_1.user.queries}
      }
      type Mutation{
        ${user_1.user.mutations}
      }
    `,
            resolvers: {
                Query: Object.assign({ sayHello: () => "Hello World!" }, user_1.user.resolvers.queries),
                Mutation: Object.assign({}, user_1.user.resolvers.mutations)
            },
        });
        yield graphQLServer.start();
        app.use("/graphql", (0, express4_1.expressMiddleware)(graphQLServer, {
            context: (_a) => __awaiter(this, [_a], void 0, function* ({ req, res }) {
                return {
                    user: req.headers.authorization ? jwt_1.default.decodeToken(req.headers.authorization.split(' ')[1]) : undefined
                };
            })
        }));
        return app;
    });
}
