import { Component } from '@angular/core';

import { UserPage } from '../user/user';
import { NominationPage } from '../nomination/nomination';
import { HomePage } from '../home/home';
import { VotePage } from '../vote/vote';
import { ArchivePage } from '../archive/archive';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = UserPage;
  tab3Root = NominationPage;
  tab4Root = VotePage;
  tab5Root = ArchivePage;

  constructor() {

  }
}
