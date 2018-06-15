'use strict';

import * as config from 'config';
import * as express from 'express';
import * as morgan from 'morgan';
import * as SwaggerExpress from 'swagger-express-mw';

import * as scheduler from './workers/scheduler';
import * as logger from './workers/winston';

import { connectDb, DbClient } from './db/connector';

const app: express.Application = express();

const appRoot = __dirname.substring(0, __dirname.indexOf('users-tasks-manager') + 19);
const swaggerConfig: SwaggerExpress.Config = {
  appRoot: appRoot  // required config
};


SwaggerExpress.create(swaggerConfig, function(err, swaggerExpress) {

  if (err) { throw err; }

  // unless a test running, use morgan to log requests
  if(config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(morgan(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"' , { stream: logger.myStream }));
  }
  
  // install middleware
  swaggerExpress.register(app);

  // start listening
  const port = config.get('port') || 3000;
  app.listen(port);
  if(config.util.getEnv('NODE_ENV') !== 'test') logger.myStream.write('::ffff:127.0.0.1 - - [' + (new Date()).toISOString() + '] "SERVER STARTED and listening on port ' + port + '"');

  // start scheduler tasks
  scheduler.taskExecute;

});


export default app;


const url = config.get('mongoUrl') || 'mongodb://127.0.0.1:27017';
const dbName = config.get('database') || 'usersTasks';
export const mongoDb: Promise<DbClient> = connectDb(url, dbName);