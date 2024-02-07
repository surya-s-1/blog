const { ApolloServer } = require('apollo-server')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')
const path = require('path')

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Post = require('./resolvers/Post')
const User = require('./resolvers/User')

const resolvers = {
    Query, Mutation, Post, User
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname,'schema.graphql'), 'utf-8'),
    resolvers,
    context: {prisma}
})

server.listen().then(({url})=>{
    console.log(`Server is running at ${url}`)
})