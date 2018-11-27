import { Injectable } from '@angular/core';
// import 'rxjs/add/operator/toPromise';
import {AngularFirestore} from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {NgRedux} from "@angular-redux/store";
import {AppState} from "../AppState";
import {UserActions} from "../actions";

@Injectable()
export class AuthService {

  constructor(
   private store: NgRedux<AppState>,
   public afAuth: AngularFireAuth,
   private db: AngularFirestore
  ) {}

  // doFacebookLogin(){
  //   return new Promise<any>((resolve, reject) => {
  //     let provider = new firebase.auth.FacebookAuthProvider();
  //     this.afAuth.auth
  //     .signInWithPopup(provider)
  //     .then(res => {
  //       resolve(res);
  //     }, err => {
  //       console.log(err);
  //       reject(err);
  //     })
  //   })
  // }
  //
  // doTwitterLogin(){
  //   return new Promise<any>((resolve, reject) => {
  //     let provider = new firebase.auth.TwitterAuthProvider();
  //     this.afAuth.auth
  //     .signInWithPopup(provider)
  //     .then(res => {
  //       resolve(res);
  //     }, err => {
  //       console.log(err);
  //       reject(err);
  //     })
  //   })
  // }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        this.store.dispatch(UserActions.setUserData(res))
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        this.store.dispatch(UserActions.setUserData(res))
        resolve(res);
      }, err => reject(err));
    });
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        this.store.dispatch(UserActions.setUserData(res))
        resolve(res);
      }, err => reject(err));
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut()
        this.store.dispatch(UserActions.setUserData(null))
        resolve();
      } else {
        reject();
      }
    });
  }
}
