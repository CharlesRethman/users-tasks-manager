'use strict';

import { Db, MongoClient, MongoClientOptions } from 'mongodb';

export async function connectDb(uri: string, dbName: string): Promise<Db> {

  try {

    const client = await MongoClient.connect(uri);
    return client.db(dbName);

  } catch(e) {

    //logger
    return Promise.reject(e);

  }
  
}

