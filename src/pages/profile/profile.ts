import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  provider:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public zone: NgZone,
    public userservice: UserProvider,
    private afAuth: AngularFireAuth
  ) {
    this.userservice.getuserdetails().then((res: any) => {
      this.provider = res;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    console.log(this.provider);
  }

  presentModal() {
    this.navCtrl.push(HomePage, this.provider)
  }

  logout() {
    firebase.auth().signOut().then(() => {
          this.navCtrl.parent.parent.setRoot(LoginPage);
        })
    }

  pho(){
    this.navCtrl.setRoot(PhotoPage, this.provider)
  }

  home(){
    this.navCtrl.setRoot(HomePage, this.provider)
  }

  chatm(){
    this.provider.loggedin = true;
    this.navCtrl.push(ChatmainPage, this.provider)
  }
}
