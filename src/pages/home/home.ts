import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  bundle: any;
  KEY_SHOW_LASTNAME: string = "SHOW_LASTNAME";
  KEY_NOMINATIONS_OPEN: string = "NOMINATIONS_OPEN";
  KEY_VOTES_OPEN: string = "VOTES_OPEN";
  KEY_VOTERS_IDS: string = "VOTERS_IDS";
  KEY_NEWS: string = "NEWS";
  inputGlobals: any[];
  news: string;
  restoreURL: any;
  
  constructor(public navCtrl: NavController, public backend: BackendProvider, public util: UtilProvider, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    // Spinner de chargement
    let loading = this.util.loading('Chargement en cours...');
    
    this.restoreURL = {
      url: '',
      restoreUsers: false,
      restoreCategoriesAndNominations: false,
      restoreUsersAndCategoriesArchive: false,
      restoreArchives: false
    };    
    
    // Appel du backend
    this.backend.getHomeBundle().subscribe(
      data => {
        this.bundle = data;
        
        // Mise à jour du cache
        this.backend.setCachedUsers(this.bundle.users);
        this.backend.setCachedCategories(this.bundle.categories);
        this.backend.setCachedGlobals(this.bundle.globals);
        this.initGlobals();
        this.news = this.util.getNews();
        loading.dismiss();
      },
      error => {
        this.util.handleError(error);
        loading.dismiss();        
      });
  }
  
  initGlobals() {
    this.inputGlobals = [];
    for (let global of this.backend.getCachedGlobals()) {
      switch(global.key) {        
        case this.KEY_SHOW_LASTNAME:
        case this.KEY_NOMINATIONS_OPEN:
        case this.KEY_VOTES_OPEN:
          this.inputGlobals.push({ key: global.key, value: (global.value != null && global.value.toUpperCase() == 'TRUE'), valuesIds: global.valuesIds });
          break;
        default:
          this.inputGlobals.push({ key: global.key, value: global.value, valuesIds: global.valuesIds });
      } 
    }
  }
  
  getUsersIds() {
    return Object.keys(this.bundle.statistiques);
  }
  
  save() {
    let changedGlobals = [];
    for (let inputGlobal of this.inputGlobals) {
      let global = this.util.getGlobalByKey(inputGlobal.key);
      if (inputGlobal.value != global.value) {
        switch(inputGlobal.key) {        
          case this.KEY_SHOW_LASTNAME:
          case this.KEY_NOMINATIONS_OPEN:
          case this.KEY_VOTES_OPEN:
            global.value = (inputGlobal.value ? 'TRUE' : 'FALSE');
            break;
          default:
            global.value = inputGlobal.value;
        }
        changedGlobals.push(global);
      }
    }
    
    if (changedGlobals.length > 0) {
      this.backend.updateGlobals(changedGlobals).subscribe(
        () => {
          this.util.toast('Sauvegarde effectuée');
        },
        error => {
          this.util.handleError(error);
        });
    }
  }
  
  deleteVotes() {
    this.backend.deleteVotes().subscribe(
      () => {
        this.util.toast('Votes supprimés');
      },
      error => {
        this.util.handleError(error);
      });
  }
  
  reset() {
    let alert = this.alertCtrl.create({
      title: 'Réinitialisation',
      message: 'Cette action va réinitialiser le site. Etes-vous sûr ?',
      buttons: [
        { text: 'Non', role: 'cancel' },
        { text: 'Oui', handler: () => { this.backendReset(); } }
      ]
    });
    alert.present();
  }
  
  clean() {
    this.backend.clean().subscribe(
      () => {
        this.util.toast('Base nettoyée');
      },
      error => {
        this.util.handleError(error);
      });
  }
  
  backendReset() {
    this.backend.reset().subscribe(
      () => {
        this.util.toast('Site réinitialisé');
      },
      error => {
        this.util.handleError(error);
      });
  }
  
  restore() {
    let loading = this.util.loading('Restauration en cours...');
    this.backend.restoreByURL(this.restoreURL).subscribe(
        () => {
          loading.dismiss();
        },
        error => {
          loading.dismiss();
          this.util.handleError(error);
        });
    }
}
