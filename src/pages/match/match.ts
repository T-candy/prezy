import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { UserProvider } from '../../providers/user/user';
import { RequestsProvider } from '../../providers/requests/requests';
import { ChatProvider } from '../../providers/chat/chat';

/**
 * Generated class for the MatchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-match',
  templateUrl: 'match.html',
})
export class MatchPage {
  allmessages = [];
  buddy: any;
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
    public userservice: UserProvider,
    public requestservice: RequestsProvider,
    public chatservice: ChatProvider,
    public events: Events
) {
  this.userservice.getuserdetails().then((res: any) => {
    this.provider = res;
  })

  this.buddy = this.chatservice.buddy;
  this.allmessages = this.chatservice.buddymessages;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchPage');
    console.log(this.buddy);
}

  // リクエスト情報を読み込む
    // ionViewWillEnter() {
    // this.requestservice.getmyfriends();
    // this.myfriends = [];
    // this.events.subscribe('friends', () => {
    //   this.myfriends = [];
    //   this.myfriends = this.requestservice.myfriends;
    // })
    // }
    //
    // ionViewDidLeave() {
    //   this.events.unsubscribe('friends');
    // }

  home(){
    this.navCtrl.popToRoot();
  }

  buddychat(buddy) {
    this.chatservice.initializebuddy(buddy);
    this.navCtrl.push('BuddychatPage');
  }
}
