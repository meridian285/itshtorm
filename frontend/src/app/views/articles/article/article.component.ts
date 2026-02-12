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
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentActionType} from "../../../types/comment-action.type";
import {BehaviorSubject, Observable} from "rxjs";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  commentText: string = '';
  comments: CommentType[] = [];
  commentsAllCount: number = 0
  currentUrl: CurrentUrlType = {url: ''};
  commentsCountQueryParams: CommentsParamsType = {comments: 0};
  commentsCountQueryParamsForUpdate: number = 0;
  totalCommentsCountFromBack: number = 0;
  loggedIn: boolean = false;

  private _isChangeReaction$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    // loggedIn$: Observable<boolean> = this.authService.isLogged$;

  @ViewChild('articleText') articleText: ElementRef | null = null;

  article: ArticleType | null | undefined = null;
  relatedArticles: ArticlesType[] | null = null;

  constructor(private articlesService: ArticlesService,
              private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar,
              private activeRouter: ActivatedRoute,
              private commentsService: CommentsService) {

    this.loggedIn = this.authService.getIsLoggedIn();
  }

  public get isChangeReaction$(): Observable<boolean> {
    return this._isChangeReaction$.asObservable();
  }

  public getIsChangeReaction() {
    return this._isChangeReaction$.getValue();
  }

  public set isChangeReaction(value: boolean) {
    this._isChangeReaction$.next(value);
  }

  ngOnInit(): void {
    this.activeRouter.params
      .subscribe(params => {

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

            if (this.articleText) {
              this.articleText.nativeElement.innerHTML = this.article.text;
            }

            // подписка на изменение (queryParams comment) нужное количество комментариев для отображения на странице
            this.activeRouter.queryParams
              .subscribe(data => {
                this.commentsCountQueryParams = data as CommentsParamsType;

                this.commentsCountQueryParamsForUpdate = +this.commentsCountQueryParams.comments

                if (this.totalCommentsCountFromBack < this.commentsCountQueryParamsForUpdate) {
                  this.commentsCountQueryParamsForUpdate = +this.totalCommentsCountFromBack;
                }

                // получить комментарии для статьи
                this.updateComments();


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

  updateComments(): void {
    if (this.article) {
      const article = this.article
      this.commentsService.getComments(this.totalCommentsCountFromBack - this.commentsCountQueryParamsForUpdate, article.id)
        .subscribe((data: DefaultResponseType | CommentsType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }

          const commentsData = data as CommentsType;

          this.comments = commentsData.comments;
          this.commentsAllCount = commentsData.allCount;

        })
    }
  }

  addComment(): void {
    if (this.article) {
      this.commentsService.addComment(this.commentText, this.article.id)
        .subscribe(data => {
          if ((data as DefaultResponseType).error !== undefined) {
            const message = (data as DefaultResponseType).message;

            this.updateComments();
            this._snackBar.open(message);
            this.commentText = "";

            throw new Error(message);
          }

        })
    }
  }

  moreComments(): void {
    this.commentsCountQueryParams = {comments: +this.commentsCountQueryParams.comments + 10};

    this.router.navigate([`/articles/${this.currentUrl.url}`], {
      queryParams: this.commentsCountQueryParams
    });
  }

  changeReaction(changeReaction: boolean) {
    // console.log('article - changeReaction', changeReaction)

    this.updateComments()
  }
}
