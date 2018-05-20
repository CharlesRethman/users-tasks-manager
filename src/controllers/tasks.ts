'use strict';

import {
  create,
  getMany,
  getOne,
  update,
  deleteOne
} from '../db/ops';



export async function createTask(req, res, next): Promise<void> {
  
  try {

    const value: any = Object.assign(
      {},
      req.swagger.params.task.value,
      { user_id: req.swagger.params.user_id.value }
    );
//    console.log('\ntasks.ts/createTask: value =', value);
    const doc: any = await create('tasks', value);
//    console.log('tasks.ts/createTask: response =', doc);
    res
      .status(200)
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
      req.swagger.params.id.value, 
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