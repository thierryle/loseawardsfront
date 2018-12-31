import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';

/**
 * Generated class for the ImagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-image',
  templateUrl: 'image.html',
})
export class ImagePage {
  bundle: any;
  nominationsRow: { [key:number]: any } = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public backend: BackendProvider, public util: UtilProvider) {
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    // Spinner de chargement
    let loading = this.util.loading('Chargement en cours...');
    
    // Appel du backend
    this.backend.getImageBundle().subscribe(
      data => {
        this.bundle = data;
        this.setNominationsRow(this.bundle.nominations);
        loading.dismiss();
      },
      error => {
        this.util.handleError(error);
        loading.dismiss();        
      });
  }
  
  setNominationsRow(nominations) {
    this.nominationsRow = {};
    let row = 0;
    for (let i = 0; i < nominations.length; i++) {
      let nominationsOfOneRow = this.nominationsRow[row];
      if (nominationsOfOneRow == null) {
        nominationsOfOneRow = [];
        this.nominationsRow[row] = nominationsOfOneRow;
      }
      nominationsOfOneRow.push(nominations[i]);
      if ((i + 1) % 3 == 0) {
        row++;
      }
    }
  }
  
  getRows() {
    return Object.keys(this.nominationsRow);
  }
}
