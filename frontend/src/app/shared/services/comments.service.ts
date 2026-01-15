import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {CommentsType} from "../../types/comments.type";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

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
}
