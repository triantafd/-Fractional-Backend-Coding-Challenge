//import express = require('express');
import express from 'express';
import phoneRouter from './routes/phoneRouter';
import middleware from './utils/middleware';
import databaseInit from './database/initMySql';
import logger from './utils/logger';
import config from './utils/config'; // you need to export as default

const app = express();
databaseInit();

app.use(middleware.requestLogger);
app.use('/', phoneRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});

export default app;