import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, App } from 'ionic-angular';
import firebase from 'firebase';
import { LoginPage } from '../login/login';
import { ContactPage } from '../contact/contact';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  loggedin: false;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public authservice: AuthProvider,
    public app: App
  ) {

  }

  contact() {
    this.navCtrl.push(ContactPage);
  }

  logout() {
    this.authservice.logout().then((res: any) => {
      if(!res.code) {
        this.loggedin = false;

        this.toastCtrl.create({
          message: 'ログアウトしました！',
          duration: 2000,
          position: 'middle'
        })
        this.navCtrl.parent.parent.setRoot(LoginPage, {loggedin: this.loggedin});
      } else {
        console.log(res);
        let alert = this.alertCtrl.create({
          title: 'エラー',
          subTitle: 'ログアウトできませんでした。',
          buttons: ['OK']
        });
        alert.present();
      }
    })
  }

  delete() {
    let alert = this.alertCtrl.create({
      title: 'アカウントの削除',
      subTitle: 'アカウントを削除すると元通りにはできないので、お気をつけください。',
      buttons: [{
        text: 'やめる',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },{
        text: '削除',
        handler: data => {
          console.log('削除');
        }
      }]
    });
    alert.present();
  }

}
