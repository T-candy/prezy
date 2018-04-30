import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { PhotoPage } from '../photo/photo';

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

  provider = {
    loggedin: false,
    name: '',
    email: '',
    profilePic: ''
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private afAuth: AngularFireAuth
  ) {
    this.provider.loggedin = this.navParams.get('loggedin');
    this.provider.name = this.navParams.get('name');
    this.provider.email = this.navParams.get('email');
    this.provider.profilePic = this.navParams.get('profilePic');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  presentModal() {
    let modal = this.modalCtrl.create(HomePage);
    modal.present();
  }

  pho(){
    this.navCtrl.push(PhotoPage, this.provider)
  }
}
