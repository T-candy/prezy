import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, App } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserProvider } from '../../providers/user/user';

import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { PhotoPage } from '../photo/photo';
import { AboutPage } from '../about/about';
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
  employer =  this.navParams.get("employer");

  provider = {}

  // provider = {
  //   name: '',
  //   email: '',
  //   photoURL: '',
  //   intro: '',
  //   affiliation: '',
  //   skill: [],
  //   school:{
  //     name: '',
  //     department: '',
  //     graduation: ''
  //   },
  //   company: {
  //     name: '',
  //     position: '',
  //     category: ''
  //   }
  // }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public appCtrl: App,
    public zone: NgZone,
    public userservice: UserProvider,
    private afAuth: AngularFireAuth
  ) {
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
}

  ionViewWillEnter() {
    this.getuserdetail();
    // this.witchuser();
  }

  // providerに入れるロジック
  getuserdetail() {
    this.loggedin = this.navParams.get("loggedin");
    // this.employer = this.navParams.get("employer");
    console.log(this.loggedin);

    if (this.loggedin) {
      if(this.employer) {
        this.userservice.getpresidentdetails().then((res: any) => {
          this.provider = res;
        })
      } else {
        this.userservice.getuserdetails().then((res: any) => {
          this.provider = res;
        })
      }
     console.log(this.provider);
    } else {
     this.provider = this.navParams.get("recipient");
     console.log(this.provider);
   }
 }

 // 表ロジック
//  witchuser() {
//  this.employer = this.navParams.get("employer");
// }

  pho(){
    this.navCtrl.push(PhotoPage, {loggedin: this.loggedin});
  }

  config(){
    this.navCtrl.push(AboutPage);
  }
}
