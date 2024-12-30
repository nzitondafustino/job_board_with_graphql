import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';



const typeDefs = `#graphql
# A simple type definition
    type Query {
        greeting: String
    }
`;


const resolvers = {
    Query: {
        greeting: () => 'Hello World!'
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

const {url} = await startStandaloneServer(server, {listen: {port: 4000}});

console.log(`Server ready at ${url}`);



