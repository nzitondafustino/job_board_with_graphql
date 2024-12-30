
import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';

import cors from 'cors';
import express from 'express';
import {readFile } from 'node:fs/promises';
import { authMiddleware, handleLogin } from './auth.js';
import { resolvers } from './resolvers.js';
import { getUser } from './db/users.js';
import { companyLoader } from './db/companies.js';

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post('/login', handleLogin);

const typeDefs = await readFile("./schema.graphql", 'utf8');

async function getContext({ req }) {
  const context = { companyLoader: companyLoader() }
  if (!req.auth) {
    return context;
  }
  const user = await getUser(req.auth.sub);
  context.user = user
  return context;
}

const apolloServer = new ApolloServer({typeDefs, resolvers});

await apolloServer.start();
app.use("/graphql",apolloMiddleware(apolloServer, { context: getContext }));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL server ready at http://localhost:${PORT}/graphql`);
});
