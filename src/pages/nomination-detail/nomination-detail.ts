import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';

/**
 * Generated class for the NominationDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nomination-detail',
  templateUrl: 'nomination-detail.html',
})
export class NominationDetailPage {
  nominationForm: FormGroup;
  nomination: any;
  submitAttempt: boolean = false;
  users: any;
  title: string;
  newImage = null;
  
  @ViewChild('fileInput')
  fileInput: ElementRef;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public formBuilder: FormBuilder,
    public backend: BackendProvider, public util: UtilProvider) {
      
    let paramNomination = this.navParams.get('nomination');
    if (paramNomination == null) {
      // Création
      let paramCategory = this.navParams.get('category');
      this.nomination = {
        'reason': '',
        'categoryId': paramCategory.id,
        'imageId': null
      }
      this.title = 'Nouvelle nomination (' + paramCategory.name + ')';
    } else {
      // Modification
      this.nomination = {
        'id' : paramNomination.id,
        'reason': paramNomination.reason,
        'usersIds': paramNomination.usersIds,
        'categoryId': paramNomination.categoryId,
        'imageId': paramNomination.imageId
      }
      this.title = 'Modification de la nomination';
    }
        
    this.nominationForm = formBuilder.group({
      reason: [this.nomination.reason, Validators.required],
      usersIds: [this.nomination.usersIds, Validators.required],
      image: null
    });
    
    this.users = backend.getCachedUsers();
  }

  ionViewDidLoad() {
  }

  /**
   * Clic sur le bouton de fermeture.
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  /**
   * Clic sur le bouton de validation.
   */
  save() {
    this.submitAttempt = true;
    if (this.nominationForm.valid) {
      this.viewCtrl.dismiss(this.nomination);
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
        if (file.size > (1024 * 1024)) {
          console.log('Image trop volumineuse');
          this.util.warning('Fichier trop volumineux', 'La taille du fichier doit &ecirc;tre inférieure à 1 Mo');
        } else {
          this.newImage = reader.result;
        
          let image = reader.result.split(',')[1];
          /*
          this.nominationForm.get('image').setValue({
            filename: file.name,
            filetype: file.type,
            value: image
          });
          */
          this.nomination['image'] = image;
        }        
      };
    }
  }
  
  getNominationImageURL() {
    return this.backend.getNominationImageURL(this.nomination.imageId);
  }
  
  /**
   * Suppression de l'image.
   */
  deleteImage() {
    this.nomination.imageId = null;
    this.nomination['image'] = null;
    this.newImage = null;    
    this.clearFile();
  }
  
  clearFile() {
    //this.nominationForm.get('image').setValue(null);
    this.fileInput.nativeElement.value = '';
  }
}
