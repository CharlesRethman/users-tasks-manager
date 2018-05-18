'use strict';

const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../dist/app').default;

const usersTest = require('../resources/testUsers.json');

chai.use(chaiHttp);
const expect = chai.expect;


describe('`controllers/users.ts` tests. API requests', function() {

  describe('#POST 3 users', function() {

    usersTest.forEach((e, i) => {
      if(i > 1) {

        it('should create a user', async function() {
          try {
            const res = await chai
              .request(app)
              .post('/api/users')
              .type('application/json')
              .send(usersTest[i]);
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.deep.equal(Object.assign({}, usersTest[i], { id: res.body.id }));
            Promise.resolve();
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
        const res = await chai.request(app).get('/api/users');
//        console.log('\nresponse body =', res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.have.length(4);
        Promise.resolve();
      } catch(e) {
        return Promise.reject(e);
      }
    });

  });

});