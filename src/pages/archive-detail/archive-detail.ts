import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilProvider } from '../../providers/util/util';
import { BackendProvider } from '../../providers/backend/backend';

/**
 * Generated class for the ArchiveDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-archive-detail',
  templateUrl: 'archive-detail.html',
})
export class ArchiveDetailPage {
  archiveForm: FormGroup;
  archive: any;
  submitAttempt: boolean = false;
  title: string;
  categories: any[];
  users: any[];
  //awards: any[];
  loseAward: any;
  //report: any;
  awardsAndReport: any;
  loaded: boolean;
  
  nbAwardsByUser: { [key: number]: number; } = {};

  constructor(public navCtrl: NavController, navParams: NavParams, formBuilder: FormBuilder, public util: UtilProvider, public backend: BackendProvider) {
    this.loaded = false;
    let paramArchive = navParams.get('archive');
    this.categories = navParams.get('categories');
    this.users = navParams.get('users');
    
    if (paramArchive == null) {
      // Création
      this.archive = {
        'id': null,
        'year': '',
        'categoriesIds': null,
        'ranking': null        
      };
      this.loseAward = { 'year': null, 'categoryId': null, 'usersIds': null };
      this.awardsAndReport = {
        'archiveAwards': [this.loseAward],
        'archiveReport': { report: '' }
      };
      this.title = 'Nouvelle archive';
      this.updateNbAwardsByUser();
      this.loaded = true;
    } else {
      // Modification
      this.archive = {
        'id' : paramArchive.id,
        'year': paramArchive.year,
        'categoriesIds': paramArchive.categoriesIds,
        'ranking': paramArchive.ranking
      }
      this.title = 'Modification de l\'archive';
      this.getAwardsAndReport(paramArchive.year);
    }
    
    this.archiveForm = formBuilder.group({
      year: [this.archive.year, Validators.required],
      categoriesIds: [this.archive.categoriesIds, Validators.required],
      losersIds: [Validators.required],
    });
  }

  ionViewDidLoad() {
  }

  save() {
    this.submitAttempt = true;
    if (this.archiveForm.valid) {
      this.updateAwardsAndReportYear();
      if (this.archive.id != null) {
        // Mise à jour
        this.backend.updateArchiveWithAwardsAndReport({ archive: this.archive, archiveAwards: this.awardsAndReport.archiveAwards, archiveReport: this.awardsAndReport.archiveReport }).subscribe(
          () => {
            this.navCtrl.pop();
          },
          error => {
            this.util.handleError(error);
          });
      } else {
        // Création
        this.backend.addArchiveWithAwardsAndReport({ archive: this.archive, archiveAwards: this.awardsAndReport.archiveAwards, archiveReport: this.awardsAndReport.archiveReport }).subscribe(
          () => {
            this.navCtrl.pop();
          },
          error => {
            this.util.handleError(error);
          });
      }
    }    
  }
  
  /**
   * Retourne la récompense pour une catégorie.
   */
  getAwardByCategory(categoryId) {
    for (let award of this.awardsAndReport.archiveAwards) {
      if (award.categoryId == categoryId) {
        return award;
      }
    }
    // Récompense non-trouvée : on la crée
    let award = { year: null, categoryId: categoryId, usersIds: null, reason: null };
    this.awardsAndReport.archiveAwards.push(award);
    return award;
  }
  
  /**
   * Appel du backend pour récupérer les récompenses et le rapport.
   */
  getAwardsAndReport(year) {
    this.backend.getArchiveAwardsAndReport(year).subscribe(
      data => {
        this.awardsAndReport = data;
        
        // Recherche du lose award
        for (let award of this.awardsAndReport.archiveAwards) {
          if (award.categoryId == null) {
            this.loseAward = award;
            break;
          }
        }
        if (this.loseAward == null) {
          this.loseAward = { 'year': null, 'categoryId': null, 'usersIds': null };
          this.awardsAndReport.archiveAwards.push(this.loseAward);
        }
        
        this.updateNbAwardsByUser();
        this.loaded = true;
      },
      error => {
        this.util.handleError(error);
      });
  }
  
  /*
  getNbAwardsByUser(user) {
    let nbAwards = 0;
    for (let award of this.awards) {
      if (award.categoryId != null && award.usersIds != null && award.usersIds.indexOf(user.id) != -1) {
        nbAwards++;
      }
    }
    return nbAwards;
  }
  */
  
  /**
   * Mise à jour du nombre de récompenses par utilisateur.
   */
  updateNbAwardsByUser() {
    // On initialise à zéro récompense par compétiteur
    this.nbAwardsByUser = {};
    for (let user of this.users) {
      this.nbAwardsByUser[user.id] = 0;
    }
    
    // Parcours des récompenses
    for (let award of this.awardsAndReport.archiveAwards) {
      if (award.categoryId != null && award.usersIds != null) {
        for (let userId of award.usersIds) {
          this.nbAwardsByUser[userId] = this.nbAwardsByUser[userId] + 1;
        }
      }
    }
  }
  
  /**
   * Mise à jour du classement (après sélection par l'utilisateur du Grand Champion)
   */
  updateRanking() {
    this.archive.ranking = {};
    let rank = 1;
    this.archive.ranking[rank] = this.loseAward.usersIds;
    rank += this.loseAward.usersIds.length;
    let maxNbAwards = this.nbAwardsByUser[this.loseAward.usersIds[0]];
    for (let nbAwards = maxNbAwards; nbAwards >= 0; nbAwards--) {
      // Qui parmi les compétiteurs a le nombre courant de récompenses, à part les Grands Champions ?
      let currentRankUsers;
      for (let user of this.users) {
        let nbAwardsOfOneUser = this.nbAwardsByUser[user.id];
        if (nbAwardsOfOneUser == nbAwards && this.loseAward.usersIds.indexOf(user.id) == -1) {
          currentRankUsers = this.archive.ranking[rank];
          if (currentRankUsers == null) {
            currentRankUsers = [];
            this.archive.ranking[rank] = currentRankUsers;
          }
          currentRankUsers.push(user.id);
        }
      }
      // A-t-on trouvé des compétiteurs ?
      if (currentRankUsers != null) {
        rank += currentRankUsers.length;
      }
    }
  }
  
  getRankingKeys() {
    return Object.keys(this.archive.ranking);
  }
  
  /**
   * Mise à jour de la liste des récompenses possibles (après sélection par l'utilisateur des catégories possibles)
   */
  updateCategories() {
    this.awardsAndReport.archiveAwards = [];
    for (let categoryId of this.archive.categoriesIds) {
      this.awardsAndReport.archiveAwards.push({ year: null, categoryId: categoryId, usersIds: null, reason: null });
    }
    
    this.awardsAndReport.archiveAwards.push(this.loseAward);
  }
  
  /**
   * Mise à jour de l'année dans les récompenses et le rapport.
   */
  updateAwardsAndReportYear() {
    for (let award of this.awardsAndReport.archiveAwards) {
      award.year = this.archive.year;
    }
    this.awardsAndReport.archiveReport.year = this.archive.year;;
  }
  
  cancel() {
    this.navCtrl.pop();
  }
}
