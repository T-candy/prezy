import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserProvider {
  firedata = firebase.database().ref('/users');

  constructor(public afireauth: AngularFireAuth) {
  }

  // メールで新規ユーザー登録
  // adduser(newuser) {
  //   var promise = new Promise((resolve, reject) => {
  //     this.afireauth.auth.createUserWithEmailAndPassword(newuser.email, newuser.password).then(() => {
  //       this.afireauth.auth.currentUser.updateProfile({
  //         displayName: newuser.displayName,
  //         photoURL: ''
  //       }).then(() => {
  //         this.firedata.child(this.afireauth.auth.currentUser.uid).set({
  //           uid: this.afireauth.auth.currentUser.uid,
  //           displayName: newuser.displayName,
  //           photoURL: 'give a dummy placeholder url here'
  //         }).then(() => {
  //           resolve({ success: true });
  //           }).catch((err) => {
  //             reject(err);
  //         })
  //         }).catch((err) => {
  //           reject(err);
  //       })
  //     }).catch((err) => {
  //       reject(err);
  //     })
  //   })
  //   return promise;
  // }

  updateimage(imageurl) {
      var promise = new Promise((resolve, reject) => {
          this.afireauth.auth.currentUser.updateProfile({
              displayName: this.afireauth.auth.currentUser.displayName,
              photoURL: imageurl
          }).then(() => {
              firebase.database().ref('/users/' + firebase.auth().currentUser.uid).update({
              displayName: this.afireauth.auth.currentUser.displayName,
              photoURL: imageurl
              // uid: firebase.auth().currentUser.uid
              }).then(() => {
                  resolve({ success: true });
                  }).catch((err) => {
                      reject(err);
                  })
          }).catch((err) => {
                reject(err);
             })
      })
      return promise;
  }

// プロフィール編集
  updatedetail(provider){
    var promise = new Promise((resolve, reject) => {
      provider.loggedin = true;
        this.afireauth.auth.currentUser.updateProfile({
          displayName: this.afireauth.auth.currentUser.displayName,
          photoURL: ''
        }).then(() => {
            firebase.database().ref('/users/' + firebase.auth().currentUser.uid).update({
            name: this.afireauth.auth.currentUser.displayName,
            email: this.afireauth.auth.currentUser.email,
            intro: provider.intro,
            affiliation: provider.affiliation,
            skill: provider.skill,
            school: provider.school,
            company: provider.company,
            uid: firebase.auth().currentUser.uid
            }).then(() => {
                resolve({ success: true });
                }).catch((err) => {
                    reject(err);
                })
        }).catch((err) => {
              reject(err);
           })
    })
    return promise;
  }

// ログインユーザーの情報を取得
getuserdetails() {
    var promise = new Promise((resolve, reject) => {
    this.firedata.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
      resolve(snapshot.val());
    }).catch((err) => {
      reject(err);
      })
    })
    return promise;
  }

// すべてのユーザー情報を取得
  getallusers() {
    var promise = new Promise((resolve, reject) => {
      this.firedata.orderByChild('uid').once('value', (snapshot) => {
        let userdata = snapshot.val();
        let temparr = [];
        for (var key in userdata) {
          temparr.push(userdata[key]);
        }
        resolve(temparr);
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }
}