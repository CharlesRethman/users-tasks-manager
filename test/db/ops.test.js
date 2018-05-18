'use strict';

const chai = require('chai');
const mocha = require('mocha');

const ops = require('../../dist/db/ops');
const testUsers = require('../resources/testUsers.json');

const expect = chai.expect;

let id0 = 'empty';
let id1 = 'empty';

describe('do database CRUD', function() {

  describe('create documents', function() {

      it('should create first document', async function() {
        try {
          const res = await ops.create('users', testUsers[0]);
            id0 = res.id
            expect(res.username).eqls('marlon@thegodfather.net');
            Promise.resolve();
          } catch (e) {
            return Promise.reject(e);
          }
      });
      it('should create second document', async function() {
        try {
          const res = await ops.create('users', testUsers[1]);
          id1 = res.id
          expect(res.username).eqls('js@tadcaster.brew');
          Promise.resolve();
        } catch(e) {
          return Promise.reject(e);
        }
      });

  });


  describe('find documents', function() {

      it('should find all documents', async function() {
        try {
          const res = await ops.getMany('users', {}, {}, {});
//          console.log('findMany: res =', res);
//          console.log('findMany: id0 =', id0);
//          console.log('findMany: id1 =', id1);
          expect(res).to.have.length(2);
          expect(res[0].username).equals(testUsers[0].username);
          Promise.resolve();
        } catch(e) {
          return Promise.reject(e);
        }
      });

      it('should find the first document', async function() {
        try {
          const res = await ops.getOne('users', id0);
//          console.log('findOne: id0 =', id0);
          expect(res).eqls({
            id: id0,
            username: 'marlon@thegodfather.net',
            first_name: 'Marlon',
            last_name: 'Brando'
          });
          Promise.resolve();
        } catch(e) {
          return Promise.reject(e);
        }
      });
  
  });


  describe('update documents', function() {

      it('should update the second document', async function() {
        try {
          const res = await ops.update('users', id1, { first_name: 'Dale', last_name: 'Hurwitz' });
//          console.log('update: id1', id1);
//          console.log('update: res =', res);
          expect(res).eqls({
            id: id1,
            username: 'js@tadcaster.brew',
            first_name: 'Dale',
            last_name: 'Hurwitz'
          });
          Promise.resolve();
        } catch(e) {
          return Promise.reject(e);
        }
      });

  });


  describe('delete documents', function() {

      it('should delete the first document', async function() {
        try {
          const res = await ops.deleteOne('users', id1)
//            console.log('delete: res =', res);
//            console.log('delete: id =', id0);
            expect(res).eqls({
              collection: 'users',
              id: id1,
              action: 'deleted'
            });
              Promise.resolve();
        } catch(e) {
          return Promise.reject(e);
        }
      });

  });


});