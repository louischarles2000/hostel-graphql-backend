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

const PORT = process.env.port || 4000 ;

const server = new ApolloServer({ typeDefs, resolvers, cors: {
    origin: 'http://localhost:3000',
    credentials: true
} });


mongoose.connect('mongodb+srv://campuseyeadmin1:NGVIbHaCU2QEy72j@cluster0.vav4m.mongodb.net/hostels', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Mongo DB connected')
    return server.listen({port: PORT});
})
.then(({ url }) => {
    console.log(`Server ready at ${url} 🚀`);
})
.catch(err => {
    console.log(err);
})
