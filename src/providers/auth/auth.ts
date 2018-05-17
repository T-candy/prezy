import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { usercreds } from '../../models/interfaces/usercreds';
import firebase from 'firebase';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthProvider {

  firedata = firebase.database().ref('/users');

  constructor(public afireauth: AngularFireAuth) {

  }

/*
    For logging in a particular user. Called from the login.ts file.

*/

//  メールログイン＆データベースに保存
  login(credentials: usercreds) {
    var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.signInWithEmailAndPassword(credentials.email, credentials.password).then(() => {
        this.afireauth.auth.currentUser.updateProfile({
          displayName : credentials.name,
          photoURL : ''
        }).then(() => {
          this.firedata.child(this.afireauth.auth.currentUser.uid).set({
              uid: this.afireauth.auth.currentUser.uid,
              name: credentials.name,
              email: this.afireauth.auth.currentUser.email,
              photoURL: 'images/kao.jpg',
              intro : '私は神です。',
              affiliation : '',
              skill : '',
              school:{
                name: '',
                department: '',
                graduation: ''
              },
              company: {
                name: '',
                position: '',
                category: ''
              }
            }).then(() => {
              resolve(true);
            })
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
       })
    })
    return promise;
  }

}