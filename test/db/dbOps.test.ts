'use strict';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as mocha from 'mocha';

import { connectDb } from '../../src/db/connector';
import {
  create,
  getMany,
  getOne,
  update,
  deleteOne
} from '../../src/db/dbOps';

const rewire = require('rewire');
const testDocs = require('../resources/testCrud.json');
chai.use(chaiAsPromised).should();

const dbOps = rewire('../../src/db/dbOps');
const sequencer = dbOps.__get__('sequencer');
const checkExists = dbOps.__get__('checkExists');


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


describe('Do CRUD', function() {

  describe('Create documents', function() {

    it('should create documents', function(done) {
      it('should create first document', function() {
        return create('users', testDocs[0]).should.eventually.have.property('result').deep.equals({ n: 1, ok: 1 });
      });
      it('should create second document', function() {
        return create('users', testDocs[1]).should.eventually.have.property('result').deep.equals({ n: 1, ok: 1 });
      });
      done();
    });

    it('should get documents', function(done) {
      it('should get all documents', function() {
        return getMany('users', {}, {}, {}).should.eventually.have.length(2);
      });
      done();
    })

    it('should get a single document', function(done) {
      it('should get the first document', function() {
        return getOne('users', '0').should.eventually.have.property('name').equals('John');
      });
      done();
    });

    it('should update documents', function(done) {
      it('should update the second document', function() {
        return update('users', '1', { name: 'Dale Hurwitz' }).should.eventually.have.property('ops').have.property('name').deep.equals('Dale Hurwitz');
      });
      done();
    })

    it('should delete a document', function(done) {
      it('should delete the second document', function() {
        return deleteOne('users', '1').should.eventually.have.property('result').deep.equals({});
      });
      done();
    });

    it('should delete a document', function(done) {
      it('should delete the first document', function() {
        return deleteOne('users', '0').should.eventually.have.property('result').deep.equals({});
      });
      done();
    });

  });


});