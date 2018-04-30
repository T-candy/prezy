import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Http, HttpModule } from '@angular/http';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ImghandlerProvider } from '../../providers/imghandler/imghandler';
import { UserProvider } from '../../providers/user/user';
import * as firebase from 'firebase/app';

import { ProfilePage } from '../profile/profile';

/**
 * Generated class for the PhotoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html',
})
export class PhotoPage {
  imgurl = 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e';
  moveon = true;

  provider = {
    name: '',
    email: '',
    profilePic: ''
  }

  testCheckboxOpen: boolean;
  testCheckboxResult;

  firedata = firebase.database().ref('/users');

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public imgservice: ImghandlerProvider,
    public zone: NgZone,
    public userservice: UserProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {
    this.provider.name = this.navParams.get('name');
    this.provider.email = this.navParams.get('email');
    this.provider.profilePic = this.navParams.get('profilePic');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotoPage');
  }

  chooseimage() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    })
    loader.present();
    this.imgservice.uploadimage().then((uploadedurl: any) => {
      loader.dismiss();
      this.zone.run(() => {
        this.imgurl = uploadedurl;
        this.moveon = false;
      })
    })
  }

  updateproceed() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    })
    loader.present();
    this.userservice.updateimage(this.imgurl).then((res: any) => {
      loader.dismiss();
      // if (res.success) {
      //   this.navCtrl.setRoot('TabsPage');
      // }
      // else {
      //   alert(res);
      // }
    })
  }

  proceed() {
    this.navCtrl.setRoot('ProfilePage');
  }

  // 関心のある業界
  doCheckbox() {
    let alert = this.alertCtrl.create();
    alert.setTitle('どれが興味ある？');

    alert.addInput({
      type: 'checkbox',
      label: 'IT・ソフトウェア・情報',
      value: 'value1',
      checked: true
    });

    alert.addInput({
      type: 'checkbox',
      label: 'メーカー',
      value: 'value2'
    });

    alert.addInput({
      type: 'checkbox',
      label: '商社',
      value: 'value3'
    });

    alert.addInput({
      type: 'checkbox',
      label: '銀行・証券・金融',
      value: 'value4'
    });

    alert.addInput({
      type: 'checkbox',
      label: '情報（広告・通信・マスコミ）',
      value: 'value5'
    });

    alert.addInput({
      type: 'checkbox',
      label: '教育',
      value: 'value6'
    });

    alert.addInput({
      type: 'checkbox',
      label: '旅行・インバウンド',
      value: 'value6'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log('Checkbox data:', data);
        this.testCheckboxOpen = false;
        this.testCheckboxResult = data;
      }
    });
    alert.present().then(() => {
      this.testCheckboxOpen = true;
    });
  }

  profileSave(){
  }

}
