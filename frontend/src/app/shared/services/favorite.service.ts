import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {ArticlesType} from "../../types/articles.type";

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private http: HttpClient) { }

  getTopArticles(): Observable<ArticlesType[] | DefaultResponseType> {
    return this.http.get<ArticlesType[] | DefaultResponseType>(environment.api + 'articles/top');
  }
}
