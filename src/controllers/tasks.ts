'use strict';

import {
  create,
  getMany,
  getOne,
  update,
  deleteOne
} from '../db/ops';


function fixDateTime(date_time: string) {
  return date_time.indexOf('T') === 10 && date_time.indexOf('Z') === date_time.length - 1
  ? date_time
  : (
      date_time.substring(0, date_time.indexOf(' '))
      + 'T'
      + date_time.substring(date_time.indexOf(' ') + 1, date_time.length)
      + 'Z'
    )
}


export async function createTask(req, res, next): Promise<void> {
  
  try {

    const value: any = Object.assign(
      {},
      req.swagger.params.task.value,
      {
        user_id: req.swagger.params.user_id.value,
        status: 'pending',
        date_time: fixDateTime(req.swagger.params.task.value.date_time)
      }
    );

    const doc: any = await create('tasks', value);
    res
      .status(201)
      .type('application/json')
      .json(doc)
      .end()

  } catch(e) {

    // logger
    res
      .status(404)
      .type('application/json')
      .json(e)
      .end()

  }

}


export async function listAllUserTasks(req, res, next): Promise<void> {

  try {

    const docs: any[] = await getMany(
      'tasks',
      { user_id: req.swagger.params.user_id.value },
      {},
      {}
    );
    res
      .status(200)
      .type('application/json')
      .json(docs)
      .end();

  } catch(e) {

    //logger
    res
      .status(404)
      .type('application/json')
      .json(e)
      .end();

  }

}


export async function getTaskInfo(req, res, next): Promise<void> {

  try {

    const doc: any = await getOne(
      'tasks',
      req.swagger.params.task_id.value,
      { user_id: req.swagger.params.user_id.value },
      {}
    );
    res
      .status(200)
      .type('application/json')
      .json(doc)
      .end();

  } catch(e) {

    //logger
    res
      .status(404)
      .type('application/json')
      .json(e)
      .end();

  }
}


export async function updateTask(req, res, next): Promise<void> {

  try {

    const doc: any = await update(
      'tasks',
      req.swagger.params.task_id.value,
      {},
      req.swagger.params.task.value
    );
    res
      .status(200)
      .type('application/json')
      .json(doc)
      .end();

  } catch(e) {

    //logger
    res
      .status(404)
      .type('application/json')
      .json(e)
      .end();
  }

}


export async function deleteTask(req, res, next): Promise<void> {

  try {

    const doc = await deleteOne(
      'tasks',
      req.swagger.params.task_id.value,
      { user_id: req.swagger.params.user_id.value }
    );
    res
      .status(200)
      .type('application/json')
      .json(doc)
      .end();

  } catch(e) {

    // logger
    res
      .status(404)
      .type('application/json')
      .json(e)
      .end();

  }

}