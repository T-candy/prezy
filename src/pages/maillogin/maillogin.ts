import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AuthProvider } from '../../providers/auth/auth';
import { usercreds } from '../../models/interfaces/usercreds';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the MailloginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-maillogin',
  templateUrl: 'maillogin.html',
})
export class MailloginPage {

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
  companydata = {}

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public authservice: AuthProvider,
    private afAuth: AngularFireAuth
) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MailloginPage');
  }

  ionViewWillEnter() {
    this.employer = this.navParams.get("employer");
    console.log(this.employer);
  }

  register(){
    this.authservice.register(this.credentials).then((res: any) => {
      if (!res.code) {
        console.log(res);
        this.loggedin = true;
        this.navCtrl.setRoot(HomePage, {loggedin: this.loggedin});
      } else {
        console.log(res);
      }
    })
  }

  login(){
    this.authservice.login(this.credentials).then((res: any) => {
      if (!res.code) {
        console.log(res);
        this.loggedin = true;
        // this.navCtrl.setRoot(HomePage, {loggedin: this.loggedin});
        this.navCtrl.setRoot(TabsPage, {loggedin: this.loggedin});
      } else {
        console.log(res);
      }
    })
  }

  FBlogin(){
    this.authservice.FBlogin().then(() => {
      this.loggedin = true;
      this.navCtrl.setRoot(TabsPage, {loggedin: this.loggedin});
    })
  }

  back(){
    this.viewCtrl.dismiss();
  }

  register2() {
    this.loggedin = true;
    this.employer = true;
    console.log(this.companydata);
    this.navCtrl.setRoot(TabsPage, {
      loggedin: this.loggedin,
      employer: this.employer
    })
  }

}
