import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArchiveDetailPage } from './archive-detail';

@NgModule({
  declarations: [
    ArchiveDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ArchiveDetailPage),
  ],
})
export class ArchiveDetailPageModule {}
