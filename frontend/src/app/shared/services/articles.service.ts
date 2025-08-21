import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ArticlesType} from "../../types/articles.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {ArticlesWithFilterType} from "../../types/articles-with-filter.type";
import {ArticleType} from "../../types/article.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) { }

  getArticles(): Observable<ArticlesWithFilterType | DefaultResponseType> {
    return this.http.get<ArticlesWithFilterType | DefaultResponseType>(environment.api + 'articles');
  }

  getArticle(url: string): Observable<ArticleType | DefaultResponseType> {
    return this.http.get<ArticleType | DefaultResponseType>(environment.api + 'articles/' + url);
  }
  getArticlesRelate(): Observable<ArticlesType[] | DefaultResponseType> {
    return this.http.get<ArticlesType[] | DefaultResponseType>(environment.api + 'articles/related/6_saitov_dlya_povisheniya__produktivnosti');
  }

}
