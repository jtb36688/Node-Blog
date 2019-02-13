const express = require('express')

const postsRouter = require('./data/posts/PostsRouter')
const usersRouter = require('./data/users/UsersRouter')

const server = express();

server.use(express.json())

server.use