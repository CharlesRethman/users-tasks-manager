'use strict';

import * as config from 'config';
import * as express from 'express';
import * as morgan from 'morgan';
import * as SwaggerExpress from 'swagger-express-mw';

import * as scheduler from './workers/scheduler';
import * as logger from './workers/winston';

import { connectDb, DbClient } from './db/connector';

const url = config.mongoUrl || 'mongodb://127.0.0.1:27017';
const dbName = config.database || 'usersTasks';

export const mongoDb: Promise<DbClient> = connectDb(url, dbName);

const app: express.Application = express();

const appRoot = __dirname.substring(0, __dirname.indexOf('users-tasks-manager') + 19)
  
const swaggerConfig: SwaggerExpress.Config = {
  appRoot: appRoot  // required config
};

SwaggerExpress.create(swaggerConfig, function(err, swaggerExpress) {

  if (err) { throw err; }

  if(config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(morgan('combined' , { stream: logger.myStream }));
  }
  
  // install middleware
  swaggerExpress.register(app);

  const port = process.env.PORT || 3000;
  app.listen(port);

  scheduler.taskExecute

});


export default app;