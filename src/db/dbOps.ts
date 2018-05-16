'use strict'

import { Db, DeleteWriteOpResultObject, ObjectId, WriteOpResult, UpdateWriteOpResult } from 'mongodb';
import { mongoDb } from '../app';
import { ok } from 'assert';


interface Identifier {
  _id?: ObjectId;
  username?: string;
}


async function sequencer(col) {

  const db = await mongoDb;
  const records: number = await db.collection(col).count({});
//  console.log('number records =', records);
  return records;

}

async function checkExists(col, identifier): Promise<boolean> {

  try {

    const result = await getOne(col, identifier);
//    console.log('result =', result, result !== null);
    return result !== null;

  } catch(e) {

    return Promise.reject(e);

  }
}


export async function create(col, doc) {

  try {

    const id: number = await sequencer(col);
    const docId = Object.assign({}, doc, { id: id });

    const db: Db = await mongoDb;
    const result: WriteOpResult = await db
      .collection(col)
      .insertOne(docId);

    console.log('called \'createOne\', returned result.ok =', result.result.ok);
    console.log('result document', result.ops);
    return result;

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

    return results;

  } catch(e) {

    return Promise.reject(e);

  }

}


export async function getOne(col, identifier: string) {

  try {

    const db: Db = await mongoDb;

    const result: any = await db
      .collection(col)
      .findOne({ id: identifier});
    
    return result;

  } catch(e) {

    return Promise.reject(e);

  }
}


export async function update(col: string, identifier: string, doc) {

  try {

    const db: Db = await mongoDb;

    ok(checkExists(col, identifier), 'Existing record not found');

    const result: UpdateWriteOpResult = await db
      .collection(col)
      .updateOne({ id: identifier }, { $set: doc });

    return result;

  } catch(e) {

    return Promise.reject(e);

  }

}


export async function deleteOne(col: string, identifier: string) {

  try {

    const db: Db = await mongoDb;

    ok(checkExists(col, identifier), 'Existing record not found');

    const result: DeleteWriteOpResultObject = await db
      .collection(col)
      .deleteOne({ id: identifier });

  } catch(e) {

    return Promise.reject(e);

  }

}