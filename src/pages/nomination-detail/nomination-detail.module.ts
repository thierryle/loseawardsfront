import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NominationDetailPage } from './nomination-detail';

@NgModule({
  declarations: [
    NominationDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(NominationDetailPage),
  ],
})
export class NominationDetailPageModule {}
