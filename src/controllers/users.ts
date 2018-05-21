'use strict';

import {
  create,
  getMany,
  getOne,
  update
} from '../db/ops';



export async function createUser(req, res, next): Promise<void> {
  
  try {

    const doc: any = await create('users', req.swagger.params.user.value);
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


export async function listAllUsers(req, res, next): Promise<void> {

  try {

    const docs: any[] = await getMany('users', {}, {}, {});
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


export async function getUserInfo(req, res, next): Promise<void> {

  try {

    const doc: any = await getOne('users', req.swagger.params.id.value, {}, {});
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


export async function updateUser(req, res, next): Promise<void> {

  try {

    const doc: any = await update(
      'users', 
      req.swagger.params.id.value,
      {},
      req.swagger.params.user.value
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