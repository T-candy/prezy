import { Component,ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { ChatmainPage } from '../chatmain/chatmain';
import { ChatindPage } from '../chatind/chatind';
// import { PhotoPage } from '../photo/photo';
import { LoginPage } from '../login/login';

import {
  StackConfig,
  Stack,
  Card,
  ThrowEvent,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent} from 'angular2-swing';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { empty } from 'rxjs/observable/empty';
import { isEmpty } from 'rxjs/operator/isEmpty';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

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

  constructor(
    public navCtrl: NavController,
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
      console.log('You liked: ' + removedCard.name.first+' '+removedCard.name.last);
    } else {
      // this.toastCtrl.create('You disliked: ' + removedCard.email);
      console.log('You disliked: ' + removedCard.name.first+' '+removedCard.name.last);
    }
  }

  // Add new cards to our array
  addNewCards(count: number) {
  this.http.get('https://randomuser.me/api/?results=' + count)
.map(data => data.json().results)
.subscribe(result => {
  for (let val of result) {
    this.cards.push(val);
  }
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

  prof(){
    {
      this.navCtrl.push(ProfilePage);
      }
  }
  chatm(){
    this.navCtrl.push(ChatmainPage)
  }
  chatid(){
    this.navCtrl.push(ChatindPage)
  }
  lgn(){
    this.navCtrl.push(LoginPage)
  }
}
