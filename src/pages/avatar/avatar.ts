import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';

/**
 * Generated class for the AvatarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-avatar',
  templateUrl: 'avatar.html',
})
export class AvatarPage {
  @Input() set userId(userId) {
    for (let current of this.backend.getCachedUsers()) {
      if (current.id == userId) {
        this.user = current;
        break;
      }
    }
  }
  
  @Input() user: any;
  
  @Input() size: string;
  
  //@Output() click = new EventEmitter();

  constructor(public navCtrl: NavController, public navParams: NavParams, public backend: BackendProvider) {
  }

  ionViewDidLoad() {
  }

  getAvatarURL() {
    return this.backend.getAvatarURL(this.user.avatarId);
  }
  
  // getAvatarData() {
  //   return this.backend.getAvatar(this.user.avatarId).subscribe(
  //     data => {
  //     },
  //     error => {
  //     });;
  // }
  
  getFontSize() {
    let val = Math.round(parseFloat(this.size) * 1.22);
    return val;
  }
}
