'use strict';

import * as SwaggerExpress from 'swagger-express-mw';
import * as express from 'express';


const app: express.Application = express();
export default app; // for testing


async function server() {

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

}


server();

