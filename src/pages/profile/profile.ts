import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserProvider } from '../../providers/user/user';

import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { PhotoPage } from '../photo/photo';
import { ChatmainPage } from '../chatmain/chatmain';

import firebase from 'firebase';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  loggedin = false;
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public zone: NgZone,
    public userservice: UserProvider,
    private afAuth: AngularFireAuth
  ) {
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    console.log(this.provider);
  }

  ionViewWillEnter() {
    this.loggedin = this.navParams.get("loggedin");
    console.log(this.loggedin);

    if (this.loggedin) {
      this.userservice.getuserdetails().then((res: any) => {
        this.provider = res;
      })
    } else {
     this.provider = this.navParams.get("recipient");
  }
}

  logout() {
    firebase.auth().signOut().then(function() {
      this.navCtrl.setRoot(LoginPage);
    }).catch(function(error) {
      let alert = this.alertCtrl.create({
    title: 'エラー',
    subTitle: 'ログアウトできませんでした。',
    buttons: ['OK']
  });
  alert.present();
    });
  }

  pho(){
    this.navCtrl.push(PhotoPage, {loggedin: this.loggedin})
  }

  home(){
    this.navCtrl.setRoot(HomePage, {loggedin: this.loggedin})
  }

  chatm(){
    this.loggedin = true;
    this.navCtrl.push(ChatmainPage, this.provider)
  }
}
