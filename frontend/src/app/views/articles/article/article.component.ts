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
import {CommentsParamsType} from "../../../types/commentsParams.type";
import {CurrentUrlType} from "../../../shared/current-url.type";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  commentText:string = '';
  comments: CommentType[] = [];
  commentsCount = 0;
  currentUrl: CurrentUrlType = {url: ''};
  commentsParams: CommentsParamsType = {comments: 5};
  commentsCountQueryParams: CommentsParamsType;
  totalCommentsCountFromBack: number = 0;
  totalComments = 0;
  offset = 0;
  loggedIn: boolean = false;
  // loggedIn$: Observable<boolean> = this.authService.isLogged$;

  @ViewChild('articleText') articleText: ElementRef | null = null;

  article: ArticleType | null = null;
  relatedArticles: ArticlesType[] | null = null;

  constructor(private articlesService: ArticlesService,
              private authService: AuthService,
              private router: Router,
              private activeRouter: ActivatedRoute,
              private commentsService: CommentsService) {

    this.commentsCountQueryParams = {comments: 5}
    this.loggedIn = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.activeRouter.params
      .subscribe(params => {
        console.log('params', params)

        this.currentUrl = params as CurrentUrlType;


        // получить статью по url из параметров
        this.articlesService.getArticle(params['url'])
          .subscribe((data: ArticleType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              const error = (data as DefaultResponseType).message;
              throw new Error(error);
            }

            this.article = data as ArticleType;

            this.totalCommentsCountFromBack = this.article.commentsCount;

            console.log('this.article', this.article);

            if (this.articleText) {
              this.articleText.nativeElement.innerHTML = this.article.text;
            }

            // подписка на изменение (queryParams comment) нужное количество комментариев для отображения на странице
            this.activeRouter.queryParams
              .subscribe(data => {
              this.commentsCountQueryParams = data as CommentsParamsType;

            })

            let commentsCountQueryParams = +this.commentsCountQueryParams.comments

            if (this.totalCommentsCountFromBack < commentsCountQueryParams) {
              commentsCountQueryParams = +this.totalCommentsCountFromBack;
            }

            // получить комментарии для статьи
            this.commentsService.getComments(this.totalCommentsCountFromBack - commentsCountQueryParams, this.article.id)
              .subscribe((data: DefaultResponseType | CommentsType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  const error = (data as DefaultResponseType).message;
                  throw new Error(error);
                }

                const commentsData = data as CommentsType;
                this.comments = commentsData.comments;
                this.commentsCount = commentsData.allCount;

              })
          });
      })

    // подписка на рекомендуемые статьи
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
          if ((data as DefaultResponseType).error !== undefined) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }

          console.log('data', data);

        })
    }
  }

  moreComments() {
    this.commentsParams.comments = this.commentsParams.comments + 1;
    this.commentsCountQueryParams = {comments: this.commentsParams.comments}

    this.router.navigate([`/articles/${this.currentUrl.url}`], {
      queryParams: this.commentsCountQueryParams
    });
  }
}
