import {Component, Input, OnInit} from '@angular/core';
import {CommentType} from "../../../types/comment.type";
import {CommentsService} from "../../services/comments.service";
import {Reactions} from "../../enums/reactions";
import {DefaultResponseType} from "../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() comment: CommentType;
  violate: boolean = true;

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
      .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              this._snackBar.open(data.message || 'Ошибка при обработке dislike', 'OK');
              return;
            }
            if (this.comment.action === '') {
              this.comment.action = 'dislike';
              this.comment.dislikesCount += 1;
            } else if (this.comment.action === 'dislike') {
              this.comment.action = '';
              this.comment.dislikesCount -= 1;
            } else if (this.comment.action === 'like') {
              this.comment.action = 'dislike';
              this.comment.likesCount -= 1;
              this.comment.dislikesCount += 1;
            }
          },
          error: err => {
            console.error(err);
            this._snackBar.open('Произошла ошибка', 'OK');
          }
        });
  }

  likeAction(): void {
    this.commentsService.applyAction(this.comment.id, Reactions.Like)
      .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              this._snackBar.open(data.message || 'Ошибка при обработке like', 'OK');
              return;
            }
            if (this.comment.action === '') {
              this.comment.action = 'like';
              this.comment.likesCount += 1;
            } else if (this.comment.action === 'like') {
              this.comment.action = '';
              this.comment.likesCount -= 1;
            } else if (this.comment.action === 'dislike') {
              this.comment.action = 'like';
              this.comment.dislikesCount -= 1;
              this.comment.likesCount += 1;
            }
          },
          error: err => {
            console.error(err);
            this._snackBar.open('Произошла ошибка', 'OK');
          }
        });
  }

  violateAction(): void {
    this.commentsService.applyAction(this.comment.id, Reactions.Violate)
      .subscribe({
        next: (data: DefaultResponseType) => {
          if (data.error) {
            const error = data.message;
            throw new Error(error);
          }
          this.violate = false;
        },
        error: err => {
          console.error(err);
          this._snackBar.open( 'Произошла ошибка', 'OK', {duration: 4000});
        }
      })
  }
}
