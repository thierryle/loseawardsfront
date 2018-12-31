import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';

/**
 * Generated class for the SettlePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settle',
  templateUrl: 'settle.html',
})
export class SettlePage {
  categories: any;
  winnersByCategory: any;
  decisionsByCategory: any;
  decisions: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public backend: BackendProvider,
    public util: UtilProvider) {
    this.categories = this.navParams.get('categories');
    this.winnersByCategory = this.navParams.get('winnersByCategory');
    this.decisionsByCategory = this.navParams.get('decisionsByCategory');
    
    this.decisions = [];
    for (let categoryId of this.categories) {
      this.decisions.push({
        'categoryId': categoryId,
        'nominatedId': this.decisionsByCategory[categoryId]
      });
    }
  }

  ionViewDidLoad() {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  save() {
    this.viewCtrl.dismiss(this.decisions);
  }
}
