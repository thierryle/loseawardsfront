import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatCategoryPage } from './stat-category';

@NgModule({
  declarations: [
    StatCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(StatCategoryPage),
  ],
})
export class StatCategoryPageModule {}
