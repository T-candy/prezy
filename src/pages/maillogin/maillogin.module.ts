import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MailloginPage } from './maillogin';

@NgModule({
  declarations: [
    MailloginPage,
  ],
  imports: [
    IonicPageModule.forChild(MailloginPage),
  ],
})
export class MailloginPageModule {}
