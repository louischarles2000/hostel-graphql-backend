const dotenv = require('dotenv');
dotenv.config('./.env');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./apollo/typeDefs');
const resolvers = require('./apollo/resolvers');
const mongoose = require('mongoose');

const server = new ApolloServer({ typeDefs, resolvers, cors: {
    origin: '*',
    allowedHeaders: ['Access-Control-Allow-Origin'],
    credentials: true
} });

const PORT = process.env.PORT || 4000;

mongoose.connect('mongodb+srv://campuseyeadmin1:NGVIbHaCU2QEy72j@cluster0.vav4m.mongodb.net/hostels', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Mongo DB connected')
    return server.listen({ port: PORT })
})
.then(({ url }) => {
    console.log(`Server ready at ${url} 🚀`);
})
.catch(err => {
    console.log(err);
})
