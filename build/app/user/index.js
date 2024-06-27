"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const mutations_1 = require("./mutations");
const queries_1 = require("./queries");
const resolvers_1 = require("./resolvers");
const types_1 = require("./types");
exports.user = {
    mutations: mutations_1.mutations,
    queries: queries_1.queries,
    resolvers: resolvers_1.resolvers,
    types: types_1.types,
};
