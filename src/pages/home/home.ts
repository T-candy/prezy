import { Component,ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ModalController, NavController, ToastController, NavParams, Events } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { ChatmainPage } from '../chatmain/chatmain';
import { ChatindPage } from '../chatind/chatind';
import { MatchPage } from '../match/match';
import { LoginPage } from '../login/login';

import {StackConfig, Stack, Card, ThrowEvent, DragEvent,
  SwingStackComponent, SwingCardComponent} from 'angular2-swing';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { empty } from 'rxjs/observable/empty';
import { isEmpty } from 'rxjs/operator/isEmpty';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { UserProvider } from '../../providers/user/user';
import { RequestsProvider } from '../../providers/requests/requests';
import { ChatProvider } from '../../providers/chat/chat';
import { connreq } from '../../models/interfaces/request';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('myswing1') swingStack: SwingStackComponent;
  @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

  cards: Array<any>;
  stackConfig: StackConfig;
  recentCard: string = '';

  firedata = firebase.database().ref('/users');
  firereq = firebase.database().ref('/requests');
  firefriends = firebase.database().ref('/friends');
  filteredusers = [];
  newrequest = {} as connreq;
  myrequests;
  myfriends;
  myrequestsender;

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
    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userservice: UserProvider,
    public requestservice: RequestsProvider,
    public chatservice: ChatProvider,
    public events: Events,
    private http: Http) {
    this.stackConfig = {
      // スワイプの方向とかもろもろ
      throwOutConfidence: (offsetX, offsetY, element) => {
        return Math.min(Math.abs(offsetX) / (element.offsetWidth/2), 1);
      },
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
      },
      throwOutDistance: (d) => {
        return 300;
      }
    };
    this.userservice.getallusers().then((res: any) => {
      this.filteredusers = res;
    })
 }

 ionViewDidLoad() {
   this.toastmessage();
   console.log('ionViewDidLoad HomePage');
   this.loadCards();
   console.log(this.cards);
 }

  ionViewWillEnter() {
    this.loaduserdetails();
    this.loadrequestdetails();

    this.requestservice.getmyfriends();
    this.events.subscribe('friends', () => {
      this.myfriends = [];
      this.myfriends = this.requestservice.myfriends;
    })
    this.loggedin = this.navParams.get("loggedin");
    console.log(this.loggedin);
  }

  ionViewWillLeave(){
    console.log(this.myfriends);
    console.log(this.myrequests);
    console.log(this.myrequestsender);
    console.log(this.filteredusers);
  }

  ionViewDidLeave() {
    this.events.unsubscribe('gotrequests');
    this.events.unsubscribe('friends');
  }

  loaduserdetails() {
    this.userservice.getuserdetails().then((res: any) => {
      this.provider = res;
    })
  }

  loadrequestdetails() {
    this.requestservice.getmyrequestsender();
    this.events.subscribe('gotrequestsender', () => {
      this.myrequestsender = [];
      this.myrequestsender = this.requestservice.myrequestsender;
    })
    this.requestservice.getmyrequests();
    this.events.subscribe('gotrequests', () => {
      this.myrequests = [];
      this.myrequests = this.requestservice.userdetails;
    })
  }

  userdetail() {
    this.loggedin = false;
    this.navCtrl.push(ProfilePage, {
      recipient: this.cards[0],
      loggedin: this.loggedin
    });
  }

  toastmessage() {
    this.afAuth.authState.subscribe(data => {
      if(data.email && data.uid) {
        this.toastCtrl.create({
          message: 'ログインしました！',
          duration: 3000
        }).present();
      }
      else {
        this.toastCtrl.create({
          message: '失敗しました',
          duration: 3000
        }).present();
      }
    })
  }

  loadCards() {
    // ngAfterViewInit() {
    // Either subscribe in controller or set in HTML
    this.swingStack.throwin.subscribe((event: DragEvent) => {
      event.target.style.background = '#ffffff';
    });
    // this.cards = [{ email: '' }];
    this.cards = [];
    this.addNewCards(1);
  }

  // Called whenever we drag an element
  onItemMove(element, x, y, r) {
    let color = '';
    const abs = Math.abs(x);
    const min = Math.trunc(Math.min(16 * 16 - abs, 16 * 16));
    const hexCode = this.decimalToHex(min, 2);

    if (x > 0) {
      color = '#' + hexCode + 'FF' + hexCode;
    } else {
      color = '#FF' + hexCode + hexCode;
    }
    element.style.background = color;
    element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
  }

  // Connected through HTML
  voteUp(like: boolean) {
    this.loadrequestdetails();
    let removedCard = this.cards.pop();
    this.addNewCards(1);
    if (like) {
      // this.toastCtrl.create('You liked: ' + removedCard.email);
      this.write(removedCard);
      console.log('You liked: ' + removedCard.name+' '+removedCard.email);
    } else {
      // this.toastCtrl.create('You disliked: ' + removedCard.email);
      this.left(removedCard);
      console.log('You disliked: ' + removedCard.name+' '+removedCard.email);
    }
  }

 // データベースに保存されている自分と友達以外のユーザーをrandom表示
 addNewCards(count: number) {
  this.firefriends.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
   var friendsuid = [];
   let allfriends = snapshot.val();
   for (var i in allfriends) {
     friendsuid.push(allfriends[i].uid);
   }
   var ids = [];
   for (var key in this.filteredusers) {
     if (friendsuid.indexOf(key) === -1) {
       ids.push(this.filteredusers[key]);
     }
   }
   var id = ids[Math.floor(Math.random() * ids.length)];
   this.cards.push(id);
 })
}

  // http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript
  decimalToHex(d, padding) {
    let hex = Number(d).toString(16);
    const numPadding = typeof (padding) === 'undefined' || padding === null ? 2 : padding;

    while (hex.length < numPadding) {
      hex = '0' + hex;
    }
    return hex;
  }

  // 右スワイプのロジック
    write(recipient) {
    console.log("スワイプしたユーザーは↓");
    console.log(recipient);
     this.newrequest.sender = firebase.auth().currentUser.uid;
     this.newrequest.recipient = recipient.uid;
       if (this.myrequestsender.indexOf(recipient.uid) !== -1) {
         console.log(this.newrequest.recipient + 'を許可する');
         this.requestservice.acceptrequest(recipient).then(() => {
           this.navCtrl.setRoot(MatchPage, recipient);
         })
         this.chatservice.initializebuddy(recipient);
       } //リクエストもらっている
       // else if () {} //既に送信済み
       else {
       console.log(this.newrequest.recipient + "へリクエスト送る");
       this.requestservice.sendrequest(this.newrequest).then((res: any) => {
         if (res.success) {
           let sentuser = this.filteredusers.indexOf(recipient);
           this.filteredusers.splice(sentuser, 1);
         }
       }).catch((err) => {
         console.log(recipient);
         console.log(err);
       })
     }
   }

   left(recipient) {
     console.log("左にやった");
     console.log(this.myrequestsender.indexOf(recipient.uid));
     if (this.myrequestsender.indexOf(recipient.uid) !== -1) {
       this.requestservice.deleterequest(recipient).then(() => {
         console.log(recipient.uid + 'のリクエストを拒否しました');
       }).catch((err) => {
         alert(err);
       })
     } //リクエストもらっている
     else {
     console.log("見送り");
   }
   }

  prof(){
    // this.provider.loggedin = true;
    this.navCtrl.push(ProfilePage, {loggedin: this.loggedin});
  }
  chatm(){
    // this.provider.loggedin = true;
    this.navCtrl.push(ChatmainPage, {loggedin: this.loggedin})
  }
  chatid(){
    this.navCtrl.push(ChatindPage)
  }
}
