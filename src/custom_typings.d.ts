import * as mongo from 'mongodb';

declare module 'mongodb' {

  export interface MongoClientOptions {
    useNewUrlParser: boolean;
  }

}