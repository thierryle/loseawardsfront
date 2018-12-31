import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the CategoryDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category-detail',
  templateUrl: 'category-detail.html',
})
export class CategoryDetailPage {
  categoryForm: FormGroup;
  category: any;
  submitAttempt: boolean = false;
  title: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public formBuilder: FormBuilder) {
    let param = this.navParams.get('category');
    if (param == null) {
      // Création
      this.category = {
        'name': ''
      }
      this.title = 'Nouvelle cat&eacute;gorie';
    } else {
      // Modification
      this.category = {
        'id' : param.id,
        'name' : param.name
      }
      this.title = 'Modification de la cat&eacute;gorie';
    }
        
    this.categoryForm = formBuilder.group({
      name: [this.category.name, Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryDetailPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  save() {
    this.submitAttempt = true;
    if (this.categoryForm.valid) {
      this.viewCtrl.dismiss(this.category);
    }    
  }
}
