'use strict';

import { Db, ObjectID } from 'mongodb';

import { getOne } from './ops';
import { mongoDb } from '../app';


function buildField(key: string, value: any, o?: any) {

  let obj = o || {};
//  console.log('key =', key, ', value =', value);
  obj[key] = value;
  return Object.assign({}, obj); //makes copy of object

}


export async function checkExists(col: string, id: string): Promise<boolean> {

  try {

    const result = await getOne(col, id);
    return result !== null;

  } catch(e) {

    return Promise.reject(e);

  }
}


export function objectIdToString<T>(payload: T) {

  return Object.keys(payload)
    .reduce(
      (r, key) => Object.assign(
        r,
        key === '_id' ? { id: payload[key].toString() } : buildField(key, payload[key])
      ), {}
    );

}
