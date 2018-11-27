import {firestore} from 'firebase';
import {Record} from '../models'
import QuerySnapshot = firestore.QueryDocumentSnapshot;

export function record<T extends {} = any>(doc: { data(): T, id: string}) {
  return { ...(doc.data() as any), id: doc.id } as T & Record;
}

export function records<T extends {} = any>(_: { docs: { data(): T, id: string}[]}) {
  return (_.docs && _.docs.map(record)) || [];
}
