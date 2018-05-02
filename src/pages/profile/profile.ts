import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserProvider } from '../../providers/user/user';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public zone: NgZone,
    public modalCtrl: ModalController,
    public userservice: UserProvider,
    private afAuth: AngularFireAuth
  ) {
    this.provider.loggedin = this.navParams.get('loggedin');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    console.log(this.provider);
  }

  ionViewWillEnter() {
    this.loaduserdetails();
  }

  loaduserdetails() {
    this.userservice.getuserdetails().then((res: any) => {
      this.provider.name = res.name;
      this.provider.email = res.email;
      this.provider.profilePic = res.photoURL;
      this.provider.intro = res.intro;
      this.provider.affiliation = res.affiliation;
      this.provider.skill = res.skill;
      this.provider.school.name = res.school.name;
      this.provider.school.department = res.school.department;
      this.provider.school.graduation = res.school.graduation;
      this.provider.company.name = res.company.name;
      this.provider.company.position = res.company.position;
      this.provider.company.category = res.company.category;
      // this.zone.run(() => {
      //   this.provider.profilePic = res.photoURL;
      // })
    })
  }

  presentModal() {
    let modal = this.modalCtrl.create(HomePage, this.provider);
    modal.present();
  }

  pho(){
    this.navCtrl.push(PhotoPage, this.provider)
  }
}
