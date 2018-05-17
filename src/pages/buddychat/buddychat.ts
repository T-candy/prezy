import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { UserProvider } from '../../providers/user/user';
import firebase from 'firebase';

/**
 * Generated class for the BuddychatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-buddychat',
  templateUrl: 'buddychat.html',
})
export class BuddychatPage {
  @ViewChild('content') content: Content;
  buddy: any;
  newmessage;
  allmessages = [];

  provider: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public chatservice: ChatProvider,
    public userservice: UserProvider,
    public events: Events, public zone: NgZone) {
      this.userservice.getuserdetails().then((res: any) => {
        this.provider = res;
      })

    this.buddy = this.chatservice.buddy;
    // this.provider = this.userservice.provider;
    this.scrollto();
    this.events.subscribe('newmessage', () => {
      this.allmessages = [];
      this.zone.run(() => {
        this.allmessages = this.chatservice.buddymessages;
      })
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuddychatPage');
    console.log(this.provider);
    console.log(this.buddy);
  }

  addmessage() {
    console.log(this.buddy.uid);
    console.log(this.allmessages);

    this.chatservice.addnewmessage(this.newmessage).then(() => {
      this.content.scrollToBottom();
      this.newmessage = '';
    })
  }

  ionViewDidEnter() {
    this.chatservice.getbuddymessages();
  }

  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

}
