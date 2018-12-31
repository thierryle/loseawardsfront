import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';

/**
 * Generated class for the UserDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-detail',
  templateUrl: 'user-detail.html',
})
export class UserDetailPage {
  userForm: FormGroup;
  user: any;
  nominations: any;
  submitAttempt: boolean = false;
  newImage = null;
  title: string;
  
  @ViewChild('fileInput')
  fileInput: ElementRef;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public formBuilder: FormBuilder,
    public util: UtilProvider, public backend: BackendProvider) {
    let param = this.navParams.get('user');
    if (param == null) {
      // Création
      this.user = {
        'firstName': '',
        'lastName': '',
        'email': '',
        'avatarId': null
      }
      this.title = 'Nouveau comp&eacute;titeur';
    } else {
      // Modification
      this.user = {
        'id' : param.id,
        'firstName': param.firstName,
        'lastName': param.lastName,
        'email': param.email,
        'avatarId' : param.avatarId
      }
      this.title = 'Modification du comp&eacute;titeur';
      
      if (this.navParams.get('nominations') != null) {
        this.nominations = this.orderNominations(this.navParams.get('nominations'));
      }      
    }
        
    this.userForm = formBuilder.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName],
      email: [this.user.email],
      avatar: null
    });
  }

  ionViewDidLoad() {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  save() {
    this.submitAttempt = true;
    if (this.userForm.valid) {
      this.viewCtrl.dismiss(this.user);
    }    
  }
  
  /**
   * Sélection de l'avatar.
   */
  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];

      reader.readAsDataURL(file);
      reader.onload = () => {
        this.newImage = reader.result;
        
        let image = reader.result.split(',')[1];
        /*
        this.userForm.get('avatar').setValue({
          filename: file.name,
          filetype: file.type,
          value: image
        });
        */
        this.user['avatar'] = image;
      };
    }
  }
  
  /**
   * Suppression de l'avatar.
   */
  deleteAvatar() {
    this.user.avatarId = null;
    this.newImage = null;
    this.clearFile();
  }
  
  clearFile() {
    //this.userForm.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
  }
  
  goToStats() {
    this.viewCtrl.dismiss({ 'stats' : true });
  }
  
  orderNominations(nominations) {
    let orderedNominations = [];
    for (let category of this.backend.getCachedCategories()) {
      for (let nomination of nominations) {
        if (nomination.categoryId == category.id) {
          orderedNominations.push(nomination);
        }
      }
    }
    return orderedNominations;
  }  
}
