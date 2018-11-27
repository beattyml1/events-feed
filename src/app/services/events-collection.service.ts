import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {Event} from "../models";

@Injectable({
  providedIn: 'root'
})
export class EventsCollectionService {
  constructor(private db: AngularFirestore) { }

  collection() {
    return this.db.collection('events');
  }
  all(): Observable<Event[]> {
    return this.collection().get().pipe(map(_ =>_.docs.map(_ => ({ ..._.data(), id: _.id}) as Event)));
  }
}
