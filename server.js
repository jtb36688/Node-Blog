const express = require('express')

const postsRouter = require('./data/posts/PostsRouter')
const usersRouter = require('./data/users/UsersRouter')

const server = express();

server.use(express.json())

server.use('/api/posts', postsRouter)
server.use('/api/users', usersRouter)

module.exports = server;