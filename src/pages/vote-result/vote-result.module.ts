import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VoteResultPage } from './vote-result';

@NgModule({
  declarations: [
    VoteResultPage,
  ],
  imports: [
    IonicPageModule.forChild(VoteResultPage),
  ],
})
export class VoteResultPageModule {}
