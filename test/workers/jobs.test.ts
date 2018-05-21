'use strict';

import * as chai from 'chai';
import * as mocha from 'mocha';

import { getMany } from '../../dist/db/ops';
import { executeTasks } from '../../dist/workers/jobs';

const expect: Chai.ExpectStatic = chai.expect;

describe('scheduled job test', function() {

  it('should text the schedule job for cutOff not passed', async function() {
    try {
      const cutOff: Date = new Date((Date.now() + 3600000)); // 1 hour later
      const exTasks: any = await executeTasks(cutOff, new Date());
      expect(exTasks).to.have.length(0);
      return Promise.resolve();
    } catch(e) {
      return Promise.reject(e);
    }
  })

  it('should test the schedule job for cutOff passed', async function() {
    try {
      const cutOff: Date = new Date((Date.now() - 3600000)); // 1 hour earlier
      const exTasks: any[] = await executeTasks(cutOff, new Date());
      expect(exTasks).to.have.length(3);
      exTasks.forEach(doc => {
        expect(doc.status).to.equal('done');
      });
      return Promise.resolve();
    } catch(e) {
      return Promise.reject(e);
    }
  });

});
