import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettlePage } from './settle';

@NgModule({
  declarations: [
    SettlePage,
  ],
  imports: [
    IonicPageModule.forChild(SettlePage),
  ],
})
export class SettlePageModule {}
