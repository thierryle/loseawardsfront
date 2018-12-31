import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatRecordPage } from './stat-record';

@NgModule({
  declarations: [
    StatRecordPage,
  ],
  imports: [
    IonicPageModule.forChild(StatRecordPage),
  ],
})
export class StatRecordPageModule {}
