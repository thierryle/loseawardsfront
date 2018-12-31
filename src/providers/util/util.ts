import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Events, LoadingController, ToastController } from 'ionic-angular';
import { BackendProvider } from '../backend/backend';

/*
  Generated class for the UtilProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilProvider {
  KEY_SHOW_LASTNAME: string = 'SHOW_LASTNAME';
  KEY_NOMINATIONS_OPEN: string = 'NOMINATIONS_OPEN';
  KEY_VOTES_OPEN: string = 'VOTES_OPEN';
  KEY_NEWS: string = 'NEWS';

  constructor(public http: HttpClient, public alertCtrl: AlertController, public backend: BackendProvider, public events: Events,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
  }

  handleError(error) {
    console.log('Erreur : ' + JSON.stringify(error));
    
    let alert = this.alertCtrl.create({
      title: 'Erreur',
      message: error.message,
      buttons: ['OK']
    });
    alert.present();
  }
  
  getDisplayName(user) {
    let showLastname = this.getGlobalByKey(this.KEY_SHOW_LASTNAME);
    if (showLastname != null && showLastname.value != null && showLastname.value.toUpperCase() == 'TRUE' && user.lastName != null && user.lastName != '') {
      return user.firstName + ' ' + user.lastName;
    }
    return user.firstName;
  }
  
  getUserName(userId) {
    for (let user of this.backend.getCachedUsers()) {
      if (userId == user.id) {
        return this.getDisplayName(user);
      }
    }
    return '';
  }
  
  getUserNameFromList(userId, users) {
    for (let user of users) {
      if (userId == user.id) {
        return this.getDisplayName(user);
      }
    }
    return '';
  }
  
  getUsersNamesFromList(usersIds, users) {
    if (usersIds == null) {
      return '';
    }
    let names = [];
    for (let user of users) {
      if (usersIds.indexOf(user.id) != -1) {
        names.push(this.getDisplayName(user));
      }
    }
    let result = names.join(', ');
    let index = result.lastIndexOf(',');
    if (index != -1) {
      result = result.substring(0, index) + ' et ' + result.substring(index + 2);
    }
    return result;
  }
  
  getGlobalByKey(key) {
    for (let global of this.backend.getCachedGlobals()) {
      if (key == global.key) {
        return global;
      }
    }
    return null;
  }
  
  nominationsOpen() {
    let global = this.getGlobalByKey(this.KEY_NOMINATIONS_OPEN);
    return (global != null && global.value != null && global.value.toUpperCase() == 'TRUE');
  }
  
  votesOpen() {
    let global = this.getGlobalByKey(this.KEY_VOTES_OPEN);
    return (global != null && global.value != null && global.value.toUpperCase() == 'TRUE');
  }
  
  getNews() {
    let global = this.getGlobalByKey(this.KEY_NEWS);
    if (global == null) {
      return null;
    }
    return global.value;
  }
  
  getUsersNames(usersIds) {
    return this.getUsersNamesFromList(usersIds, this.backend.getCachedUsers());
  }
  
  getCategoryName(categoryId) {
    for (let category of this.backend.getCachedCategories()) {
      if (categoryId == category.id) {
        return category.name;
      }
    }
    return '';
  }
  
  getCategoryNameFromList(categoryId, categories) {
    for (let category of categories) {
      if (categoryId == category.id) {
        return category.name;
      }
    }
    return '';
  }
  
  getCategoriesNames(categoriesIds) {
    let names = [];
    for (let category of this.backend.getCachedCategories()) {
      if (categoriesIds.indexOf(category.id) != -1) {
        names.push(category.name);
      }
    }
    let result = names.join(', ');
    let index = result.lastIndexOf(',');
    if (index != -1) {
      result = result.substring(0, index) + ' et ' + result.substring(index + 2);
    }
    return result;
  }
  
  identify(sender?, callback?) {
    let alert = this.alertCtrl.create({
      title: 'Identification',
      enableBackdropDismiss: false,
      buttons: [
        { text: 'OK', handler: data => {
          if (data == null) {
            return false;
          }
          this.backend.setIdentifiedUser(data);
          if (sender) {
            // La méthode a été appelée au préalable d'un commentaire ou d'un vote : il faut retourner à la page appelante
            this.events.publish(sender + ':identified', callback);         
          }
        }}
      ]
    });
    
    for (let user of this.backend.getCachedUsers()) {
      alert.addInput({
        type: 'radio',
        label: user.firstName + ' ' + user.lastName,
        value: user,
        checked: false
      });
    }
    
    alert.present();
  }
  
  getEmail(sender?) {
    let alert = this.alertCtrl.create({
      title: 'Addresse e-mail',
      inputs: [
        { name: 'email', placeholder: 'E-mail' }
      ],
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        { text: 'OK', handler: data => {
          if (data.email == null || data.email == '') {
            return false;
          }
          if (sender) {
            this.events.publish(sender + ':email', data.email);
          }
        }}
      ]
    });
    alert.present();
  }
  
  warning(title, content) {
    let alert = this.alertCtrl.create({
      title: title,
      message: content,
      buttons: ['OK']
    });
    alert.present();
  }
  
  confirm(title, content, callback, param) {
    let confirm = this.alertCtrl.create({
      title: title,
      message: content,
      buttons: [
        { text: 'Non', role: 'cancel' },
        { text: 'Oui', handler: () => { callback(param); } }
      ]
    });
    confirm.present();
  }
  
  getPlural(number, word) {
    if (number == null || number <= 1) {
      return number + ' ' + word;
    }
    return number + ' ' + word + 's';
  }
  
  getOrdinal(number) {
    switch (parseInt(number)) {
      case 1:
        return "Premier";
      case 2:
        return "Deuxième";
      case 3:
        return "Troisième";
      case 4:
        return "Quatrième";
      case 5:
        return "Cinquième";
      case 6:
        return "Sixième";
      case 7:
        return "Septième";
      case 8:
        return "Huitième";
      case 9:
        return "Neuvième";
      case 10:
        return "Dixième";
    }
    return "";
  }
  
  loading(message) {
    let loading = this.loadingCtrl.create({
      content: message
    });
    loading.present();
    return loading;
  }
  /*
  loading(message) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="assets/imgs/loseawards.png" />',
    });
    loading.present();
    return loading;
  }
  */
  
  toast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
    return toast;
  }
  
  mapOfListsAdd(map, key, element) {
    if (map[key] == null) {
      map[key] = [];
    }
    map[key].push(element);
  }
  
  mapOfListsDelete(map, key, id) {
    let elements = map[key];
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].id == id) {
        elements.splice(i, 1);
        break;
      }
    }
  }
  
  mapOfListsUpdate(map, key, element) {
    let elements = map[key];
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].id == element.id) {
        elements[i] = element;
        break;
      }
    }
  }
}
