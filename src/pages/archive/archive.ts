import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';
import { ArchiveDetailPage } from '../archive-detail/archive-detail';
import { StatCategoryPage } from '../stat-category/stat-category';
import { StatUserPage } from '../stat-user/stat-user';
import { StatRecordPage } from '../stat-record/stat-record';
//import { DragulaService } from 'ng2-dragula/ng2-dragula';

/**
 * Generated class for the ArchivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-archive',
  templateUrl: 'archive.html',
})
export class ArchivePage {
  bundle: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public backend: BackendProvider, public util: UtilProvider,
    public alertCtrl: AlertController, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.loadArchive();
  }
  
  loadArchive() {
    // Spinner de chargement
    let loading = this.util.loading('Chargement en cours...');
    
    // Appel du backend
    this.backend.getArchiveBundle().subscribe(
      data => {
        this.bundle = data;
        loading.dismiss();
      },
      error => {
        this.util.handleError(error);
        loading.dismiss();        
      });
  }
  
  // ===== Catégories =====
  
  addCategory() {
    let alert = this.alertCtrl.create({
      title: 'Nouvelle catégorie',
      inputs: [
        { name: 'name', placeholder: 'Nom de la catégorie' }
      ],
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        { text: 'OK', handler: data => { return this.addCategoryBackend(data); } }
      ]
    });
    alert.present();
  }
  
  addCategoryBackend(data) {
    if (data['name'] == null || data['name'] == '') {
      return false;
    }
            
    let category = { id: null, name: data['name'] };
    this.backend.addArchiveCategory(category).subscribe(
      data => {
        // Mise à jour de l'IHM
        this.bundle.archiveCategories.push(data);
      },
      error => {
        this.util.handleError(error);
      });
  }
  
  editCategory(category) {
    let alert = this.alertCtrl.create({
      title: 'Modification de la catégorie',
      inputs: [
        { name: 'name', placeholder: 'Nom de la catégorie', value: category.name }
      ],
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        { text: 'OK', handler: data => { return this.updateCategoryBackend(category, data); } }
      ]
    });
    alert.present();
  }
  
  updateCategoryBackend(category, data) {
    if (data['name'] == null || data['name'] == '') {
      return false;
    }
    category.name = data['name'];
    this.backend.updateArchiveCategory(category).subscribe(
      () => {
        // Mise à jour de l'IHM
        for (let i = 0; i < this.bundle.archiveCategories.length; i++) {
          if (this.bundle.archiveCategories[i].id == category.id) {
            this.bundle.archiveCategories[i] = category;
            break;
          }
        }
      },
      error => {
        this.util.handleError(error);
      });
  }
  
  deleteCategory(event, category) {
    event.stopPropagation();
    this.util.confirm(
      'Suppression de la catégorie',
      'La suppression de la catégorie entraînera la suppression des archives liées. Etes-vous sûr de vouloir la supprimer ?',
      this.deleteCategoryBackend.bind(this),
      category);    
  }
  
  deleteCategoryBackend(category) {
    this.backend.deleteArchiveCategory(category).subscribe(
      () => {
        // Mise à jour de l'IHM
        this.loadArchive();
      },
      error => {
        this.util.handleError(error);
      });
  }
  
  // ===== Utilisateurs =====
  
  addUser() {
    let alert = this.alertCtrl.create({
      title: 'Nouveau user',
      inputs: [
        { name: 'firstName', placeholder: 'Prénom' },
        { name: 'lastName', placeholder: 'Nom' },
        { name: 'firstYear', placeholder: 'Première participation' },
        { name: 'lastYear', placeholder: 'Dernière participation' }
      ],
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        { text: 'OK', handler: data => { return this.addUserBackend(data); } }
      ]
    });
    alert.present();
  }
  
  addUserBackend(data) {
    if (!this.checkUserData(data)) {
      return false;
    }
    let user = { id: null, firstName: data['firstName'], lastName: data['lastName'], firstYear: data['firstYear'], lastYear: data['lastYear'] };
    this.backend.addArchiveUser(user).subscribe(
      data => {
        this.bundle.archiveUsers.push(data);
      },
      error => {
        this.util.handleError(error);
      });
  }
  
  editUser(user) {
    let alert = this.alertCtrl.create({
      title: 'Modification du compétiteur',
      inputs: [
        { name: 'firstName', placeholder: 'Prénom du compétiteur', value: user.firstName },
        { name: 'lastName', placeholder: 'Nom du compétiteur', value: user.lastName },
        { name: 'firstYear', placeholder: 'Première participation', value: user.firstYear },
        { name: 'lastYear', placeholder: 'Dernière participation', value: user.lastYear }
      ],
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        { text: 'OK', handler: data => { return this.updateUserBackend(user, data); } }
      ]
    });
    alert.present();
  }
  
  updateUserBackend(user, data) {
    if (!this.checkUserData(data)) {
      return false;
    }
    user.firstName = data['firstName'];
    user.lastName = data['lastName'];
    user.firstYear = data['firstYear'];
    user.lastYear = data['lastYear']
    this.backend.updateArchiveUser(user).subscribe(
      data => {
        // Mise à jour de l'IHM
        for (let i = 0; i < this.bundle.archiveUsers.length; i++) {
          if (this.bundle.archiveUsers[i].id == user.id) {
            this.bundle.archiveUsers[i] = user;
            break;
          }
        }
      },
      error => {
        this.util.handleError(error);
      });
  }
  
  checkUserData(data) {
    if (data['firstName'] == null || data['firstName'] == '') {
      return false;
    }
    if (data['firstYear'] != null && isNaN(data['firstYear'])) {
      return false;
    }
    if (data['lastYear'] != null && isNaN(data['lastYear'])) {
      return false;
    }
    return true;
  }
  
  deleteUser(event, user) {
    event.stopPropagation();
    this.util.confirm(
      'Suppression du compétiteur',
      'La suppression du compétiteur entraînera la suppression de ses récompenses. Etes-vous sûr de vouloir le supprimer ?',
      this.deleteUserBackend.bind(this),
      user);
  }
  
  deleteUserBackend(user) {
    this.backend.deleteArchiveUser(user).subscribe(
      () => {
        // Mise à jour de l'IHM
        for (let i = 0; i < this.bundle.archiveUsers.length; i++) {
          if (this.bundle.archiveUsers[i].id == user.id) {
            this.bundle.archiveUsers.splice(i, 1);
            break;
          }
        }
      },
      error => {
        this.util.handleError(error);
      });
  }
  
  // ===== Archive =====
  
  addArchive() {
    this.navCtrl.push(ArchiveDetailPage, { 'users': this.bundle.archiveUsers, 'categories': this.bundle.archiveCategories });
  }
  
  editArchive(archive) {
    this.navCtrl.push(ArchiveDetailPage, { 'users': this.getRestrictedUsers(archive.year), 'categories': this.bundle.archiveCategories, 'archive': archive });
  }
  
  deleteArchive(event, archive) {
    event.stopPropagation();
    this.util.confirm('Suppression de l\'archive', 'Etes-vous sûr de vouloir supprimer l\'archive ?', this.deleteArchiveBackend.bind(this), archive);   
  }
  
  deleteArchiveBackend(archive) {
    this.backend.deleteArchive(archive).subscribe(
      () => {
        // Mise à jour de l'IHM
        for (let i = 0; i < this.bundle.archives.length; i++) {
          if (this.bundle.archives[i].id == archive.id) {
            this.bundle.archives.splice(i, 1);
            break;
          }
        }
      },
      error => {
        this.util.handleError(error);
      });
  }
  
  getRestrictedUsers(year) {
    let restrictedUsers = [];
    for (let user of this.bundle.archiveUsers) {
      if ((user.firstYear == null || user.firstYear <= year) && (user.lastYear == null || user.lastYear >= year)) {
        restrictedUsers.push(user);
      }
    }
    
    return restrictedUsers;
  }
  
  getLosersByYear(year) {
    let usersIds = this.bundle.losersByYear[year];
    return this.util.getUsersNamesFromList(usersIds, this.bundle.archiveUsers);
  }
  
  // ===== Statistiques =====
  
  statCategory(event, category) {
    if (event != null) {
      event.stopPropagation();
    }    
    let modal = this.modalCtrl.create(StatCategoryPage, { 'category': category, 'users': this.bundle.archiveUsers });
    modal.present();
  }
  
  statCategoryGrandChampion() {
    let modal = this.modalCtrl.create(StatCategoryPage, { 'category': null, 'users': this.bundle.archiveUsers });
    modal.present();
  }
  
  statUser(event, user) {
    if (event != null) {
      event.stopPropagation();
    }    
    let modal = this.modalCtrl.create(StatUserPage, { 'user': user, 'categories': this.bundle.archiveCategories });
    modal.present();
  }
  
  statRecords() {
    let modal = this.modalCtrl.create(StatRecordPage, { 'categories': this.bundle.archiveCategories, 'users': this.bundle.archiveUsers });
    modal.present();
  }
}
