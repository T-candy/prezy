import { Component, Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

import { usercreds } from '../../models/interfaces/usercreds';
import { AuthProvider } from '../../providers/auth/auth';

import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  firedata = firebase.database().ref('/users');

  provider = {
    loggedin: false,
    name: '',
    email: '',
    profilePic: '',
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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private fb: Facebook, private platform: Platform) {
    //   afAuth.authState.subscribe(user => {
    //   if (!user) {
    //     this.displayName = null;
    //     return;
    //   }
    //   this.displayName = user.displayName;
    // });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  // FBlogin(){
  //   if (this.platform.is('cordova')) {
  //     return this.fb.login(['email', 'public_profile']).then(res => {
  //       const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
  //       return firebase.auth().signInWithCredential(facebookCredential).then(info => {
  //         this.provider.loggedin = true;
  //         this.provider.name = info.user.displayName;
  // 		    this.provider.email = info.user.email;
  // 		    this.provider.profilePic = info.user.photoURL;
  //         this.navCtrl.setRoot(ProfilePage);
  //       });
  //     })
  //   }
  //   else {
  //     return this.afAuth.auth
  //       .signInWithPopup(new firebase.auth.FacebookAuthProvider())
  //       .then(res => {
  //         this.provider.loggedin = true;
  //         this.provider.name = res.user.displayName;
  // 		    this.provider.email = res.user.email;
  // 		    this.provider.profilePic = res.user.photoURL;
  //         console.log(res);
  //         this.navCtrl.setRoot(ProfilePage, this.provider);
  //       });
  //   }
  // }

  FBlogin(){
    var promise = new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(res => {
        this.provider.loggedin = true;
        this.provider.name = res.user.displayName;
        this.provider.email = res.user.email;
        if (res.user.photoURL == null ) {
          this.provider.profilePic = 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e';
        } else {
          this.provider.profilePic = res.user.photoURL;
        }
        console.log(res);
        this.afAuth.auth.currentUser.updateProfile({
          displayName : res.user.displayName,
  		    // email : res.user.email,
  		    photoURL : res.user.photoURL
        }).then(() => {
          this.firedata.child(this.afAuth.auth.currentUser.uid).set({
            name: this.afAuth.auth.currentUser.displayName,
            email: this.afAuth.auth.currentUser.email,
            // photoURL: this.afAuth.auth.currentUser.photoURL,
            photoURL: this.provider.profilePic,
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
            this.navCtrl.setRoot(HomePage, this.provider);
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
}
