'use strict';

import * as mocha from 'mocha';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Db, MongoClient } from 'mongodb';

import { connectDb } from '../../src/db/connector'
import { mongoDb } from '../../src/app';

chai.use(chaiAsPromised).should();
const expect: Chai.ExpectStatic = chai.expect;
const dbName: string = 'usersTasks'


describe('test connection function', function() {

  let client: MongoClient;
  let db: Db;


  it('should obtain a database connection object', function(done) {
    it('should get the db', function() {
      return connectDb('mongodb://localhost:27017', dbName).should.eventually
      .have.property('databaseName').equals(dbName)
      .then((db: Db) => {
        expect(db.writeConcern).to.deep.equal({});
      });

    });
    done();
  });


});

describe('test connection on app is working', function() {

  it('should get a connection object from the app', function() {
    return mongoDb.should.eventually.have.property('databaseName').equals('usersTasks');
  });

});