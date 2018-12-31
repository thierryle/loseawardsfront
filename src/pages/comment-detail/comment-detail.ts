import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackendProvider } from '../../providers/backend/backend';

/**
 * Generated class for the CommentDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comment-detail',
  templateUrl: 'comment-detail.html',
})
export class CommentDetailPage {
  commentForm: FormGroup;
  comment: any;
  submitAttempt: boolean = false;
  users: any;
  test: any;
  title: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public formBuilder: FormBuilder,
    backend: BackendProvider) {
      
    let paramComment = this.navParams.get('comment');
    if (paramComment == null) {
      // Création
      this.comment = {
        'authorId': backend.getIdentifiedUser().id,
        'content': '',
        'nominationId': this.navParams.get('nomination').id
      }
      this.title = 'Nouveau commentaire';
    } else {
      // Modification
      this.comment = {
        'id' : paramComment.id,
        'authorId': paramComment.authorId,
        'content': paramComment.content,
        'nominationId': paramComment.nominationId
      }
      this.title = 'Modification du commentaire';
    }
        
    this.commentForm = formBuilder.group({
      content: [this.comment.content, Validators.required]
    });
  }

  ionViewDidLoad() {
  }

  /**
   * Clic sur le bouton de fermeture.
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  /**
   * Clic sur le bouton de validation.
   */
  save() {
    this.submitAttempt = true;
    if (this.commentForm.valid) {
      //this.comment['date'] = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
      this.viewCtrl.dismiss(this.comment);
    }
  }
}
