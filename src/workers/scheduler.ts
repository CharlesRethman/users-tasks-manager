'use strict';

import * as config from 'config';
import * as util from 'util';

import * as schedule from 'node-schedule';

import { myStream } from './winston';
import { executeTasks } from './jobs';

/*
function formatDate(date: Date): string {

  const month = ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return (date.getUTCDate().toString().length === 1 ? '0' : ''
    + date.getUTCDate().toString())
    + '/' + month[date.getUTCMonth()]
    + '/' + date.getUTCFullYear() 
    + ':' + (date.getUTCHours().toString().length === 1 ? '0' : '') 
    + date.getUTCHours().toString()
    + ':' + (date.getUTCMinutes().toString().length === 1 ? '0' : '')
    + date.getUTCMinutes().toString()
    + ':' + (date.getUTCSeconds().toString().length === 1 ? '0' : '')
    + date.getUTCSeconds().toString()
    + ' +0000'

}
*/
const scheduleTaskExecute = process.env.SCHEDULER_TASK_EXECUTE || config.get('schedule_task_execute');

export const taskExecute = schedule.scheduleJob(scheduleTaskExecute, async function() {

  myStream.write('::ffff:127.0.0.1 - - [' + (new Date()).toISOString() + '] "executing scheduled job"');
  const job: any[] = await executeTasks(
    new Date(process.env.NEXT_EXECUTE_DATE_TIME || config.get('next_execute_date_time')),
    new Date()
  );
  myStream.write('::ffff:127.0.0.1 - - [' + (new Date()).toISOString() + '] "result: ' + util.inspect(job).replace(/\n/g, `\n` + ' '.repeat(63)) + '"');

});