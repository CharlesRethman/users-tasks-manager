'use strict';

import { UpdateWriteOpResult } from 'mongodb';

import { getMany, update } from '../db/ops';


export async function executeTasks (cutOff: Date, present: Date): Promise<any[]> {

  try {

    const docs: any[] = await getMany('tasks', { status: 'pending' }, {}, {});

    if(cutOff < present) {
      const result: any[] = await Promise.all(docs.map(async (doc): Promise<UpdateWriteOpResult['result']> => {
        return await update('tasks', doc.id, {}, { status: 'done' });
      }));
      return Promise.resolve(result);
    } else {
      return Promise.resolve([]);
    }

  } catch(e) {

    return Promise.reject(e);
  
  }

}