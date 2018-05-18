'use strict';

const mocha = require('mocha');
const chai = require('chai');

const connectDb = require('../../dist/db/connector').connectDb;
const mongoDb = require('../../dist/app').mongoDb;

const expect = chai.expect;
const dbName = process.env.DATABASE || 'testUsersTasks'


describe('`db/connector.ts` tests', function() {

  describe('test (db) connector function', function() {

    it('should get the db', async function() {
      try {
        const res = await connectDb('mongodb://localhost:27017', dbName);
        expect(res.db.databaseName).to.equal(dbName);
        expect(res.db.writeConcern).to.deep.equal({});
        res.client.close();
        return Promise.resolve();
      } catch(e) {
        return Promise.reject(e);
      }
    });

  });

  describe('test connection on app is working', function() {

    it('should get a connection object for the app', async function() {
      try {
        const res = (await mongoDb).db;
        expect(res.databaseName).to.equal('testUsersTasks');
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    });

  });

});