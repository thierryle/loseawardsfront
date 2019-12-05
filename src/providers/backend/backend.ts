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
  apiUrl: string;
  baseUrl: string = '';
  cachedUsers: any;
  cachedCategories: any;
  identifiedUser: any;
  cachedGlobals: any;

  constructor(public http: HttpClient) {
    console.log('HOST : ' + window.location.hostname);
    if (window.location.hostname == 'localhost') {
      // Test en local
      this.baseUrl = 'http://localhost:8080';
    }
    this.apiUrl = this.baseUrl + '/_ah/api/loseawards/v1';
  }
  
  // ===== Accueil =====
  
  getHomeBundle() {
    return this.http.get(this.apiUrl + '/home/bundle');
  }
  
  reset() {
    return this.http.delete(this.apiUrl + '/home/reset');
  }
  
  clean() {
    return this.http.get(this.apiUrl + '/home/clean');
  }
  
  // ===== Utilisateurs =====

  getUserBundle() {
    return this.http.get(this.apiUrl + '/users/bundle');
  }
  
  getUsers() {
    return this.http.get(this.apiUrl + '/users');
  }
  
  addUser(user) {
    return this.http.post(this.apiUrl + '/users', user);
  }
  
  updateUser(user) {
    return this.http.put(this.apiUrl + '/users/' + user.id, user);
  }
  
  deleteUser(user) {
    return this.http.delete(this.apiUrl + '/users/' + user.id);
  }
  
  // ===== Catégories =====
  
  getCategories() {
    return this.http.get(this.apiUrl + '/categories');
  }
  
  addCategory(category) {
    return this.http.post(this.apiUrl + '/categories', category);
  }
  
  updateCategory(category) {
    return this.http.put(this.apiUrl + '/categories/' + category.id, category);
  }
  
  deleteCategory(category) {
    return this.http.delete(this.apiUrl + '/categories/' + category.id);
  }
  
  // ===== Nominations =====
  
  getNominationBundle() {
    return this.http.get(this.apiUrl + '/nominations/bundle');
  }
  
  addNomination(nomination) {
    return this.http.post(this.apiUrl + '/nominations', nomination);
  }
  
  deleteNomination(nomination) {
    return this.http.delete(this.apiUrl + '/nominations/' + nomination.id);
  }
  
  updateNomination(nomination) {
    return this.http.put(this.apiUrl + '/nominations/' + nomination.id, nomination);
  }
  
  getNominationImageURL(imageId) {
    return this.baseUrl + '/images/' + imageId;
  }
  
  sendNominationsByMail(address) {
    let params = new HttpParams();
    params = params.append('address', address);
    
    return this.http.get(this.apiUrl + '/nominations/mail', { params });
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
    return this.http.get(this.apiUrl + '/comments/group');
  }
  
  addComment(comment) {
    return this.http.post(this.apiUrl + '/comments', comment);
  }
  
  deleteComment(comment) {
    return this.http.delete(this.apiUrl + '/comments/' + comment.id);
  }
  
  updateComment(comment) {
    return this.http.put(this.apiUrl + '/comments/' + comment.id, comment);
  }
  
  // ===== Avatars =====
  
  getAvatarURL(avatarId) {
    // return this.apiUrl + '/avatars/' + avatarId;
    return this.baseUrl + '/avatars/' + avatarId;
  }
  
  getAvatar(avatarId) {
    return this.http.get(this.apiUrl + '/avatars/' + avatarId);
  }
  
  // ===== Images =====

  getImageBundle() {
    return this.http.get(this.apiUrl + '/images/bundle');
  }
  
  getImageURL(imageId) {
    return this.apiUrl + '/images/' + imageId;
  }
  
  // ===== Votes =====
  
  addVotes(votes) {
    return this.http.post(this.apiUrl + '/votes/bulk', { 'votes': votes });
  }
  
  getVoteResult() {
    return this.http.get(this.apiUrl + '/votes/result');
  }
  
  getVotesByUser(userId) {
    let params = new HttpParams();
    params = params.append('userId', userId);
    
    return this.http.get(this.apiUrl + '/votes', { params });
  }
  
  deleteVotes() {
    return this.http.delete(this.apiUrl + '/votes');
  }
  
  addDecisions(decisions) {
    return this.http.post(this.apiUrl + '/decisions/bulk', { 'decisions': decisions });
  }
  
  // ===== Variables globales =====
  
  updateGlobal(global) {
    return this.http.put(this.apiUrl + '/globals/' + global.id, global);
  }
  
  updateGlobals(globals) {
    return this.http.put(this.apiUrl + '/globals/bulk', globals);
  }

  getCachedGlobals() {
    return this.cachedGlobals;
  }
  
  setCachedGlobals(globals) {
    this.cachedGlobals = globals;
  }
  
  // ===== Archives =====
  
  getArchiveBundle() {
    return this.http.get(this.apiUrl + '/archives/bundle');
  }
  
  getArchiveUsers() {
    return this.http.get(this.apiUrl + '/archiveusers');
  }
  
  addArchiveUser(user) {
    return this.http.post(this.apiUrl + '/archiveusers', user);
  }
  
  updateArchiveUser(user) {
    return this.http.put(this.apiUrl + '/archiveusers/' + user.id, user);
  }
  
  deleteArchiveUser(user) {
    return this.http.delete(this.apiUrl + '/archiveusers/' + user.id);
  }
  
  getArchiveCategories() {
    return this.http.get(this.apiUrl + '/archivecategories');
  }
  
  addArchiveCategory(category) {
    return this.http.post(this.apiUrl + '/archivecategories', category);
  }
  
  updateArchiveCategory(category) {
    return this.http.put(this.apiUrl + '/archivecategories/' + category.id, category);
  }
  
  deleteArchiveCategory(category) {
    return this.http.delete(this.apiUrl + '/archivecategories/' + category.id);
  }
  
  addArchive(archive) {
    return this.http.post(this.apiUrl + '/archives', archive);
  }
  
  deleteArchive(archive) {
    return this.http.delete(this.apiUrl + '/archives/' + archive.id);
  }
  
  addArchiveWithAwardsAndReport(archiveWithAwards) {
    return this.http.post(this.apiUrl + '/archives/awards', archiveWithAwards);
  }
  
  updateArchiveWithAwardsAndReport(archiveWithAwards) {
    return this.http.put(this.apiUrl + '/archives/awards/' + archiveWithAwards.archive.id, archiveWithAwards);
  }
  
  /*
  addArchiveAwards(awards) {
    return this.http.post(this.apiUrl + '/archiveawards/bulk', awards);
  }
  
  getArchiveAwards(year) {
    let params = new HttpParams();
    params = params.append('year', year);
    
    return this.http.get(this.apiUrl + '/archiveawards', { params });
  }
  */
  
  getArchiveAwardsAndReport(year) {
    let params = new HttpParams();
    params = params.append('year', year);
    
    return this.http.get(this.apiUrl + '/archiveawards/report', { params });
  }
  
  linkCategories() {
    return this.http.get(this.apiUrl + '/archives/categoriesLinks');
  }
  
  createArchiveFromVoteResult(categoriesLinks) {
    return this.http.post(this.apiUrl + '/archives/fromVoteResult', categoriesLinks);
  }
  
  // ===== Statistiques =====
  
  getStatCategory(category) {
    let params = new HttpParams();
    params = params.append('categoryId', category.id);
    
    return this.http.get(this.apiUrl + '/archiveawards/statcategory', { params });
  }
  
  getStatCategoryGrandChampion() {
    return this.http.get(this.apiUrl + '/archiveawards/statcategory');
  }
  
  getStatUser(user) {
    let params = new HttpParams();
    params = params.append('userId', user.id);
    
    return this.http.get(this.apiUrl + '/archiveawards/statuser', { params });
  }
  
  getStatRecords() {
    return this.http.get(this.apiUrl + '/archiveawards/statrecords');
  }
  
  // ===== Imports =====
  
  restoreByURL(restoreURL) {
    return this.http.post(this.apiUrl + '/restore/url', restoreURL);
  }
}
