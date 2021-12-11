import { ApolloServer } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";
import typeDefs from "#root/graphql/typeDefs";
import resolvers from "#root/graphql/resolvers";

import mongoose from "mongoose";
import insertScript from "./insertScript";

mongoose.connect("mongodb://" + process.env.DB_HOST + "/data", {
    useNewUrlParser: true,
});
const database = mongoose.connection;
console.log(process.env.DB_HOST);
database.on("error", console.error.bind(console, "connection error:"));
database.once("open", function () {
    console.log("CONNECTED to mongoDB.");

    insertScript().then(() => {
        console.log("successfully executed insert script.");
    });
});

const server = new ApolloServer({
    schema: buildFederatedSchema({ typeDefs, resolvers }),
    context: ({ req }) => {
        const user = req.headers.user ? JSON.parse(req.headers.user) : null;
        return { user };
    },
});

server.listen({ port: process.env.PORT }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
