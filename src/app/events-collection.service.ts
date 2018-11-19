import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class EventsCollectionService {
  constructor(private db: AngularFirestore) { }

  collection() {
    return this.db.collection('events');
  }
  all() {
    return this.collection().get().pipe(map(_ =>_.docs.map(_ => _.data())));
  }
}
