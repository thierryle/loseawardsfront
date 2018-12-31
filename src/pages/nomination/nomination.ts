import { Component, trigger, state, style, animate, transition } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { CategoryDetailPage } from '../category-detail/category-detail';
import { NominationDetailPage } from '../nomination-detail/nomination-detail';
import { CommentDetailPage } from '../comment-detail/comment-detail';
import { ImagePage } from '../image/image';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';

/**
 * Generated class for the NominationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nomination',
  templateUrl: 'nomination.html',
  animations: [
    trigger('expand', [
      state('true', style({height: '*'})),
      state('false', style({height: 0})),
      transition('true => false', animate(250)),
      transition('false => true', animate(250))
    ])
  ]
})
export class NominationPage {
  bundle: any;
  shown: { [key: number]: boolean; } = {}; // Indique quel blocs de catégorie sont ouverts
  commentsByNominations: any; // Commentaires regroupés par ID de nomination
  nominationsMap: { [key: number]: any; } = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public backend: BackendProvider, public modalCtrl: ModalController,
    public util: UtilProvider, events: Events) {
      
    events.subscribe('nomination:identified', callback => {
      // L'utilisateur s'est identifié : on retourne à la création ou l'édition du commentaire
      this.addComment(null, callback['nomination']);
    });
    
    events.subscribe('nomination:email', data => {
      // L'utilisateur a saisi une adresse e-mail : on retourne à l'envoi des nominations par mail
      this.sendNominationsByMail(data);
    });
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    // Spinner de chargement
    let loading = this.util.loading('Chargement en cours...');
    
    // Appel du backend
    this.backend.getNominationBundle().subscribe(
      data => {
        this.bundle = data;
        
        // Création de la map des nominations par ID pour accéder facilement aux nominations
        for (let categoryId of Object.keys(this.bundle.nominations)) {
          for (let nomination of this.bundle.nominations[categoryId]) {
            this.nominationsMap[nomination.id] = nomination;
          }
        }
        
        // Récupération des commentaires
        this.getCommentsByNominations();
        loading.dismiss();
      },
      error => {
        loading.dismiss();
        this.util.handleError(error);                
      });
  }

  /**
   * Clic sur le bouton d'édition d'une catégorie.
   */
  editCategory(event, category) {
    event.stopPropagation();
    let modal = this.modalCtrl.create(CategoryDetailPage, { 'category': category });
    modal.onDidDismiss(updatedCategory => {
      if (updatedCategory != null) {
        // Fermeture du modal : mise à jour de la catégorie dans la base
        this.backend.updateCategory(updatedCategory).subscribe(
          () => {
            // Mise à jour du cache
            this.backend.updateCachedCategory(updatedCategory);
          },
          error => {
            this.util.handleError(error);
          });
      }
    });
    modal.present();
  }
  
  /**
   * Clic sur le bouton d'ajout d'une catégorie.
   */
  addCategory() {
    let modal = this.modalCtrl.create(CategoryDetailPage);
    modal.onDidDismiss(newCategory => {
      if (newCategory != null) {
        // Fermeture du modal : ajout de la catégorie dans la base
        this.backend.addCategory(newCategory).subscribe(
          data => {
            // Mise à jour du cache
            this.backend.addCachedCategory(data);
          },
          error => {
            this.util.handleError(error);
          });
        }      
    });
    modal.present();
  }
  
  /**
   * Clic sur le bouton de suppression d'une catégorie.
   */
  deleteCategory(event, category) {
    event.stopPropagation();
    this.util.confirm(
      'Suppression de la catégorie',
      'La suppression de la catégorie entraînera la suppression des nominations liées. Etes-vous sûr de vouloir la supprimer ?',
      this.deleteCategoryBackend.bind(this),
      category);
  }
  
  deleteCategoryBackend(category) {
    // Suppression de la catégorie dans la base
    this.backend.deleteCategory(category).subscribe(
      () => {
        // Suppression dans le cache
        this.backend.deleteCachedCategory(category);
      },
      error => {
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
   * Ajout d'une nomination.
   */
  addNomination(event, category) {
    if (event != null) {
      event.stopPropagation();
    }
    
    if (this.util.nominationsOpen()) {
      let modal = this.modalCtrl.create(NominationDetailPage, { 'category': category });
      modal.onDidDismiss(newNomination => {
        if (newNomination != null) {
          // Fermeture du modal : ajout de la nomination dans la base
          let loading = this.util.loading('Enregistrement en cours...');
          
          this.backend.addNomination(newNomination).subscribe(
            data => {
              loading.dismiss();
              
              // Ajout de la nomination dans l'IHM
              this.util.mapOfListsAdd(this.bundle.nominations, newNomination.categoryId, data);
              this.nominationsMap[data['id']] = data;
              
              // Ouverture du bloc
              this.shown[newNomination.categoryId] = true;
            },
            error => {
              loading.dismiss();
              this.util.handleError(error);
            });
          }
      });
      modal.present();
    } else {
      this.util.warning('Nominations', 'Les nominations sont actuellement fermées');
    }
  }
  
  /**
   * Suppression d'une nomination.
   */
  deleteNomination(event, nomination) {
    event.stopPropagation();
    
    // Suppression de la nomination dans la base
    this.backend.deleteNomination(nomination).subscribe(
      () => {
        // Mise à jour de l'IHM
        this.util.mapOfListsDelete(this.bundle.nominations, nomination.categoryId, nomination.id);
      },
      error => {
        this.util.handleError(error);
      });
  }
  
  /**
   * Edition d'une nomination.
   */
  editNomination(nomination) {
    let modal = this.modalCtrl.create(NominationDetailPage, { 'nomination': nomination });
    modal.onDidDismiss(updatedNomination => {
      if (updatedNomination != null) {
        // Fermeture du modal : modification de la nomination dans la base
        let loading = this.util.loading('Enregistrement en cours...');
        
        this.backend.updateNomination(updatedNomination).subscribe(
          data => {
            loading.dismiss();

            // Mise à jour dans l'IHM
            this.util.mapOfListsUpdate(this.bundle.nominations, nomination.categoryId, data);
            this.nominationsMap[updatedNomination.id] = data;
          },
          error => {
            loading.dismiss();
            this.util.handleError(error);
          });
        }
      });
    modal.present();
  }
  
  /**
   * Commentaire d'une nomination.
   */
  addComment(event, nomination) {
    if (event != null) {
      event.stopPropagation();
    }    
    
    if (this.backend.getIdentifiedUser() == null) {
      // L'utilisateur n'est pas encore identifié : appel de la méthode d'identification puis attente de l'événement signalant l'identification
      this.util.identify('nomination', { 'nomination' : nomination });
    } else {
      let modal = this.modalCtrl.create(CommentDetailPage, { 'nomination': nomination });
      modal.onDidDismiss(newComment => {
        if (newComment != null) {
          // Fermeture du modal : création du commentaire dans la base
          this.backend.addComment(newComment).subscribe(
            data => {
              // Mise à jour de l'IHM
              this.util.mapOfListsAdd(this.commentsByNominations, nomination.id, data);
            },
            error => {
              this.util.handleError(error);
            });
        }
      });
      modal.present();
    }
  }
  
  /**
   * Récupération des commentaires.
   */
  getCommentsByNominations() {
    this.backend.getCommentsByNominations().subscribe(
      data => {
        this.commentsByNominations = data;
      },
      error => {
        this.util.handleError(error);
      });
  }
  
  /**
   * Récupération des ID des nominations qui ont des commentaires.
   */
  getCommentedNominationsIds() {
    let orderedCommentedNominationsIds = [];
    let commentedNominationsIds = Object.keys(this.commentsByNominations);
    
    for (let category of this.backend.getCachedCategories()) {
      if (this.bundle.nominations[category.id] != null) {
        for (let nomination of this.bundle.nominations[category.id]) {
          if (commentedNominationsIds.indexOf(nomination.id.toString()) != -1) {
            orderedCommentedNominationsIds.push(nomination.id);
          }
        }
      }      
    }
    return orderedCommentedNominationsIds;
  }
  
  getCommentDate(comment) {
    return comment.date.substring(0, 10);
  }
  
  /**
   * Suppression d'un commentaire.
   */
  deleteComment(comment) {
    // Suppression du commentaire dans la base
    this.backend.deleteComment(comment).subscribe(
      () => {
        // Suppression dans l'IHM
        this.util.mapOfListsDelete(this.commentsByNominations, comment.nominationId, comment.id);
      },
      error => {
        this.util.handleError(error);
      });
  }
  
  /**
   * Edition d'un commentaire.
   */
  editComment(comment) {
    let modal = this.modalCtrl.create(CommentDetailPage, { 'comment': comment });
    modal.onDidDismiss(updatedComment => {
      if (updatedComment != null) {
        // Fermeture du modal : mise à jour du commentaire dans la base
        this.backend.updateComment(updatedComment).subscribe(
          data => {
            // Mise à jour de l'IHM
            this.util.mapOfListsUpdate(this.commentsByNominations, comment.nominationId, data);
          },
          error => {
            this.util.handleError(error);
          });
      }
    });
    modal.present();
  }
  
  /**
   * Indique si le commentaire vient de l'utilisateur qui est identifié (pour décaler le commentaire).
   */
  isIdentifiedUserComment(comment) {
    let user = this.backend.getIdentifiedUser();
    if (user == null) {
      return false;
    }
    return (comment.authorId == user.id);
  }
  
  /**
   * Clic sur le bouton images : on va vers l'écran des images
   */
  goToImage() {
    this.navCtrl.push(ImagePage);
  }
  
  /**
   * Clic sur le bouton mail : on appelle la méthode d'envoi des nominations par mail
   */
  sendNominationsByMail(input?) {
    let address = null;
    if (input) {
      // L'utilisateur a saisi une adresse
      address = input;
    } else {
      let user = this.backend.getIdentifiedUser();
      if (user != null && user.email != null && user.email != '') {
        // L'utilisateur est authentifié et possède une adresse e-mail : on utilise cette adresse
        address = user.email;
      }
    }

    if (address == null) {
      // Si l'utilisateur n'a pas saisi d'adresse et n'est pas authentifié, il doit saisir une adresse
      this.util.getEmail('nomination');
    } else {
      // On a une adresse : on envoie
      this.backend.sendNominationsByMail(address).subscribe(
        () => {
          // Message de confirmation
          this.util.toast('Le mail a été envoyé');
        },
        error => {
          this.util.handleError(error);
        });
    }
  }
}
