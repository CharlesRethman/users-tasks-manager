'use strict';

import * as mocha from 'mocha';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Db, MongoClient } from 'mongodb';

import { connectDb } from '../../src/db/connect'

chai.use(chaiAsPromised).should();
const expect: Chai.ExpectStatic = chai.expect;
const dbName: string = 'usersTasks'


describe('test connection function', function() {

  let client: MongoClient;

  async function getDb(): Promise<Db> {

    try {

      client = await connectDb('mongodb://localhost:27017');
      console.log(client.db(dbName).writeConcern);
      return client.db(dbName);

    } catch(e) {

      return Promise.reject(e);

    }

  }

  it('should obtain a database connection object', function() {

    return getDb().should.eventually
      .have.property('databaseName').equals(dbName)
      .then(() => {
        client.close();
      })

  });


});