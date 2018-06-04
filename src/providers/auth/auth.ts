import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { usercreds } from '../../models/interfaces/usercreds';
// import firebase from 'firebase';
import * as firebase from 'firebase/app';
import { Facebook } from '@ionic-native/facebook';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthProvider {

  firedata = firebase.database().ref('/users');

  provider = {
    name: '',
    email: '',
    photoURL: '',
    intro: '',
    affiliation: '',
    skill: '',
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
  }

  credentials = {} as usercreds;

  constructor(
    public http: HttpClient,
    public afAuth: AngularFireAuth) {

  }

/*
    For logging in a particular user. Called from the login.ts file.

*/

FBlogin(){
  var promise = new Promise((resolve, reject) => {
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(res => {
      if (res.user.photoURL == null ) {
      this.provider.photoURL = 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e';
      } else {
      this.provider.photoURL = res.user.photoURL;
      }
      console.log(res);
      this.afAuth.auth.currentUser.updateProfile({
        displayName : res.user.displayName,
        photoURL : this.provider.photoURL
      }).then(() => {
        this.firedata.child(this.afAuth.auth.currentUser.uid).set({
          uid: this.afAuth.auth.currentUser.uid,
          name: this.afAuth.auth.currentUser.displayName,
          email: this.afAuth.auth.currentUser.email,
          photoURL: this.afAuth.auth.currentUser.photoURL,
          // photoURL: this.provider.photoURL,
          intro: '',
          affiliation: '',
          skill: '',
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
          resolve({ success: true });
          }).catch((err) => {
            reject(err);
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

//  メール登録＆ログイン＆データベースに保存
  register(credentials: usercreds) {
    var promise = new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password).then(() => {
          this.firedata.child(this.afAuth.auth.currentUser.uid).set({
              uid: this.afAuth.auth.currentUser.uid,
              name: credentials.name,
              email: this.afAuth.auth.currentUser.email,
              photoURL: 'images/kao.jpg',
              intro : '私は神です。変更してないよ',
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
    })
    return promise;
  }

//  メールログイン
  login(credentials: usercreds) {
    var promise = new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password).then(() => {
        this.afAuth.auth.currentUser.updateProfile({
          displayName : credentials.name,
          photoURL : ''
        }).then(() => {
          resolve(true);
        })
      }).catch((err) => {
        reject(err);
       })
    })
    return promise;
  }

  // ログアウト
  logout(){
  var promise = new Promise((resolve, reject) => {
    this.afAuth.auth.signOut().then(() => {
      resolve(true);
    }).catch((err) => {
      reject(err);
    })
  })
  return promise;
}

}