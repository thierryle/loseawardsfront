import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { UserDetailPage } from '../user-detail/user-detail';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {
  bundle : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public backend: BackendProvider, public modalCtrl: ModalController,
    public util: UtilProvider) {
  }

  ionViewDidLoad() {
  }
  
  ionViewDidEnter() {
    // Spinner de chargement
    let loading = this.util.loading('Chargement en cours...');
    
    // Appel du backend
    this.backend.getUserBundle().subscribe(
      data => {
        this.bundle = data;
        loading.dismiss();
      },
      error => {
        this.util.handleError(error);
        loading.dismiss();        
      });
  }

  /**
   * Modification d'un utilisateur.
   */
  editUser(user) {
    let modal = this.modalCtrl.create(UserDetailPage, { 'user': user, 'nominations': this.bundle.nominations[user.id] });
    modal.onDidDismiss(updatedUser => {
      if (updatedUser != null) {
        // Fermeture du modal : mise à jour de l'utilisateur dans la base
        this.backend.updateUser(updatedUser).subscribe(
          data => {
            // Mise à jour dans le cache
            this.backend.updateCachedUser(data);
          },
          error => {
            this.util.handleError(error);
          });
        }
      });
    modal.present();
  }
  
  /**
   * Ajout d'un utilisateur.
   */
  addUser() {
    let modal = this.modalCtrl.create(UserDetailPage);
    modal.onDidDismiss(newUser => {
      if (newUser != null) {
        // Fermeture du modal : ajout de l'utilisateur dans la base
        this.backend.addUser(newUser).subscribe(
          data => {
            // Mise à jour dans le cache
            this.backend.addCachedUser(data);
          },
          error => {
            this.util.handleError(error);
          });
      }      
    });
    modal.present();
  }

  /**
   * Suppression d'un utilisateur.
   */
  deleteUser(event, user) {
    event.stopPropagation();
    if (this.backend.getIdentifiedUser() != null && this.backend.getIdentifiedUser().id == user.id) {
      this.util.warning(
        'Suppression du compétiteur',
        'Ce compétiteur est actuellement connecté'
      );
    } else {
      this.util.confirm(
        'Suppression du compétiteur',
        'La suppression du compétiteur entraînera la suppression de ses nominations et de ses votes. Etes-vous sûr de vouloir le supprimer ?',
        this.deleteUserBackend.bind(this),
        user);
    }
  }  
  
  deleteUserBackend(user) {
    // Suppression de l'utilisateur dans la base
    this.backend.deleteUser(user).subscribe(
      () => {
        // Mise à jour dans le cache
        this.backend.deleteCachedUser(user);
      },
      error => {
        this.util.handleError(error);
      });
  }
  
  getNumberOfNominations(user) {
    let nominations = this.bundle.nominations[user.id];
    if (nominations != null) {
      return nominations.length;
    }
    return 0;
  }
}
