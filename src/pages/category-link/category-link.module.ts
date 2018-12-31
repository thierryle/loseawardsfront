import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryLinkPage } from './category-link';

@NgModule({
  declarations: [
    CategoryLinkPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoryLinkPage),
  ],
})
export class CategoryLinkPageModule {}
