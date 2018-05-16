'use strict';

const chai = require('chai');
//import * as chai from 'chai';
const chaiAsPromised = require('chai-as-promised');
//import * as chaiAsPromised from 'chai-as-promised';
const mocha = require('mocha');
//import * as mocha from 'mocha';

const connectDb = require('../../dist/db/connector');
//import { connectDb } from '../../db/connector';
const dbOps = require('../../dist/db/dbOps');
//import {
//  create,
//  getMany,
//  getOne,
//  update,
//  deleteOne
//} from '../../db/dbOps';

const rewire = require('rewire');
const testDocs = require('../resources/testCrud.json');
chai.use(chaiAsPromised).should();

const dbOpsFuncs = rewire('../../dist/db/dbOps');
const sequencer = dbOpsFuncs.__get__('sequencer');
const checkExists = dbOpsFuncs.__get__('checkExists');


describe('sequencer test', function() {

  it('should start at 1 as there are no records', function() {
    return sequencer('buildings').should.eventually.equals(0);
  });

});

describe('checkExists test', function() {

  it('should have an empty object', function() {
    return checkExists('buildings', 100).should.eventually.equals(false);
  })

});


describe('Do CRUD', function() {

  describe('Create documents', function() {

    it('should create documents', function(done) {
      it('should create first document', function() {
        return dbOps.create('buildings', testDocs[0])
          .should.eventually.have.property('result')
          .deep.equals({ n: 1, ok: 1 });
      });
      it('should create second document', function() {
        return dbOps.create('buildings', testDocs[1])
          .should.eventually.have.property('result')
          .deep.equals({ n: 1, ok: 1 });
      });
      done();
    });

    it('should get documents', function(done) {
      it('should get all documents', function() {
        return dbOps.getMany('buildings', {}, {}, {})
          .should.eventually.have.length(2);
      });
      done();
    })

    it('should get a single document', function(done) {
      it('should get the first document', function() {
        return dbOps.getOne('buildings', '0')
          .should.eventually.have.property('name')
          .equals('John');
      });
      done();
    });

    it('should update documents', function(done) {
      it('should update the second document', function() {
        return dbOps.update('buildings', '1', { name: 'Dale Hurwitz' }).should.eventually.have.property('ops')
          .have.property('name')
          .deep.equals('Dale Hurwitz');
      });
      done();
    })

    it('should delete a document', function(done) {
      it('should delete the second document', function() {
        return dbOps.deleteOne('buildings', '1')
          .should.eventually.have.property('result')
          .deep.equals({});
      });
      done();
    });

    it('should delete a document', function(done) {
      it('should delete the first document', function() {
        return dbOps.deleteOne('buildings', '0')
          .should.eventually.have.property('result')
          .deep.equals({});
      });
      done();
    });

  });


});