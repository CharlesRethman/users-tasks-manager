'use strict';

const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../dist/app').default;
const ops = require('../../dist/db/ops');

const tasksTest = require('../resources/testTasks.json');

chai.use(chaiHttp);
const expect = chai.expect;


describe('`controllers/tasks.ts` tests. API requests', function() {

  let id; // variable to hold a tasks id for the 'GET all' request
  const taskCounts = [0, 2, 2, 0]; // expected task counts for each user
  
  before(async function() {
    try {
      await ops.deleteAll('tasks');
      return Promise.resolve();
    } catch(e) {
      return Promise.reject(e);
    }
  });

  
  async function getUsers() {
    try {
      const usersObjs = await ops.getMany('users', {}, {}, {});
      const users = usersObjs.map(user => user.id);
      return users;
    } catch(e) {
      Promise.reject(e);
    }
  } 

  describe('#POST 4 tasks', function() {
        
    tasksTest.forEach((e, i) => {

      it('should create a task ' + i, async function() {
        const users = await getUsers();
//        console.log('it #POST: users =', users);
        const user = i < 2 ? users[1] : users[2];
        try {
          const res = await chai
            .request(app)
            .post('/api/users/' + user + '/tasks')
            .type('application/json')
            .send(tasksTest[i]);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.deep.equal(Object.assign(
            {},
            tasksTest[i],
            { id: res.body.id, user_id: user }
          ));
          return Promise.resolve();
        } catch(e) {
          return Promise.reject(e);
        }
      });

    });

  });

  describe('#GET all tasks for users', function() {

    it('test #GET all tasks on each user (see tests below)', async function() {
      const users = await getUsers();

      describe('testing #GET all tasks on each user', function() {

        users.forEach((user, i) => {

          it('should get ' + taskCounts[i] + ' tasks for user id = ' + user, async function() {
            try {
                const res = await chai
                  .request(app)
                  .get('/api/users/' + users[i] + '/tasks');
                expect(res).to.have.status(200);
                expect(res.body).to.have.length(taskCounts[i]);
              return Promise.resolve();
            } catch(e) {
              return Promise.reject(e);
            }
          });

        });

      });

      const tasks = await ops.getMany('tasks', { user_id: users[1] }, {}, {});
      id = tasks[1].id;
      console.log('#GET all tasks: id =', id);
    });

  });

  describe('#GET one task', function() {

    it('should get a user', async function() {
      try {
        const users = await getUsers();
        const res = await chai
          .request(app)
          .get('/api/users/' + users[1] + '/tasks/' + id);
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(Object.assign(
          {},
          tasksTest[1],
          { user_id: users[1], id: id }
        ));
        return Promise.resolve();
      } catch(e) {
        return Promise.reject(e);
      }
    });

  });

    describe.skip('#UPDATE a task', function() {

      it('should update a user', async function() {
        try {
          const res = await chai
            .request(app)
            .put('/api/users/' + user_id)
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

    describe.skip('#DELETE a task', function() {

      it('should delete a task');

    });

    
});