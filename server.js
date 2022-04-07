const dotenv = require('dotenv');
dotenv.config('./.env');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const userRoutes = require('./routes/userRoutes');
const typeDefs = require('./apollo/typeDefs');
const resolvers = require('./apollo/resolvers');
const mongoose = require('mongoose');

const server = new ApolloServer({ typeDefs, resolvers, cors: {
    origin: 'http://localhost:3000',
    credentials: true
} });


mongoose.connect(process.env.MONGDB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Mongo DB connected')
    return server.listen()
})
.then(({ url }) => {
    console.log(`Server ready at ${url} 🚀`);
})
.catch(err => {
    console.log(err);
})
