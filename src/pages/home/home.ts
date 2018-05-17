import { Component,ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
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

  temparr = [];
  filteredusers = [];
  newrequest = {} as connreq;
  myrequests;
  myfriends;

  provider = {
    loggedin: false,
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
      this.temparr = res;
   })
  }

  ionViewWillEnter() {
    this.loaduserdetails();

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

  loaduserdetails() {
    this.userservice.getuserdetails().then((res: any) => {
      this.provider.name = res.name;
      this.provider.email = res.email;
      this.provider.photoURL = res.photoURL;
      this.provider.intro = res.intro;
      this.provider.affiliation = res.affiliation;
      this.provider.skill = res.skill;
      this.provider.school.name = res.school.name;
      this.provider.school.department = res.school.department;
      this.provider.school.graduation = res.school.graduation;
      this.provider.company.name = res.company.name;
      this.provider.company.position = res.company.position;
      this.provider.company.category = res.company.category;
    })
  }

  ionViewDidLeave() {
    this.events.unsubscribe('gotrequests');
    this.events.unsubscribe('friends');
  }

  ngAfterViewInit() {
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
    let removedCard = this.cards.pop();
    this.addNewCards(1);
    if (like) {
      // this.toastCtrl.create('You liked: ' + removedCard.email);
      this.sendreq(this.cards);
      console.log('You liked: ' + removedCard.name+' '+removedCard.email);
    } else {
      // this.toastCtrl.create('You disliked: ' + removedCard.email);
      console.log('You disliked: ' + removedCard.name+' '+removedCard.email);
    }
  }

  // Add new cards to our array
//   addNewCards(count: number) {
//   this.http.get('https://randomuser.me/api/?results=' + count)
// .map(data => data.json().results).subscribe(result => {
//   for (let val of result) {
//     this.cards.push(val);
//   }
// })
// }

// データベースに保存されている自分以外のユーザーをrandom表示
addNewCards(count: number) {
  this.firedata.on('value', (snapshot) => {
    var ids = [];
    let userdata = snapshot.val();
    for (var key in userdata) {
      if (key != firebase.auth().currentUser.uid)
      ids.push(userdata[key]);
    }
    var id = ids[Math.floor(Math.random()*ids.length)];
    console.log(id);
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

  // リクエストを送る
    sendreq(recipient) {
     this.newrequest.sender = firebase.auth().currentUser.uid;
     this.newrequest.recipient = recipient.uid;
     if (this.newrequest.sender === this.newrequest.recipient) //自分のとき
       alert('永遠の友人とは、己のこと。');
       else if (this.newrequest.recipient === this.myrequests.uid) {
         console.log('許可する');
       } //リクエストもらっている
       // else if () {} //既に送信済み
       else {
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

  prof(){
    // this.provider.loggedin = true;
    this.navCtrl.push(ProfilePage,  this.provider);
  }
  chatm(){
    // this.provider.loggedin = true;
    this.navCtrl.push(ChatmainPage, this.provider)
  }
  chatid(){
    this.navCtrl.push(ChatindPage)
  }
}
