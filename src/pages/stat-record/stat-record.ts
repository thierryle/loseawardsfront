import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';

/**
 * Generated class for the StatRecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stat-record',
  templateUrl: 'stat-record.html',
})
export class StatRecordPage {
  recordsByCategory: any;
  users: any;
  categories: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public backend: BackendProvider,
    public util: UtilProvider) {
    this.categories = this.navParams.get('categories');
    this.users = this.navParams.get('users');

    // Spinner de chargement
    let loading = this.util.loading('Chargement en cours...');

    this.backend.getStatRecords().subscribe(
      data => {
        this.recordsByCategory = data['usersAndRecords'];
        loading.dismiss();
      },
      error => {
        this.util.handleError(error);
        loading.dismiss();
      });
  }

  ionViewDidLoad() {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getCategoriesIds() {
    return Object.keys(this.recordsByCategory);
  }

  getUsersNames(categoryId) {
    let usersIds = [];
    let usersAndRecords = this.recordsByCategory[categoryId];
    for (let userAndRecord of usersAndRecords) {
      usersIds.push(userAndRecord.userId);
    }
    return this.util.getUsersNamesFromList(usersIds, this.users);
  }
}
