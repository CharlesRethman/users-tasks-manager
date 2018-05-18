'use strict';

import * as config from 'config';
import * as express from 'express';
import * as morgan from 'morgan';
import * as SwaggerExpress from 'swagger-express-mw';

import { connectDb, DbClient } from './db/connector';

const app: express.Application = express();

//console.log('environment: NODE_ENV =', process.env.NODE_ENV);
//console.log('Mongo connection parameters =', config.mongoUrl, config.database);
const url = config.mongoUrl || 'mongodb://localhost:27017';
const dbName = config.database || 'usersTasks';

export const mongoDb: Promise<DbClient> = connectDb(url, dbName);

const appRoot = __dirname.substring(0, __dirname.indexOf('users-tasks-manager') + 19)
  
const swaggerConfig: SwaggerExpress.Config = {
  appRoot: appRoot  // required config
};

SwaggerExpress.create(swaggerConfig, function(err, swaggerExpress) {

  if (err) { throw err; }

  if(config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(morgan('combined'));
  }
  
  // install middleware
  swaggerExpress.register(app);

  const port = process.env.PORT || 3000;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/api/hello?name=Scott');
  }

});


export default app;