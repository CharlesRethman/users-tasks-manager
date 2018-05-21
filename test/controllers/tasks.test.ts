'use strict';

import * as chai from 'chai'; // for .ts tests
import * as mocha from 'mocha';

import { deleteAll, getMany } from '../../dist/db/ops';

const chaiHttp: Chai.ExpectStatic = require('chai-http');

const app: Express.Application = require('../../dist/app').default;
const tasksTest = require('../resources/testTasks.json');

chai.use(chaiHttp);
const expect = chai.expect;


describe('`controllers/tasks.ts` tests. API requests', function() {

  let task_id: string; // variable to hold a task's id for the 'GET all' request
  const taskCounts: number[] = [0, 1, 2, 0]; // expected task counts for each user, after deletion
  
  before(async function() {
    try {
      await deleteAll('tasks');
      return Promise.resolve();
    } catch(e) {
      return Promise.reject(e);
    }
  });

  
  async function getUsers() {
    try {
      const usersObjs: any[] = await getMany('users', {}, {}, {});
      const users: string[] = usersObjs.map(user => user.id);
      return users;
    } catch(e) {
      Promise.reject(e);
    }
  } 

  describe('#POST 4 tasks', function() {
        
    tasksTest.forEach((e, i) => {

      it('should create a task ' + i, async function() {
        try {
          const users: any[] = await getUsers();
          const user: any = i < 2 ? users[1] : users[2];
          const res: ChaiHttp.Response = await chai
            .request(app)
            .post('/api/users/' + user + '/tasks')
            .type('application/json')
            .send(tasksTest[i]);
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.deep.equal(Object.assign(
            {},
            tasksTest[i],
            { id: res.body.id, user_id: user, status: 'pending' }
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
      const users: any[] = await getUsers();

      describe('testing #GET all tasks on each user', function() {


        after(async function() {
          try {
            if(process.env.CLEAN_TEST && ['true', 'yes', 'y', 't'].includes(process.env.CLEAN_TEST.toLowerCase())) {
              await deleteAll('tasks');
              await deleteAll('users');
            }
            return Promise.resolve();
          } catch(e) {
            return Promise.reject(e);
          }
        });

        users.forEach((user, i) => {

          it('should get ' + taskCounts[i] + ' tasks for user id = ' + user, async function() {
            try {
                const res: ChaiHttp.Response = await chai
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

      const tasks: any[] = await getMany('tasks', { user_id: users[1] }, {}, {});
      task_id = tasks[1].id;
    });

  });

  describe('#GET one task', function() {

    it('should get a task', async function() {
      try {
        const users: any[] = await getUsers();
        const res: ChaiHttp.Response = await chai
          .request(app)
          .get('/api/users/' + users[1] + '/tasks/' + task_id);
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(Object.assign(
          {},
          tasksTest[1],
          { user_id: users[1], id: task_id, status: 'pending' }
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
        const users: any[] = await getUsers();
        const res: ChaiHttp.Response = await chai
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
          id: task_id,
          status: 'pending'
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
        const users: any[] = await getUsers();
        const res: ChaiHttp.Response = await chai
          .request(app)
          .del('/api/users/' + users[1] + '/tasks/' + task_id)
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({
          collection: 'tasks',
          id: task_id,
          action: 'deleted'
        });
        const tasks = await getMany('tasks', {}, {}, {}); // all tasks remaining in DB
        expect(tasks).to.have.length(3);
        return Promise.resolve();
      } catch(e) {
        return Promise.reject(e);
      }
    });

  });


});