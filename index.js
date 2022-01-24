import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { applyMiddleware } from 'graphql-middleware';
import Table from 'ascii-table';
import cors from 'cors';
import dotenv from 'dotenv';

import typeDefs from './graphql/schema/schema.js';
import resolvers from './graphql/resolvers/resolvers.js';
import {
    authMiddleWare, handleLogin, handleCheck, getRequestContext,
} from './middleware/SecurityMiddleware.js';

dotenv.config();

const {
    PORT,
} = process.env;

(async function () {
    // Create a server:
    const app = express();

    const corsOptions = {
        origin: '*',
    };
    app.use(cors(corsOptions));
    app.use(express.json({ limit: '25mb' }));
    app.use(express.urlencoded({ extended: true, limit: '25mb' }));
    app.get('/graphql/check', handleCheck);
    app.post('/graphql/login', handleLogin);

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const schemaWithMiddleware = applyMiddleware(schema, {
    Query: authMiddleWare,
    Mutation: authMiddleWare,
    Subscription: authMiddleWare,
});

  const server = new ApolloServer({
    schema: schemaWithMiddleware,
    context: async ({ req }) => getRequestContext(req),
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          }
        };
      }
    }],
  });
  await server.start();

  server.applyMiddleware({ app });

  const subscriptionServer = SubscriptionServer.create(
    { schema: schemaWithMiddleware, execute, subscribe },
    { server: httpServer, path: '/graphql' }
  );
  
  httpServer.listen(PORT, () => {
    const table = new Table('Alegra API');
    const url = `localhost:${PORT}${server.graphqlPath}`;
    table
      .setHeading(`Server listening on ${url}`)
      .addRow(`Query/Mutation | http://${url}`)
      .addRow(`Subscription   | ws://${url}`);

    console.log(table.toString());
  });
})();