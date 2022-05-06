const express = require('express')
const app = express()
const phoneRouter = require('./routes/phoneRouter')
const middleware = require('./utils/middleware')
const { databaseInit } = require('./database/initMySql')

databaseInit();

app.use(middleware.requestLogger)
app.use('/', phoneRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app