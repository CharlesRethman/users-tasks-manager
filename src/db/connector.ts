'use strict';

import { Db, MongoClient, MongoClientOptions } from 'mongodb';

export interface DbClient {
  db: Db,
  client: MongoClient
}

export async function connectDb(uri: string, dbName: string): Promise<DbClient> {

  try {

    const client: MongoClient = await MongoClient.connect(uri);
    return {
      client: client,
      db: client.db(dbName)
    };

  } catch(e) {

    //logger
    return Promise.reject(e);

  }
  
}

