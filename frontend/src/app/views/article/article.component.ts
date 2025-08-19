import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ArticlesService} from "../../shared/services/articles.service";
import {ArticlesType} from "../../types/articles.type";
import {ArticleType} from "../../types/article.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {AuthService} from "../../core/auth/auth.service";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  comments = [6];
  loggedIn: boolean = false;

  @ViewChild('articleText') articleText: ElementRef | null = null;

  article: ArticleType | null = null;
  relatedArticles: ArticlesType[] | null = null;

  constructor(private articlesService: ArticlesService,
              private authService: AuthService) {
    this.loggedIn = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.articlesService.getArticle()
      .subscribe((data: ArticleType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        this.article = data as ArticleType;

        if (this.articleText) {
          this.articleText.nativeElement.innerHTML = this.article.text;
        }
      });

    this.articlesService.getArticlesRelate()
      .subscribe((data: ArticlesType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        this.relatedArticles = data as ArticlesType[];
      })
  }
}
