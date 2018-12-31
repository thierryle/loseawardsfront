import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatUserPage } from './stat-user';

@NgModule({
  declarations: [
    StatUserPage,
  ],
  imports: [
    IonicPageModule.forChild(StatUserPage),
  ],
})
export class StatUserPageModule {}
