import { Component, trigger, state, style, animate, transition } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';
import { VoteResultPage } from '../vote-result/vote-result';

/**
 * Generated class for the VotePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vote',
  templateUrl: 'vote.html',
  animations: [
    trigger('expand', [
      state('true', style({height: '*'})),
      state('false', style({height: 0})),
      transition('true => false', animate(250)),
      transition('false => true', animate(250))
    ])
  ]
})
export class VotePage {
  bundle: any;
  votesOfUser: any;
  shown: { [key:number]: boolean; } = {};
  votes: any[];
  dirty: boolean;
  loaded: boolean; 

  constructor(public navCtrl: NavController, public navParams: NavParams, public backend: BackendProvider, public util: UtilProvider, events: Events) {
      events.subscribe('vote:identified', () => {
        // L'utilisateur s'est identifié
        this.loadVotes();
      });
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.loaded = false;
    
    if (this.util.votesOpen()) {
      if (this.backend.getIdentifiedUser() == null) {
        // L'utilisateur n'est pas encore identifié : appel de la méthode d'identification puis attente de l'événement signalant l'identification
        this.util.identify('vote');
      } else {
        this.loadVotes();
      }
    } else {
      this.navCtrl.setRoot(VoteResultPage);
    }        
  }
  
  loadVotes() {
    // Spinner de chargement
    let loading = this.util.loading('Chargement en cours...');
    
    // Appel du backend
    this.backend.getNominationBundle().subscribe(
      data => {
        this.bundle = data;
        
        this.backend.getVotesByUser(this.backend.getIdentifiedUser().id).subscribe(
          data2 => {
            this.votesOfUser = data2;
            this.initVotes();
            this.loaded = true;
            loading.dismiss();
          },
          error => {
            loading.dismiss();
            this.util.handleError(error);                
          });
      },
      error => {
        loading.dismiss();
        this.util.handleError(error);                
      });
  }
  
  /**
   * Clic sur l'entête d'une catégorie : on ouvre ou on ferme le bloc.
   */
  toggleCategory(categoryId) {
    if (this.shown[categoryId] == true) {
      this.shown[categoryId] = false;
    } else {
      this.shown[categoryId] = true;
    }
  };
  
  /**
   * Indique si un bloc de catégorie doit être ouvert. 
   */
  isCategoryShown(categoryId) {
    if (this.shown[categoryId] == true) {
      return true;
    }
    return false;
  };
  
  /**
   * Prépare la liste des objets vote avec les votes éventuels de l'utilisateur.
   */
  initVotes() {
    this.votes = [];
    this.dirty = false;
    
    for (let category of this.backend.getCachedCategories()) {
      let nominationsOfOneCategory = this.bundle.nominations[category.id];
      if (nominationsOfOneCategory != null && nominationsOfOneCategory.length > 0) {
        // On ouvre le premier bloc
        if (this.votes.length == 0) {
          this.shown[category.id] = true;
        } else {
          this.shown[category.id] = false;
        }

        let userVoteByCategory = this.getUserVoteByCategory(category.id);
        if (userVoteByCategory != null) {
          this.votes.push(userVoteByCategory);
        } else {
          this.votes.push({
            'categoryId': category.id,
            'voterId': this.backend.getIdentifiedUser().id,
            'nominationId': null,
            'reason': ''
          });
        }        
      }
    }
  }
  
  getUserVoteByCategory(categoryId) {
    if (this.votesOfUser != null) {
      for (let vote of this.votesOfUser) {
        if (vote.categoryId == categoryId) {
          return vote;
        }
      }
    }
    return null;
  }
  
  save() {
    let nonNullVotes = [];
    for (let vote of this.votes) {
      if (vote.nominationId != null) {
        nonNullVotes.push(vote);
      }
    }
    
    this.backend.addVotes(nonNullVotes).subscribe(
      () => {
        this.navCtrl.push(VoteResultPage);
      },
      error => {
        this.util.handleError(error);                
      });
  }
  
  result() {
    if (this.dirty == true) {
      this.util.confirm(
        'Modification des votes',
        'Vous avez effectué des modifications à vos votes. Etes-vous sûr de vouloir abandonner vos modifications ?',
        this.goToVoteResult.bind(this),
        null);
    } else {
      this.goToVoteResult();
    }    
  }
  
  goToVoteResult() {
    this.navCtrl.push(VoteResultPage);
  }
  
  /**
   * Clic sur le bouton "Suivant" : on ferme le bloc courant et on ouvre le suivant.
   */
  next(index) {
    if (index < (this.votes.length - 1)) {
      this.shown[this.votes[index].categoryId] = false;
      this.shown[this.votes[index + 1].categoryId] = true;
    }    
  }
  
  valueChanged() {
    this.dirty = true;
  }
}
