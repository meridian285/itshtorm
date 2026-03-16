import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {DefaultResponseType} from "../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {CommentsType} from "../../types/comments.type";
import {CommentActionType} from "../../types/comment-action.type";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient,
              private _snackBar: MatSnackBar
  ) {
  }

  getComments(paramOffset: number, paramArticle: string): Observable<CommentsType | DefaultResponseType> {
    let params = new HttpParams();
    params = params.set('offset', paramOffset).set('article', paramArticle);
    return this.http.get<CommentsType | DefaultResponseType>(environment.api + 'comments', {params: params});
  }

  addComment(textComment: string, articleId: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text: textComment,
      article: articleId,
    });
  }

  applyAction(idComment: string, reaction: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + idComment + '/apply-action', {
      action: reaction
    })
  }

  getActionForComment(idComment: string): Observable<DefaultResponseType | CommentActionType[]> {
    return this.http.get<DefaultResponseType | CommentActionType[]>(environment.api + 'comments/' + idComment + '/actions');
  }

  getArticleCommentActionsForUser(articleId: string): Observable<DefaultResponseType | CommentActionType[]> {
    return this.http.get<DefaultResponseType | CommentActionType[]>(environment.api + 'comments/article-comment-actions?articleId=' + articleId);
  }
}
