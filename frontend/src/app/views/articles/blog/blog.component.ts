import { Component, OnInit } from '@angular/core';
import {ArticlesType} from "../../../types/articles.type";
import {ArticlesService} from "../../../shared/services/articles.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ArticlesWithFilterType} from "../../../types/articles-with-filter.type";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  articles: ArticlesType[] | null = null;

  constructor(private articlesType: ArticlesService) { }

  ngOnInit(): void {
    this.articlesType.getArticles()
      .subscribe({
        next: (data: ArticlesWithFilterType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }

          const items = data as ArticlesWithFilterType;

          this.articles = items.items as ArticlesType[];

        },
        error: (error) => {

        }
      })
  }

}
