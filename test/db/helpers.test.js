'use strict';

const chai = require('chai');
const mocha = require('mocha');
const ObjectID = require('mongodb').ObjectID;
const rewire = require('rewire');

const helpers = require('../../dist/db/helpers');

const expect = chai.expect;

const helperFuncs = rewire('../../dist/db/helpers');
const buildField = helperFuncs.__get__('buildField');


const payload = {
  _id: new ObjectID('123AAD456FFE000CCB98701A'),
  first_name: 'Freddie',
  last_name: 'Mercury',
  username: 'queen'
}


describe('`db/helper.ts` tests', function() {

  describe('buildField test', function() {

    it('should make an object out of two strings', function() {
      expect(buildField('sense', { key1: 'nonsense', key2: 'more nonsense' }))
        .eqls({ sense: { key1: 'nonsense', key2: 'more nonsense' } });
    });

    it('should assign a key and value to an existing object', function() {
      expect(buildField('sense', 'nonsense', payload)).eqls({
        _id: new ObjectID('123AAD456FFE000CCB98701A'),
        first_name: 'Freddie',
        last_name: 'Mercury',
        username: 'queen',
        sense: 'nonsense'
      });
    });

  });

  describe('checkExists test', function() {

    it('should have an empty object', async function() {
      try {
        const res = await helpers.checkExists('users', 'FFFFFFFFF000AAACCC222444');
        expect(res).to.equal(false);
        return Promise.resolve();
      } catch(e) {
        return Promise.reject(e);
      }
    });

  });


  describe('objectIdToString test', function() {

    it('should take a payload with', function() {
      expect(helpers.objectIdToString(payload).id).to.equal('123aad456ffe000ccb98701a');
      expect(helpers.objectIdToString(payload)).eqls({
        id: '123aad456ffe000ccb98701a',
        first_name: 'Freddie',
        last_name: 'Mercury',
        username: 'queen',
        sense: 'nonsense'
      });
    });

  });

});