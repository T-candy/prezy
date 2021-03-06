import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { config } from './app.firebaseconfig';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { Facebook } from '@ionic-native/facebook';

import { MyApp } from './app.component';

import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { SwingModule } from 'angular2-swing';

import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { MatchPage } from '../pages/match/match';
import { ChatmainPage } from '../pages/chatmain/chatmain';
import { ChatindPage } from '../pages/chatind/chatind';
import { PhotoPage } from '../pages/photo/photo';
import { LoginPage } from '../pages/login/login';
import { MailloginPage } from '../pages/maillogin/maillogin';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';

import { UserProvider } from '../providers/user/user';
import { ImghandlerProvider } from '../providers/imghandler/imghandler';
import { RequestsProvider } from '../providers/requests/requests';
import { ChatProvider } from '../providers/chat/chat';
import { AuthProvider } from '../providers/auth/auth';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    ProfilePage,
    MatchPage,
    ChatmainPage,
    ChatindPage,
    PhotoPage,
    LoginPage,
    MailloginPage,
    AboutPage,
    ContactPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages:true,
    }),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpModule,
    HttpClientModule,
    SwingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    ProfilePage,
    MatchPage,
    ChatmainPage,
    ChatindPage,
    PhotoPage,
    LoginPage,
    MailloginPage,
    AboutPage,
    ContactPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireAuth,
    AngularFireDatabase,
    AuthProvider,
    Facebook,
    UserProvider,
    ImghandlerProvider,
    File,
    FileChooser,
    FilePath,
    Camera,
    RequestsProvider,
    ChatProvider
  ]
})
export class AppModule {}
