'use strict';

import * as SwaggerExpress from 'swagger-express-mw';
import * as express from 'express';
import { Db } from 'mongodb';

import { connectDb } from './db/connector';


const app: express.Application = express();

//console.log('app.length', app.length);


const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DATABASE || 'usersTasks';

export default app; // for testing
export const mongoDb: Promise<Db> = connectDb(url, dbName);

const appRoot = __dirname.substring(0, __dirname.indexOf('users-tasks-manager') + 19)
  
const config: SwaggerExpress.Config = {
  appRoot: appRoot  // required config
};

//let server: number = 0

SwaggerExpress.create(config, function(err, swaggerExpress) {

  if (err) { throw err; }

//  console.log(server);

  // install middleware
  swaggerExpress.register(app);

  const port = process.env.PORT || 3000;
  app.listen(port);

//  server++

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/api/hello?name=Scott');
  }

});


