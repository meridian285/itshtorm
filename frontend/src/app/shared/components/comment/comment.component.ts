import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommentType} from "../../../types/comment.type";
import {CommentsService} from "../../services/comments.service";
import {Reactions} from "../../enums/reactions";
import {BehaviorSubject} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentActionType} from "../../../types/comment-action.type";

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Output() actionEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Input() comment: CommentType;

  currentStateReaction: CommentActionType = {comment: '', action: ''};



  private _isChangeReaction$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private commentsService: CommentsService,
              private _snackBar: MatSnackBar,) {

    this.comment = {
      id: '',
      text: '',
      date: '',
      likesCount: 0,
      dislikesCount: 0,
      user: {
        id: '',
        name: '',
      }
    }
  }

  ngOnInit(): void {
    this.updateReaction();
  }


  updateReaction(): void {
    this.commentsService.getActionForComment(this.comment.id)
      .subscribe(data => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        const commentReaction = data as CommentActionType[];

        if (commentReaction.length > 0) {
          commentReaction.forEach(item => {
            if(item.action !== '') {
              this.currentStateReaction.comment = item.comment;
              this.currentStateReaction.action = item.action;
            }
          })
        } else {
            this.currentStateReaction.comment = '';
            this.currentStateReaction.action = '';
        }
      })
  }

  dislikeAction(): void {
    this.commentsService.applyAction(this.comment.id, Reactions.Dislike)
      .subscribe(data => {
        if ((data as DefaultResponseType).error !== undefined) {
          if (data.error) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }

          this.updateReaction();
          this._snackBar.open('Ваш голос учтен');

          this.actionEmitter.emit(this.comment.id);

        }
      });

  }

  likeAction(): void {
    this.commentsService.applyAction(this.comment.id, Reactions.Like)
      .subscribe(data => {
        if ((data as DefaultResponseType).error !== undefined) {
          if (data.error) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }

          this.updateReaction();
          this._snackBar.open('Ваш голос учтен')

          this.actionEmitter.emit(this.comment.id);
        }
      });
  }

  violateAction(): void {
    this.commentsService.applyAction(this.comment.id, Reactions.Violate)
      .subscribe(data => {
        if ((data as DefaultResponseType).error !== undefined) {
          if (data.error) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }

          this._snackBar.open('Жалоба отправлена')
        }
      });
  }
}
