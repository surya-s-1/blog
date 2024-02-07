const { ApolloServer } = require('apollo-server-express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()

app.use(express.json())

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Post = require('./resolvers/Post')
const User = require('./resolvers/User')

const resolvers = {
    Query, Mutation, Post, User
}

const apolloServer = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname,'schema.graphql'), 'utf-8'),
    resolvers,
    context: {prisma}
})

async function start() {
    await apolloServer.start()
    apolloServer.applyMiddleware({app})
}

start()

const restRoutes = require('./restRoutes.js')
restRoutes.setupRestRoutes(app, apolloServer)

app.listen(8000, ()=>{
    console.log(`Server running at http://localhost:8000`)
})