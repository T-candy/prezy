import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Http, HttpModule } from '@angular/http';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ActionSheetController  } from 'ionic-angular';
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
  moveon = true;

  loggedin = false;

  // provider:any;
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

  testCheckboxOpen: boolean;

  firedata = firebase.database().ref('/users');

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public imgservice: ImghandlerProvider,
    public zone: NgZone,
    public userservice: UserProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.userservice.getuserdetails().then((res: any) => {
      this.provider = res;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotoPage');
    console.log(this.provider);
  }

  ionViewWillLeave() {
    let alert = this.alertCtrl.create({
    title: '変更を破棄しますか？',
    message: '変更内容が保存されていません。',
    buttons: [
      {
        text: 'はい',
        role: 'cancel',
        handler: () => {
          console.log('変更破棄');
        }
      },
      {
        text: 'いいえ',
        handler: () => {
          console.log('変更したい戻る');
        }
      }
    ]
  });
  alert.present();
  }

  chooseimage() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '写真を変更する',
      buttons: [
        {
          text: 'カメラを撮る',
          role: 'destructive',
          icon: 'camera',
          handler: () => {
            console.log('Destructive clicked');
              let loader = this.loadingCtrl.create({
                content: 'Please wait'
              });
              loader.present();
              this.imgservice.picmsgstore().then((imgurl) => {
                loader.dismiss();
              }).catch((err) => {
                alert(err);
                loader.dismiss();
              })
          }
        },{
          text: 'ファイルから選択',
          handler: () => {
            console.log('ファイル clicked');
            let loader = this.loadingCtrl.create({
              content: 'Please wait'
            })
            loader.present();
            this.imgservice.uploadimage().then((uploadedurl: any) => {
              loader.dismiss();
              console.log(uploadedurl);
              this.zone.run(() => {
                this.provider.photoURL = uploadedurl;
                this.moveon = false;
              })
            })
          }
        },{
          text: 'キャンセル',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  // chooseimage() {
  //   let loader = this.loadingCtrl.create({
  //     content: 'Please wait'
  //   })
  //   loader.present();
  //   this.imgservice.uploadimage().then((uploadedurl: any) => {
  //     loader.dismiss();
  //     this.zone.run(() => {
  //       this.imgurl = uploadedurl;
  //       this.moveon = false;
  //     })
  //   })
  // }

// ボタン押してFirebaseに保存
  // updateproceed() {
  //   let loader = this.loadingCtrl.create({
  //     content: 'Please wait'
  //   })
  //   loader.present();
  //   this.userservice.updateimage(this.imgurl).then((res: any) => {
  //     loader.dismiss();
  //   })
  // }

  proceed() {
    this.navCtrl.setRoot(ProfilePage, this.provider);
  }

  // 学歴
  doSchool() {
    let alert = this.alertCtrl.create({
      title: '学歴の編集',
      inputs: [{
        name: 'schoolname',
        placeholder: '学校名',
        type: 'text'
      },{
        name: 'department',
        placeholder: '学部',
        type: 'text'
      },{
        name: 'graduation',
        placeholder: '卒業（予定）年度',
        type: 'number'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },{
        text: 'Okay',
        handler: data => {
          console.log('School data:', data);
          this.provider.school.name = data.schoolname;
          this.provider.school.department = data.department;
          this.provider.school.graduation = data.graduation;
        }
      }]
    });
    alert.present();
}

// 職歴
doCompany() {
  let alert = this.alertCtrl.create({
    title: '職歴の編集',
    inputs: [{
      name: 'companyname',
      placeholder: '企業名',
      type: 'text'
    },{
      name: 'position',
      placeholder: '担当の役職（インターンシップなど）',
      type: 'text'
    },{
      name: 'category',
      placeholder: '担当の職種（エンジニアなど）',
      type: 'text'
    }],
    buttons: [{
      text: 'Cancel',
      role: 'cancel',
      handler: data => {
        console.log('Cancel clicked');
      }
    },{
      text: 'Okay',
      handler: data => {
        console.log('School data:', data);
        this.provider.company.name = data.companyname;
        this.provider.company.position = data.position;
        this.provider.company.category = data.category;
      }
    }]
  });
  alert.present();
}

  // 関心のある業界 これにするかは仮
  doCheckbox() {
    let alert = this.alertCtrl.create();
    alert.setTitle('スキルの編集');

    alert.addInput({
      type: 'checkbox',
      label: 'Git',
      value: 'Git',
      checked: true
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Java',
      value: 'Java'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Ruby',
      value: 'Ruby'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Swift',
      value: 'Swift'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'PHP',
      value: 'PHP'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'CSS',
      value: 'CSS'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'HTML',
      value: 'HTML'
    });

    alert.addInput({
      type: 'checkbox',
      label: '英語',
      value: '英語'
    });

    alert.addInput({
      type: 'checkbox',
      label: '中国語',
      value: '中国語'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log('Checkbox data:', data);
        this.testCheckboxOpen = false;
        // this.testCheckboxResult = data;
        this.provider.skill = data;
      }
    });
    alert.present().then(() => {
      this.testCheckboxOpen = true;
    });
  }

  profileSave(){
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    })
    loader.present();
    this.userservice.updatedetail(this.provider).then((res: any) => {
      loader.dismiss();
      if (res.success) {
        // this.navCtrl.setRoot(ProfilePage, this.provider);
        this.navCtrl.pop();
      }
      else {
        alert(res);
      }
    })
  }

}
