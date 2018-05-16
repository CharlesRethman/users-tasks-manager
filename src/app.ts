'use strict';

import * as SwaggerExpress from 'swagger-express-mw';
import * as express from 'express';
import { Db, MongoClient } from 'mongodb';

import { connectDb } from './db/connect';


const app: express.Application = express();
export default app; // for testing


export async function server(): Promise<Db> {

  const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
  const dbName = 'usersTasks';
  const client: MongoClient = await connectDb(url);

  const appRoot = __dirname.substring(0, __dirname.indexOf('users-tasks-manager') + 19)
  
  const config: SwaggerExpress.Config = {
    swaggerFile: appRoot + '/api/swagger/swagger.yaml',
    appRoot: appRoot  // required config
  };

  SwaggerExpress.create(config, function(err, swaggerExpress) {

    if (err) { throw err; }

    // install middleware
    swaggerExpress.register(app);

    const port = process.env.PORT || 3000;
    app.listen(port);

    if (swaggerExpress.runner.swagger.paths['/hello']) {
      console.log('try this:\ncurl http://127.0.0.1:' + port + '/api/hello?name=Scott');
    }

  });

  return client.db(dbName);

}


