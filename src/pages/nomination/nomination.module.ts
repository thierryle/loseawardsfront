import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NominationPage } from './nomination';

@NgModule({
  declarations: [
    NominationPage,
  ],
  imports: [
    IonicPageModule.forChild(NominationPage),
  ],
})
export class NominationPageModule {}
