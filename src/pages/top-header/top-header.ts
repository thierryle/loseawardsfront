import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';

/**
 * Generated class for the TopHeaderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-top-header',
  templateUrl: 'top-header.html',
})
export class TopHeaderPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public backend: BackendProvider,
    public util: UtilProvider) {
  }
  
  @Input() subtitle: string;

  ionViewDidLoad() {
  }
  
  getIdentifiedUser() {
    let identifiedUser = this.backend.getIdentifiedUser();
    if (identifiedUser != null) {
      return identifiedUser.firstName + ' ' + identifiedUser.lastName;
    }
    return '';
  }
  
  identify() {
    this.util.identify();
  }
  
  getPosition(i) {
    let position = i * -10;
    return position.toString();
  }
  
  getPaddingLeft() {
    /*
    let padding = (this.backend.getCachedUsers().length - 1) * 10;
    return padding.toString();
    */
    return "0";
  }
}
