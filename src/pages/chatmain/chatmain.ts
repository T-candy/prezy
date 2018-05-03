import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController  } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { RequestsProvider } from '../../providers/requests/requests';
import { connreq } from '../../models/interfaces/request';
import firebase from 'firebase';

/**
 * Generated class for the ChatmainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-chatmain',
  templateUrl: 'chatmain.html',
})
export class ChatmainPage {

  temparr = [];
  filteredusers = [];
  newrequest = {} as connreq;

  myrequests;
  myfriends;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public userservice: UserProvider,
    public requestservice: RequestsProvider,
    public events: Events ) {
    this.userservice.getallusers().then((res: any) => {
      this.filteredusers = res;
      this.temparr = res;
   })
 }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatmainPage');
  }

// リクエスト情報を読み込む
  ionViewWillEnter() {
  this.requestservice.getmyrequests();
  this.requestservice.getmyfriends();
  this.myfriends = [];
  this.events.subscribe('gotrequests', () => {
    this.myrequests = [];
    this.myrequests = this.requestservice.userdetails;
  })
  this.events.subscribe('friends', () => {
    this.myfriends = [];
    this.myfriends = this.requestservice.myfriends;
  })
  }

  ionViewDidLeave() {
    this.events.unsubscribe('gotrequests');
    this.events.unsubscribe('friends');
  }

// リクエストを送る
  sendreq(recipient) {
   this.newrequest.sender = firebase.auth().currentUser.uid;
   this.newrequest.recipient = recipient.uid;
   if (this.newrequest.sender === this.newrequest.recipient)
     alert('You are your friend always');
   else {
     let successalert = this.alertCtrl.create({
       title: 'リクエスト送信',
       subTitle: recipient.name + 'さんにリクエストを送りますか？',
       buttons: ['GO!']
     });

     this.requestservice.sendrequest(this.newrequest).then((res: any) => {
       if (res.success) {
         successalert.present();
         let sentuser = this.filteredusers.indexOf(recipient);
         this.filteredusers.splice(sentuser, 1);
       }
     }).catch((err) => {
       console.log(recipient);
       console.log(err);
     })
   }
 }

// リクエストを承認
 accept(item) {
    this.requestservice.acceptrequest(item).then(() => {
      let newalert = this.alertCtrl.create({
        title: 'Friend added',
        subTitle: 'Tap on the friend to chat with him',
        buttons: ['Okay']
      });
      newalert.present();
    })
  }

  // リクエストを無視
  ignore(item) {
    this.requestservice.deleterequest(item).then(() => {
       alert('Request ignored');
    }).catch((err) => {
      alert(err);
    })
  }

}
