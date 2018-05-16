'use strict';

const mocha = require('mocha');
//import * as mocha from 'mocha';
const chai = require('chai');
//import * as chai from 'chai';
const chaiAsPromised = require('chai-as-promised');
//import * as chaiAsPromised from 'chai-as-promised';
//import { Db, MongoClient } from 'mongodb';

const connectDb = require('../../dist/db/connector').connectDb;
//import { connectDb } from '../../db/connector'
const mongoDb = require('../../dist/app').mongoDb;
//import { mongoDb } from '../../app';

chai.use(chaiAsPromised).should();
const expect = chai.expect;
const dbName = process.env.DATABASE || 'test'


describe('test connection function', function() {

  let client;
  let db;


  it('should obtain a database connection object', function(done) {
    it('should get the db', function() {
      return connectDb('mongodb://localhost:27017', dbName).should.eventually
      .have.property('databaseName').equals(dbName)
      .then((db) => {
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