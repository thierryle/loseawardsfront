import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import 'rxjs/add/operator/map';

/*
  Generated class for the BackendProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BackendProvider {
  urlBase : string = '';
  cachedUsers: any;
  cachedCategories: any;
  identifiedUser: any;
  cachedGlobals: any;

  constructor(public http: HttpClient) {
    console.log('HOST : ' + window.location.hostname);
    if (window.location.hostname == 'localhost') {
      // Test en local
      this.urlBase = 'http://localhost:8888';
    }
  }
  
  // ===== Accueil =====
  
  getHomeBundle() {
    return this.http.get(this.urlBase + '/api/home/bundle');
  }
  
  reset() {
    return this.http.delete(this.urlBase + '/api/home/reset');
  }
  
  clean() {
    return this.http.get(this.urlBase + '/api/home/clean');
  }
  
  // ===== Utilisateurs =====

  getUserBundle() {
    return this.http.get(this.urlBase + '/api/users/bundle');
  }
  
  getUsers() {
    return this.http.get(this.urlBase + '/api/users');
  }
  
  addUser(user) {
    return this.http.post(this.urlBase + '/api/users', user);
  }
  
  updateUser(user) {
    return this.http.put(this.urlBase + '/api/users/' + user.id, user);
  }
  
  deleteUser(user) {
    return this.http.delete(this.urlBase + '/api/users/' + user.id);
  }
  
  // ===== Catégories =====
  
  getCategories() {
    return this.http.get(this.urlBase + '/api/categories');
  }
  
  addCategory(category) {
    return this.http.post(this.urlBase + '/api/categories', category);
  }
  
  updateCategory(category) {
    return this.http.put(this.urlBase + '/api/categories/' + category.id, category);
  }
  
  deleteCategory(category) {
    return this.http.delete(this.urlBase + '/api/categories/' + category.id);
  }
  
  // ===== Nominations =====
  
  getNominationBundle() {
    return this.http.get(this.urlBase + '/api/nominations/bundle');
  }
  
  addNomination(nomination) {
    return this.http.post(this.urlBase + '/api/nominations', nomination);
  }
  
  deleteNomination(nomination) {
    return this.http.delete(this.urlBase + '/api/nominations/' + nomination.id);
  }
  
  updateNomination(nomination) {
    return this.http.put(this.urlBase + '/api/nominations/' + nomination.id, nomination);
  }
  
  getNominationImageURL(avatarId) {
    return this.urlBase + '/api/images/' + avatarId;
  }
  
  sendNominationsByMail(address) {
    let params = new HttpParams();
    params = params.append('address', address);
    
    return this.http.get(this.urlBase + '/api/nominations/mail', { params });
  }
  
  // ===== Cache et utilisateur identifié
  
  getCachedUsers() {
    return this.cachedUsers;
  }
  
  setCachedUsers(users) {
    this.cachedUsers = users;
    
    if (this.identifiedUser != null) {
      for (let user of this.cachedUsers) {
        if (this.identifiedUser.id == user.id) {
          this.identifiedUser = user;
          break; 
        }        
      }
    }
  }
  
  getIdentifiedUser() {
    return this.identifiedUser;
  }
  
  setIdentifiedUser(user) {
    this.identifiedUser = user;
  }
  
  isAdminConnected() {
    if (this.cachedUsers == null || this.cachedUsers.length == 0) {
      // S'il n'y a pas encore d'utilisateur, on est admin
      return true;
    }
    let user = this.getIdentifiedUser();
    return (user != null && user.firstName == 'Thierry');
  }
  
  updateCachedUser(user) {
    for (let i = 0; i < this.cachedUsers.length; i++) {
      if (this.cachedUsers[i].id == user.id) {
        this.cachedUsers[i] = user;
        break;
      }
    }
  }
  
  addCachedUser(user) {
    let inserted = false;
    for (let i = 0; i < this.cachedUsers.length; i++) {
      if (user.firstName < this.cachedUsers[i].firstName) {
        this.cachedUsers.splice(i, 0, user);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      this.cachedUsers.push(user);
    }
  }
  
  getCachedCategories() {
    return this.cachedCategories;
  }
  
  setCachedCategories(categories) {
    this.cachedCategories = categories;
  }
  
  deleteCachedUser(user) {
    for (let i = 0; i < this.cachedUsers.length; i++) {
      if (this.cachedUsers[i].id == user.id) {
        this.cachedUsers.splice(i, 1);
        break;
      }
    }
  }
  
  updateCachedCategory(category) {
    for (let i = 0; i < this.cachedCategories.length; i++) {
      if (this.cachedCategories[i].id == category.id) {
        this.cachedCategories[i] = category;
        break;
      }
    }
  }
  
  addCachedCategory(category) {
    let inserted = false;
    for (let i = 0; i < this.cachedCategories.length; i++) {
      if (category.name < this.cachedCategories[i].name) {
        this.cachedCategories.splice(i, 0, category);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      this.cachedCategories.push(category);
    }
  }
  
  deleteCachedCategory(category) {
    for (let i = 0; i < this.cachedCategories.length; i++) {
      if (this.cachedCategories[i].id == category.id) {
        this.cachedCategories.splice(i, 1);
        break;
      }
    }
  }
  
  // ===== Commentaires =====
  
  getCommentsByNominations() {
    return this.http.get(this.urlBase + '/api/comments/group');
  }
  
  addComment(comment) {
    return this.http.post(this.urlBase + '/api/comments', comment);
  }
  
  deleteComment(comment) {
    return this.http.delete(this.urlBase + '/api/comments/' + comment.id);
  }
  
  updateComment(comment) {
    return this.http.put(this.urlBase + '/api/comments/' + comment.id, comment);
  }
  
  // ===== Avatars =====
  
  getAvatarURL(avatarId) {
    return this.urlBase + '/api/avatars/' + avatarId;
  }
  
  // ===== Images =====

  getImageBundle() {
    return this.http.get(this.urlBase + '/api/images/bundle');
  }
  
  getImageURL(imageId) {
    return this.urlBase + '/api/images/' + imageId;
  }
  
  // ===== Votes =====
  
  addVotes(votes) {
    return this.http.post(this.urlBase + '/api/votes/bulk', votes);
  }
  
  getVoteResult() {
    return this.http.get(this.urlBase + '/api/votes/result');
  }
  
  getVotesByUser(userId) {
    let params = new HttpParams();
    params = params.append('userId', userId);
    
    return this.http.get(this.urlBase + '/api/votes', { params });
  }
  
  deleteVotes() {
    return this.http.delete(this.urlBase + '/api/votes');
  }
  
  addDecisions(decisions) {
    return this.http.post(this.urlBase + '/api/decisions/bulk', decisions);
  }
  
  // ===== Variables globales =====
  
  updateGlobal(global) {
    return this.http.put(this.urlBase + '/api/globals/' + global.id, global);
  }
  
  updateGlobals(globals) {
    return this.http.put(this.urlBase + '/api/globals/bulk', globals);
  }

  getCachedGlobals() {
    return this.cachedGlobals;
  }
  
  setCachedGlobals(globals) {
    this.cachedGlobals = globals;
  }
  
  // ===== Archives =====
  
  getArchiveBundle() {
    return this.http.get(this.urlBase + '/api/archives/bundle');
  }
  
  getArchiveUsers() {
    return this.http.get(this.urlBase + '/api/archiveusers');
  }
  
  addArchiveUser(user) {
    return this.http.post(this.urlBase + '/api/archiveusers', user);
  }
  
  updateArchiveUser(user) {
    return this.http.put(this.urlBase + '/api/archiveusers/' + user.id, user);
  }
  
  deleteArchiveUser(user) {
    return this.http.delete(this.urlBase + '/api/archiveusers/' + user.id);
  }
  
  getArchiveCategories() {
    return this.http.get(this.urlBase + '/api/archivecategories');
  }
  
  addArchiveCategory(category) {
    return this.http.post(this.urlBase + '/api/archivecategories', category);
  }
  
  updateArchiveCategory(category) {
    return this.http.put(this.urlBase + '/api/archivecategories/' + category.id, category);
  }
  
  deleteArchiveCategory(category) {
    return this.http.delete(this.urlBase + '/api/archivecategories/' + category.id);
  }
  
  addArchive(archive) {
    return this.http.post(this.urlBase + '/api/archives', archive);
  }
  
  deleteArchive(archive) {
    return this.http.delete(this.urlBase + '/api/archives/' + archive.id);
  }
  
  addArchiveWithAwardsAndReport(archiveWithAwards) {
    return this.http.post(this.urlBase + '/api/archives/awards', archiveWithAwards);
  }
  
  updateArchiveWithAwardsAndReport(archiveWithAwards) {
    return this.http.put(this.urlBase + '/api/archives/awards/' + archiveWithAwards.archive.id, archiveWithAwards);
  }
  
  /*
  addArchiveAwards(awards) {
    return this.http.post(this.urlBase + '/api/archiveawards/bulk', awards);
  }
  
  getArchiveAwards(year) {
    let params = new HttpParams();
    params = params.append('year', year);
    
    return this.http.get(this.urlBase + '/api/archiveawards', { params });
  }
  */
  
  getArchiveAwardsAndReport(year) {
    let params = new HttpParams();
    params = params.append('year', year);
    
    return this.http.get(this.urlBase + '/api/archiveawards/report', { params });
  }
  
  linkCategories() {
    return this.http.get(this.urlBase + '/api/archives/categoriesLinks');
  }
  
  createArchiveFromVoteResult(categoriesLinks) {
    return this.http.post(this.urlBase + '/api/archives/fromVoteResult', categoriesLinks);
  }
  
  // ===== Statistiques =====
  
  getStatCategory(category) {
    let params = new HttpParams();
    params = params.append('categoryId', category.id);
    
    return this.http.get(this.urlBase + '/api/archiveawards/statcategory', { params });
  }
  
  getStatCategoryGrandChampion() {
    return this.http.get(this.urlBase + '/api/archiveawards/statcategory');
  }
  
  getStatUser(user) {
    let params = new HttpParams();
    params = params.append('userId', user.id);
    
    return this.http.get(this.urlBase + '/api/archiveawards/statuser', { params });
  }
  
  getStatRecords() {
    return this.http.get(this.urlBase + '/api/archiveawards/statrecords');
  }
  
  // ===== Imports =====
  
  restoreByURL(restoreURL) {
    return this.http.post(this.urlBase + '/api/restore/url', restoreURL);
  }
}
