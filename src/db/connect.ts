'use strict';

import { Db, MongoClient, MongoClientOptions } from 'mongodb';

export async function connectDb(uri: string): Promise<MongoClient> {

  try {

    return await MongoClient.connect(uri);

  } catch(e) {

    //logger
    return Promise.reject(e);

  }
  
}

