import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';
import { SettlePage } from '../settle/settle';
import { CategoryLinkPage } from '../category-link/category-link';

/**
 * Generated class for the VoteResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vote-result',
  templateUrl: 'vote-result.html',
})
export class VoteResultPage {
  result: any;
  categoriesToSettle: any[];
  categoriesNotSettled: any[];
  loaded: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public backend: BackendProvider, public util: UtilProvider,
    public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.loaded = false;
    this.loadVoteResult();
  }
  
  loadVoteResult() {
    // Spinner de chargement    
    let loading = this.util.loading('Chargement en cours...');
    
    // Appel du backend
    this.backend.getVoteResult().subscribe(
      data => {
        this.result = data;
        if (this.result != null) {
          // Recherche des catégories à départager (plus d'un vainqueur)
          this.categoriesToSettle = [];
          this.categoriesNotSettled = [];
          for (let category of this.backend.getCachedCategories()) {
            if (this.result.winnersByCategory[category.id] != null && this.result.winnersByCategory[category.id].length > 1) {
              this.categoriesToSettle.push(category.id);
              
              // S'il n'y a pas eu de décision, il faut l'afficher
              if (this.result.decisionsByCategory[category.id] == null) {
                this.categoriesNotSettled.push(category.id);
              }
            }
          }
        }
        
        this.loaded = true;
        loading.dismiss();
      },
      error => {
        loading.dismiss();
        this.util.handleError(error);                
      });
  }
  
  /**
   * Ouvre la popup de départage des ex aequo.
   */
  settle() {
    let modal = this.modalCtrl.create(SettlePage, { 'categories': this.categoriesToSettle, 'winnersByCategory': this.result.winnersByCategory, 'decisionsByCategory': this.result.decisionsByCategory });
    modal.onDidDismiss(decisions => {
      if (decisions != null) {
        // Fermeture du modal : mise à jour de l'utilisateur dans la base
        this.backend.addDecisions(decisions).subscribe(
          () => {
            // Mise à jour de l'IHM
            this.loadVoteResult();           
          },
          error => {
            this.util.handleError(error);
          });
        }
      });
    modal.present();
  }
  
  getRankingKeys() {
    return Object.keys(this.result.ranking);
  }
  
  archive() {
    let modal = this.modalCtrl.create(CategoryLinkPage);
    modal.onDidDismiss(categoriesLinks => {
      // Fermeture du modal des liens entre les catégories : on crée l'archive 
      this.backend.createArchiveFromVoteResult(categoriesLinks).subscribe(
        () => {
          this.util.toast("Archive créée");
        },
        error => {
          this.util.handleError(error);
        });
    });
    modal.present();
  }
}
