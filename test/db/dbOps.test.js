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
    return sequencer('users').should.eventually.equals(0);
  });

});

describe('checkExists test', function() {

  it('should have an empty object', function() {
    return checkExists('users', 100).should.eventually.equals(false);
  })

});


describe('do database CRUD', function() {

  describe('create documents', function() {

    it('should create documents', function(done) {
      it('should create first document', function() {
        return dbOps.create('users', testDocs[0])
          .should.eventually.have.property('result')
          .deep.equals({ n: 1, ok: 1 });
      });
      it('should create second document', function() {
        return dbOps.create('users', testDocs[1])
          .should.eventually.have.property('result')
          .deep.equals({ n: 1, ok: 1 });
      });
      done();
    });

  });

  describe('find documents', function() {

    it('should find documents', function(done) {
      it('should find all documents', function() {
        return dbOps.getMany('users', {}, {}, {})
          .should.eventually.have.length(2);
      });
      done();
    })

    it('should find a single document', function(done) {
      it('should find the first document', function() {
        return dbOps.getOne('users', '0')
          .should.eventually.have.property('name')
          .equals('John');
      });
      done();
    });
  
  });

  describe('update documents', function() {

    it('should update documents', function(done) {
      it('should update the second document', function() {
        return dbOps.update('users', '1', { name: 'Dale Hurwitz' }).should.eventually.have.property('ops')
          .have.property('name')
          .deep.equals('Dale Hurwitz');
      });
      done();
    });

  });

  describe('delete documents', function() {

    it('should delete a document', function(done) {
      it('should delete the second document', function() {
        return dbOps.deleteOne('users', '1')
          .should.eventually.have.property('result')
          .deep.equals({});
      });
      done();
    });

    it('should delete a document', function(done) {
      it('should delete the first document', function() {
        return dbOps.deleteOne('users', '0')
          .should.eventually.have.property('result')
          .deep.equals({});
      });
      done();
    });

  });


});