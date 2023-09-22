const express = require("express");
require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { expressMiddleware } = require("@apollo/server/express4");
const { ApolloServerPluginDrainHttpServer } = require("@apollo/server/plugin/drainHttpServer");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const typeDefs = require("./GraphQL/typeDef");
const resolvers = require("./GraphQL/Resolvers/index");
const { ApolloServerErrorCode } = require('@apollo/server/errors');

(async () => {
    try {
        const app = express();

        // Our httpServer handles incoming requests to our Express app.
        // Below, we tell Apollo Server to "drain" this httpServer,
        // enabling our servers to shut down gracefully.
        const httpServer = http.createServer(app);
        // apollo Server code
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
        });

        // Ensure we wait for our server to start
        await server.start();

        app.use(bodyParser.json());
        app.use(cors());

        await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, })

        if (mongoose.connections[0]._readyState === 1) {
            console.log("MongoDB is connected");
              
            /* First  method to run apollo server using startStandaloneServer*/
            
            // Start Apollo Server
            // const { url } = await startStandaloneServer(server, {
            //     context: async ({ req }) => ({ token: req.headers.authorization }),
            //     listen: { port: process.env.PORT },
            // });
            // console.log(`🚀 Server ready at: http://localhost:${url});


            /* Second method to run apollo server using expressMiddleware */
            app.use("/graphql",
                cors(),
                bodyParser.json(),
                expressMiddleware(server, {
                    context: async ({ req }) => ({ token: req.headers.authorization }),
                })
            )
            await new Promise((resolve) =>  httpServer.listen({ port: process.env.PORT  }, resolve));
            console.log(`🚀 Server ready at: http://localhost:${process.env.PORT}/graphql`);
        } else {
            throw new Error("MongoDB connection failed");
        }
    } catch (error) {
        console.log(error.message);
    }
})()

// async function startServer() {
//     const app = express();
//      // apollo Server code
//     const server = new ApolloServer({
//          typeDefs,
//         resolvers: {
//             Query: {
//                 getTodo: async () => (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
//             }
//         }
//     });
//     app.use(bodyParser.json())
//     app.use(cors())

//     mongoose.connect(process.env.MONGODB_URL, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     }).then( async () => {
//         return url = await startStandaloneServer(server, {
//             listen: { port: 4000 },
//         });
//     }).then(({ url }) => {

//         console.log(`🚀  Server ready at: ${url}`);
//     })


// }

// startServer();