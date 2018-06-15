'use strict';

import * as express from 'express';
import * as config from 'config';
import * as morgan from 'morgan';
import * as SwaggerExpress from 'swagger-express-mw';
import * as logger from './workers/winston';
import * as scheduler from './workers/scheduler';


class App {

  private _appRoot = __dirname.substring(0, __dirname.indexOf('users-tasks-manager') + 19);
  private _swaggerConfig: SwaggerExpress.Config = { appRoot: this._appRoot};

  public express: express.Application;

  constructor() {

    this.express = express();
    SwaggerExpress.create(this._swaggerConfig, (err, swaggerExpress): void => {

      if (err) { throw err; }

      // unless a test running, use morgan to log requests
      if(config.util.getEnv('NODE_ENV') !== 'test') {
        this.express.use(morgan('combined' , { stream: logger.myStream }));
      }

      // install middleware
      swaggerExpress.register(express);

      // start scheduler tasks
      scheduler.taskExecute
    
    });


  }

}

export default new App();