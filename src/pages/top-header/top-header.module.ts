import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TopHeaderPage } from './top-header';

@NgModule({
  declarations: [
    TopHeaderPage,
  ],
  imports: [
    IonicPageModule.forChild(TopHeaderPage),
  ],
})
export class TopHeaderPageModule {}
