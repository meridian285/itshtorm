import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommentType} from "../../../types/comment.type";
import {CommentsService} from "../../services/comments.service";
import {Reactions} from "../../enums/reactions";
import {catchError, of} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentActionType} from "../../../types/comment-action.type";

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  // @Output() actionEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Input() comment: CommentType;

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
      },
      action: ''
    }
  }

  ngOnInit(): void {

  }

  dislikeAction(): void {
    this.commentsService.applyAction(this.comment.id, Reactions.Dislike)
      .subscribe(data => {
        if ((data as DefaultResponseType).error !== undefined) {
          if (data.error) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }

          console.log('До')
          console.log('this.comment', this.comment)
          console.log('typeof this.comment.action', typeof this.comment.action)
          console.log('this.comment.action', this.comment.action)
          console.log('this.comment.dislikesCount', this.comment.dislikesCount)


          if (this.comment.action === '') {
            this.comment.action = 'dislike';
            this.comment.dislikesCount += 1;
          }

          if (this.comment.action === 'dislike') {
            this.comment.action = '';
            this.comment.dislikesCount -= 1;
          }

          if (this.comment.action === 'like') {
            this.comment.action = 'dislike';
            this.comment.likesCount -= 1;
            this.comment.dislikesCount += 1;
          }

          console.log('После')
          console.log('typeof this.comment.action', typeof this.comment.action)
          console.log('this.comment.action', this.comment.action)
          console.log('this.comment.dislikesCount', this.comment.dislikesCount)

          // this.commentsService.getActionForComment(this.comment.id)
          //   .subscribe(data => {
          //     if ((data as DefaultResponseType).error !== undefined) {
          //       const error = (data as DefaultResponseType).message;
          //       throw new Error(error);
          //     }
          //     const commentReaction = data as CommentActionType[];
          //     if (commentReaction.length > 0) {
          //       commentReaction.forEach(item => {
          //         if(item.action !== '') {
          //           if (this.comment.action === 'like') {
          //             this.comment.likesCount -= 1;
          //           }
          //           this.comment.action = item.action;
          //           this.comment.dislikesCount += 1;
          //         }
          //       })
          //     } else {
          //       this.comment.action = '';
          //       this.comment.dislikesCount -= 1;
          //     }
          //   })

          this._snackBar.open('Ваш голос учтен');
          // this.actionEmitter.emit();

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
                    if (this.comment.action === 'dislike') {
                      this.comment.dislikesCount -= 1;
                    }
                    this.comment.action = item.action;
                    this.comment.likesCount += 1;
                  }
                })
              } else {
                this.comment.action = '';
                this.comment.likesCount -= 1;
              }
            })

          this._snackBar.open('Ваш голос учтен')

          // this.actionEmitter.emit(this.comment.id);
        }
      });
  }

  violateAction(): void {
      this.commentsService.applyAction(this.comment.id, Reactions.Violate)
        .pipe(
          catchError(err => {
            if (err.status === 400) {
              console.error(err);
              this._snackBar.open('Жалоба уже была отправлена', 'OK', { duration: 4000 });
            }
            return of(err)
          })
        ).subscribe(data => {
          if ((data as DefaultResponseType).error !== undefined) {
            console.log('data', data)
            if (data.error) {
              const error = (data as DefaultResponseType).message;
              throw new Error(error);
            }
            this._snackBar.open('Жалоба отправлена', 'OK', { duration: 4000 });
          }
        });
  }
}
