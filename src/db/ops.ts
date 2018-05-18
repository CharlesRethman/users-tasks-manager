'use strict'

import { expect } from 'chai';
import {
  Db,
  DeleteWriteOpResultObject,
  ObjectId,
  ObjectID,
  WriteOpResult,
  UpdateWriteOpResult
} from 'mongodb';

import { checkExists, objectIdToString } from './helpers';
import { mongoDb } from '../app';


export async function create(col, doc) {

  try {

    const db: Db = await mongoDb;
    const res: WriteOpResult = await db
      .collection(col)
      .insertOne(doc);

    return objectIdToString(res.ops['0']);

  } catch(e) {

    return Promise.reject(e);

  }

}


export async function getMany(col, query, projection, sort) {

  try {

    const db: Db = await mongoDb;

    const results: any[] = await db
      .collection(col)
      .find(query, projection)
      .toArray();

    return results.map(e => objectIdToString(e));

  } catch(e) {

    return Promise.reject(e);

  }

}


export async function getOne(col, id: string) {

  try {

    const db: Db = await mongoDb;

    const result: any = await db
      .collection(col)
      .findOne({ _id: new ObjectID(id) });
    
    return result === null ? result : objectIdToString(result);

  } catch(e) {

    return Promise.reject(e);

  }
}


export async function update(col: string, id: string, doc) {

  try {

    const db: Db = await mongoDb;

    expect(await checkExists(col, id), 'Existing record not found').is.true;

    const res: UpdateWriteOpResult = await db
      .collection(col)
      .updateOne({ _id: new ObjectID(id) }, { $set: doc });
    expect(res.result.ok, 'update failed').eqls(1);
    
    const newRes: any = await db
      .collection(col)
      .findOne({ _id: new ObjectID(id) });

    return newRes === null ? newRes : objectIdToString(newRes);

  } catch(e) {

    return Promise.reject(e);

  }

}


export async function deleteOne(col: string, id: string) {

  try {

    const db: Db = await mongoDb;

    expect(await checkExists(col, id), 'Existing record not found').is.true;

    const res: DeleteWriteOpResultObject = await db
      .collection(col)
      .deleteOne({ _id: new ObjectID(id) });

    expect(res.result.ok, 'delete failed').eqls(1);
    expect(res.result.n, res.result.n + ' records were deleted, instead of 1').eqls(1);
    return {
      collection: col,
      id: id,
      action: 'deleted'
    };

  } catch(e) {

    return Promise.reject(e);

  }

}