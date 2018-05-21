'use strict';

import * as chai from 'chai';
import * as mocha from 'mocha';

import {
  create,
  deleteAll,
  getMany,
  getOne,
  update,
  deleteOne
} from '../../dist/db/ops';

const testUsers = require('../resources/testUsers.json');

const expect: Chai.ExpectStatic = chai.expect;

let id0: string;
let id1: string;

describe('`db/ops.ts` tests. Database CRUD', function() {

  before(async function() {
      try {
        const docs: any = await getMany('users', {}, {}, {});
        const del: any = await deleteAll('users');
        expect(docs).to.have.length(del.n);
        return Promise.resolve();
      } catch(e) {
        return Promise.reject(e);
      }
  });

  describe('create documents', function() {

      it('should create first document', async function() {
        try {
          const res:any = await create('users', testUsers[0]);
            id0 = res.id
            expect(res.username).eqls('marlon@thegodfather.net');
            return Promise.resolve();
          } catch (e) {
            return Promise.reject(e);
          }
      });
      it('should create second document', async function() {
        try {
          const res: any = await create('users', testUsers[1]);
          id1 = res.id
          expect(res.username).eqls('js@tadcaster.brew');
          return Promise.resolve();
        } catch(e) {
          return Promise.reject(e);
        }
      });

  });


  describe('find documents', function() {

      it('should find all documents', async function() {
        try {
          const res: any[] = await getMany('users', {}, {}, {});
          expect(res).to.have.length(2);
          expect(res[0].username).equals(testUsers[0].username);
          return Promise.resolve();
        } catch(e) {
          return Promise.reject(e);
        }
      });

      it('should find the first document', async function() {
        try {
          const res: any = await getOne('users', id0, {}, {});
          expect(res).eqls({
            id: id0,
            username: 'marlon@thegodfather.net',
            first_name: 'Marlon',
            last_name: 'Brando'
          });
          return Promise.resolve();
        } catch(e) {
          return Promise.reject(e);
        }
      });
  
  });


  describe('update documents', function() {

      it('should update the second document', async function() {
        try {
          const res: any = await update(
            'users',
            id1,
            {},
            { first_name: 'Dale', last_name: 'Hurwitz' }
          );
          expect(res).eqls({
            id: id1,
            username: 'js@tadcaster.brew',
            first_name: 'Dale',
            last_name: 'Hurwitz'
          });
          return Promise.resolve();
        } catch(e) {
          return Promise.reject(e);
        }
      });

  });


  describe('delete documents', function() {

      it('should delete the first document', async function() {
        try {
          const res: any = await deleteOne('users', id1)
          expect(res).eqls({
            collection: 'users',
            id: id1,
            action: 'deleted'
          });
          return Promise.resolve();
        } catch(e) {
          return Promise.reject(e);
        }
      });

  });


});