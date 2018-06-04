import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ChatmainPage } from '../chatmain/chatmain';
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  loggedin = {loggedin: this.navParams.get("loggedin")};
  employer = {loggedin: this.navParams.get("employer")};

  tab1Root = ProfilePage;
  tab2Root = HomePage;
  tab3Root = ChatmainPage;

  constructor(public navParams: NavParams) {
  }
}
