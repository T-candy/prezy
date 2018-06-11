import { Component, Injectable, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Slides } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

import { usercreds } from '../../models/interfaces/usercreds';
import { AuthProvider } from '../../providers/auth/auth';

import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { MailloginPage } from '../maillogin/maillogin';
import { TabsPage } from '../tabs/tabs';

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
  @ViewChild(Slides) slider: Slides;

  loggedin = false;
  employer = false;

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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public authservice: AuthProvider,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private afAuth: AngularFireAuth,
    private fb: Facebook,
    private platform: Platform
    ) {
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

  FBlogin(){
    this.authservice.FBlogin().then(() => {
      this.loggedin = true;
      this.navCtrl.setRoot(TabsPage, {
        loggedin: this.loggedin,
        employer: this.employer
      });
    })
  }

    maillogin(){
      // this.navCtrl.push(MailloginPage);
      let loginModal = this.modalCtrl.create(MailloginPage);
      loginModal.present();
    }

    prelogin() {
      this.employer = true;
      let loginModal = this.modalCtrl.create(MailloginPage, {employer: this.employer});
      loginModal.present();
    }

  }