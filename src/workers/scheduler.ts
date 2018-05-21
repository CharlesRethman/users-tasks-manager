'use strict';

import * as config from 'config';
import * as util from 'util';

import { UpdateWriteOpResult } from 'mongodb';
import { scheduleJob } from 'node-schedule';

import { executeTasks } from './jobs';


scheduleJob(
  'checkTasks',
  process.env.EXECUTE_TASK || config.execute_task ,
  async function(fireDate) {

  const job: any[] = await executeTasks(
    new Date(process.env.NEXT_EXECUTE_DATE_TIME || config.next_execute_date_time),
    fireDate
  );
  console.log(util.inspect(job));

});