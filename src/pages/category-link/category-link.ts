import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';

/**
 * Generated class for the CategoryLinkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category-link',
  templateUrl: 'category-link.html',
})
export class CategoryLinkPage {
  categoriesLinksForm: FormGroup;
  categoriesLinks: any;
  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder, public backend: BackendProvider,
    public util: UtilProvider, public viewCtrl: ViewController) {
      
    this.categoriesLinksForm = formBuilder.group({
      year: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    let loading = this.util.loading('Chargement en cours...');
    
    this.backend.linkCategories().subscribe(
      data => {
        this.categoriesLinks = data;
        loading.dismiss();
      },
      error => {
        this.util.handleError(error);
        loading.dismiss();        
      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  save() {
    this.submitAttempt = true;
    if (this.categoriesLinksForm.valid) {
      this.viewCtrl.dismiss(this.categoriesLinks);
    }
  }
  
  getCategoriesIds() {
    return Object.keys(this.categoriesLinks.links);
  }
}
