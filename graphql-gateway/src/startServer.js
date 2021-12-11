const { ApolloServer, AuthenticationError } = require("apollo-server-express");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const express = require("express");
const expressJwt = require("express-jwt");
const app = express();

const startUpCheck = require("./startupCheck");

// A simple wrapper used by all services which need to be authenticated to set the token as a header
class AuthenticatedDataSource extends RemoteGraphQLDataSource {
    willSendRequest({ request, context }) {
        if (
            request.query !==
            "query __ApolloGetServiceDefinition__ { _service { sdl } }"
        ) {
            if (context.user) {
                request.http.headers.set(
                    "user",
                    context.user ? JSON.stringify(context.user.id) : null
                );
            } else {
                throw new AuthenticationError("you must be authenticated");
            }
        }
    }
}
// Use startup check
startUpCheck(
    ["http://feedme-dashboard-service:4001", "http://authentication-service:4001"],
    function () {
        // Initialize an ApolloGateway instance and pass it an array of
        // your implementing service names and URLs
        const gateway = new ApolloGateway({
            serviceList: [
                {
                    name: "dashboard",
                    url: "http://feedme-dashboard-service:4001",
                    authentication: false,
                },
                {
                    name: "authentication",
                    url: "http://authentication-service:4001",
                    authentication: false,
                },
                // Define all other services
                // { name: 'user', url: 'http://user-service:4001' },
                // { name: 'inventory', url: 'http://inventory-service:4001' },
                // { name: 'shoppinglist', url: 'http://shoppinglist-service:4001' },
                // { name: 'recipe', url: 'http://recipe-service:4001' },
                // Define additional services here
            ],
            buildService({ url, authentication }) {
                if (authentication) {
                    return new AuthenticatedDataSource({ url });
                } else {
                    return new RemoteGraphQLDataSource({ url });
                }
            },
        });

        // Pass the ApolloGateway to the ApolloServer constructor
        const server = new ApolloServer({
            gateway,
            // Disable subscriptions (not currently supported with ApolloGateway)
            subscriptions: false,
            context: ({ req }) => {
                const user = req.user || null;
                return { user };
            },
        });

        //To enable Playground
        const path = "/graph";
        app.use(path, (req, res, next) => {
            // Allow GET (Playground)
            if (req.method === "GET") {
                console.log("Open Playground");
                return next();
            }
            // Authenticate other GraphQL queries
            next();
        });

        // Use expressJwt to validate JWT Tokens
        app.use(
            expressJwt({
                secret: process.env.JWT_SECRET,
                algorithms: ["HS256"],
                credentialsRequired: false,
            })
        );

        server.applyMiddleware({ app, path: path });

        app.listen({ port: process.env.PORT }, () => {
            console.log(
                `🚀 GraphQL Server ready at http://localhost:${process.env.PORT} at path ${server.graphqlPath}`
            );
        });
    }
);
