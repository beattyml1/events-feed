import { Injectable } from '@angular/core';
import {flatMap, map} from "rxjs/operators";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import {AuthService} from "../core/auth.service";
import {StarredData} from "../models";
import {record, records} from "./records";

@Injectable({
  providedIn: 'root'
})
export class StarredCollectionService {
  private starred: AngularFirestoreCollection<any>;
  constructor(private db: AngularFirestore, private  auth: AuthService) {
    this.collection().subscribe(starred => this.starred = starred)
  }

  userId() {
    return this.auth.afAuth.authState.pipe(map(user => user.uid));
  }

  collection() {
    return this.userDoc().pipe(map(_ => _.collection('starred')))
  }

  userDoc() {
    return this.userId().pipe(
      map(user => this.db.doc(`users/${user}`))
    );
  }

  starDoc(eventId) {
    return this.starred.doc(eventId);
  }

  userStarsGet() {
    return this.collection().pipe(
      flatMap(_ => _.get()),
      map(records),
      map(starred => (starred || []) as StarredData[])
    );
  }

  starEvent(eventId) {
    return this.starDoc(eventId).set({ value: true })
  }

  unstarEvent(eventId) {
    return this.starDoc(eventId).delete()
  }
}
