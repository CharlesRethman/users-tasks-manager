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

  let task_id; // variable to hold a task's id for the 'GET all' request
  const taskCounts = [0, 1, 2, 0]; // expected task counts for each user, after deletion
  
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
        try {
          const users = await getUsers();
          const user = i < 2 ? users[1] : users[2];
          const res = await chai
            .request(app)
            .post('/api/users/' + user + '/tasks')
            .type('application/json')
            .send(tasksTest[i]);
          expect(res).to.have.status(201);
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


        after(async function() {
          try {
            if(process.env.CLEAN_TEST && ['true', 'yes', 'y', 't'].includes(process.env.CLEAN_TEST.toLowerCase())) {
              await ops.deleteAll('tasks');
              await ops.deleteAll('users');
            }
            return Promise.resolve();
          } catch(e) {
            return Promise.reject(e);
          }
        });

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
      task_id = tasks[1].id;
    });

  });

  describe('#GET one task', function() {

    it('should get a task', async function() {
      try {
        const users = await getUsers();
        const res = await chai
          .request(app)
          .get('/api/users/' + users[1] + '/tasks/' + task_id);
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(Object.assign(
          {},
          tasksTest[1],
          { user_id: users[1], id: task_id }
        ));
        return Promise.resolve();
      } catch(e) {
        return Promise.reject(e);
      }
    });

  });

  describe('#UPDATE one task', function() {

    it('should update a task', async function() {
      try {
        const users = await getUsers();
        const res = await chai
          .request(app)
          .put('/api/users/' + users[1] + '/tasks/' + task_id)
          .type('application/json')
          .send({ name: 'serious task' });
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({
          name: 'serious task',
          description: 'A waste of time',
          date_time: '2018-05-17T06:40:38Z',
          user_id: users[1],
          id: task_id
        });
        return Promise.resolve();
      } catch(e) {
        return Promise.reject(e);
      }
    });

  });

  describe('#DELETE a task', function() {

    it('should delete a task', async function() {
      try {
        const users = await getUsers();
        const res = await chai
          .request(app)
          .delete('/api/users/' + users[1] + '/tasks/' + task_id)
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({
          collection: 'tasks',
          id: task_id,
          action: 'deleted'
        });
        const tasks = await ops.getMany('tasks', {}, {}, {}); // all tasks remaining in DB
        expect(tasks).to.have.length(3);
        return Promise.resolve();
      } catch(e) {
        return Promise.reject(e);
      }
    });

  });


});