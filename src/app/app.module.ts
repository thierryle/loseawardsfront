import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { NominationPage } from '../pages/nomination/nomination';
import { NominationDetailPage } from '../pages/nomination-detail/nomination-detail';
import { UserPage } from '../pages/user/user';
import { UserDetailPage } from '../pages/user-detail/user-detail';
import { CategoryDetailPage } from '../pages/category-detail/category-detail';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { TopHeaderPage } from '../pages/top-header/top-header';
import { CommentDetailPage } from '../pages/comment-detail/comment-detail';
import { AvatarPage } from '../pages/avatar/avatar';
import { ImagePage } from '../pages/image/image';
import { VotePage } from '../pages/vote/vote';
import { VoteResultPage } from '../pages/vote-result/vote-result';
import { SettlePage } from '../pages/settle/settle';
import { ArchivePage } from '../pages/archive/archive';
import { ArchiveDetailPage } from '../pages/archive-detail/archive-detail';
import { StatCategoryPage } from '../pages/stat-category/stat-category';
import { StatUserPage } from '../pages/stat-user/stat-user';
import { StatRecordPage } from '../pages/stat-record/stat-record';
import { CategoryLinkPage } from '../pages/category-link/category-link';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BackendProvider } from '../providers/backend/backend';
import { UtilProvider } from '../providers/util/util';

import { SplitPaneModule } from 'ng2-split-pane/lib/ng2-split-pane';

import { DatePipe } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { DragulaModule } from 'ng2-dragula';

import { ChartModule } from 'angular-highcharts';

@NgModule({
  declarations: [
    MyApp,
    NominationPage,
    NominationDetailPage,
    CategoryDetailPage,
    UserPage,
    UserDetailPage,
    HomePage,
    TabsPage,
    TopHeaderPage,
    AvatarPage,
    CommentDetailPage,
    ImagePage,
    VotePage,
    VoteResultPage,
    SettlePage,
    ArchivePage,
    ArchiveDetailPage,
    StatCategoryPage,
    StatUserPage,
    StatRecordPage,
    CategoryLinkPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    SplitPaneModule,
    MatRadioModule,
    DragulaModule,
    ChartModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NominationPage,
    NominationDetailPage,
    CategoryDetailPage,
    UserPage,
    UserDetailPage,
    HomePage,
    TabsPage,
    TopHeaderPage,
    AvatarPage,
    CommentDetailPage,
    ImagePage,
    VotePage,
    VoteResultPage,
    SettlePage,
    ArchivePage,
    ArchiveDetailPage,
    StatCategoryPage,
    StatUserPage,
    StatRecordPage,
    CategoryLinkPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BackendProvider,
    HttpClientModule,
    UtilProvider,
    DatePipe
  ]
})
export class AppModule {}
