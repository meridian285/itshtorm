import {Component, Input, OnInit} from '@angular/core';
import {CommentType} from "../../../types/comment.type";
import {CommentsService} from "../../services/comments.service";
import {Reactions} from "../../enums/reactions";
import {Subscriber} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() comment!: CommentType;

  changeReaction: Subscriber<string> = new Subscriber<string>();

  constructor(private commentsService: CommentsService,
              private _snackBar: MatSnackBar,) {
  }

  ngOnInit(): void {

  }

  dislikeAction() {
    this.commentsService.applyAction(this.comment.id, Reactions.Dislike)
      .subscribe(data => {
        if ((data as DefaultResponseType).error !== undefined) {
          if (data.error) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }
          this._snackBar.open('Ваш голос учтен')
        }
      });
  }

  likeAction() {
    this.commentsService.applyAction(this.comment.id, Reactions.Like)
      .subscribe(data => {
        if ((data as DefaultResponseType).error !== undefined) {
          if (data.error) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }
          this._snackBar.open('Ваш голос учтен')
        }
      });
  }

  violateAction() {
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
