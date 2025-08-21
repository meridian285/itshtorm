import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ArticleType} from "../../../types/article.type";
import {ArticlesService} from "../../../shared/services/articles.service";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ArticlesType} from "../../../types/articles.type";
import {ActivatedRoute, Router} from "@angular/router";
import {CommentsService} from "../../../shared/services/comments.service";
import {CommentsType} from "../../../types/comments.type";
import {CommentType} from "../../../types/comment.type";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  commentText:string = '';
  comments: CommentType[] = [];
  commentsCount: number = 0;
  loggedIn: boolean = false;

  @ViewChild('articleText') articleText: ElementRef | null = null;

  article: ArticleType | null = null;
  relatedArticles: ArticlesType[] | null = null;

  constructor(private articlesService: ArticlesService,
              private authService: AuthService,
              private router: Router,
              private activeRouter: ActivatedRoute,
              private commentsService: CommentsService) {

    this.loggedIn = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.activeRouter.params
      .subscribe(params => {
        this.articlesService.getArticle(params['url'])
          .subscribe((data: ArticleType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              const error = (data as DefaultResponseType).message;
              throw new Error(error);
            }

            this.article = data as ArticleType;

            if (this.articleText) {
              this.articleText.nativeElement.innerHTML = this.article.text;
            }

            this.commentsService.getComments(this.article.comments.length, this.article.id)
              .subscribe((data: DefaultResponseType | CommentsType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  const error = (data as DefaultResponseType).message;
                  throw new Error(error);
                }

                const commentsData = data as CommentsType
                this.comments = commentsData.comments;
                this.commentsCount = commentsData.allCount;
              })
          });
      })

    this.articlesService.getArticlesRelate()
      .subscribe((data: ArticlesType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        this.relatedArticles = data as ArticlesType[];
      })
  }

  addComment() {
    if (this.article) {
      this.commentsService.addComment(this.commentText, this.article.id)
        .subscribe(data => {

        })
    }
  }
}
