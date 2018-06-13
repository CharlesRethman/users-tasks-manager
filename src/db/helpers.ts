'use strict';

import { Db, ObjectID } from 'mongodb';

import { getOne } from './ops';


function buildField(key: string, value: any, o?: any) {

  let obj = o || {};
  obj[key] = value;
  return Object.assign({}, obj); //makes copy of object

}


export async function documentExists(col: string, id: string): Promise<boolean> {

  try {

    const result: any = await getOne(col, id, {}, {});
    return result !== null;

  } catch(e) {

    return Promise.reject(e);

  }
}


export function objectIdToString<T>(payload: T): any {

  return Object.keys(payload)
    .reduce(
      (r, key) => Object.assign(
        r,
        key === '_id' ? { id: payload[key].toString() } : buildField(key, payload[key])
      ), {}
    );

}
