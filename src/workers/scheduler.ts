'use strict';

import * as config from 'config';
import * as util from 'util';

import * as schedule from 'node-schedule';

import { executeTasks } from './jobs';


function formatDate(date: Date): string {

  const month = ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return (date.getUTCDate().toString().length === 1 ? '0' : ''
    + date.getUTCDate().toString())
    + '/' + month[date.getMonth()]
    + '/' + date.getFullYear() 
    + ':' + (date.getUTCHours().toString().length === 1 ? '0' : '') 
    + date.getUTCHours().toString()
    + ':' + (date.getUTCMinutes().toString().length === 1 ? '0' : '')
    + date.getUTCMinutes().toString()
    + ':' + (date.getUTCSeconds().toString().length === 1 ? '0' : '')
    + date.getUTCSeconds().toString()
    + ' +0000'

}

const scheduleTaskExecute = process.env.SCHEDULER_TASK_EXECUTE || config.schedule_task_execute;

export const taskExecute = schedule.scheduleJob(scheduleTaskExecute, async function() { 

  console.log('::ffff:127.0.0.1 - - [' + formatDate(new Date()) + '] "executing scheduled job"');
  const job: any[] = await executeTasks(
    new Date(process.env.NEXT_EXECUTE_DATE_TIME || config.next_execute_date_time),
    new Date()
  );
  console.log('::ffff:127.0.0.1 - - [' + formatDate(new Date()) + '] "result: ' + util.inspect(job) + '"');

});