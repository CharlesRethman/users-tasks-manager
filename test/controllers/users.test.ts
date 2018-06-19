'use strict';

import * as chai from 'chai';

const chaiHttp = require('chai-http');

const usersTest = require('../resources/testUsers.json');
const app: Express.Application = require('../../dist/app').default;

//console.log(usersTest);
chai.use(chaiHttp);
const expect = chai.expect;


describe('`controllers/users.ts` tests. API requests', function() {

  let id: string; // variable to hold a user id for the 'GET all' request

  describe('#POST 3 users', function() {

    usersTest.forEach((e, i) => {
      if(i > 1) {

        it('should create a user', async function() {
          try {
            const res: ChaiHttp.Response = await chai
              .request(app)
              .post('/api/users')
              .type('application/json')
              .send(usersTest[i]);
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.deep.equal(Object.assign({}, usersTest[i], { id: res.body.id }));
            return Promise.resolve();
          } catch(e) {
            return Promise.reject(e);
          }
        });

      }
    });

  });

  describe('#GET users', function() {

    it('should get all users', async function() {
      try {
        const res: ChaiHttp.Response = await chai
          .request(app)
          .get('/api/users');
        expect(res).to.have.status(200);
        expect(res.body).to.have.length(4);
        id = res.body[1].id;
        return Promise.resolve();
      } catch(e) {
        return Promise.reject(e);
      }
    });

  });

  describe('#GET a user', function() {

    it('should get a user', async function() {
      try {
        const res: ChaiHttp.Response = await chai
          .request(app)
          .get('/api/users/' + id);
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(Object.assign({}, usersTest[2], { id: id }));
        return Promise.resolve();
      } catch(e) {
        return Promise.reject(e);
      }
    });

  });

  describe('#UPDATE a user', function() {

    it('should update a user', async function() {
      try {
        const res: ChaiHttp.Response = await chai
          .request(app)
          .put('/api/users/' + id)
          .type('application/json')
          .send({ first_name: 'Meghan', last_name: 'Markle' });
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({
          username: 'pretty@woman.com',
          first_name: 'Meghan',
          last_name: 'Markle',
          id: id
        });
        return Promise.resolve();
      } catch(e) {
        return Promise.reject(e);
      }
    });

  });


});
