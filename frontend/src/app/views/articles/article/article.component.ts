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
import {CurrentUrlType} from "../../../shared/current-url.type";
import {MatSnackBar} from "@angular/material/snack-bar";
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
  loggedIn: boolean = false;


  totalCommentsCountFromBack: number = 0;
  commentsCountForUpdate: number = 0;
  private currentCountComments$: BehaviorSubject<number> = new BehaviorSubject<number>(3);

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

  public get countComments$(): Observable<number> {
    return this.currentCountComments$.asObservable();
  }

  public getCurrentCountComments$() {
    return this.currentCountComments$.getValue();
  }

  public set currentCountComments(value: number) {
    this.currentCountComments$.next(value);
  }

  ngOnInit(): void {
    this.activeRouter.params
      .subscribe(params => {

        this.currentUrl = params as CurrentUrlType;

        // подписка на изменение нужного количества комментариев для отображения на странице
        this.countComments$.subscribe(currentCountComments => {
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

              if (this.totalCommentsCountFromBack < currentCountComments) {
                this.commentsCountForUpdate = this.totalCommentsCountFromBack;
              } else {
                this.commentsCountForUpdate = currentCountComments;
              }

              // получить комментарии для статьи
              this.updateComments();

            });
        })
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

  updateComments(idComment: string = ''): void {
    if (idComment.length < 1) {
      if (this.article) {
        const article = this.article;

        this.commentsService.getComments(this.totalCommentsCountFromBack - this.commentsCountForUpdate, article.id)
          .subscribe((data: DefaultResponseType | CommentsType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              const error = (data as DefaultResponseType).message;
              throw new Error(error);
            }

            const commentsData = data as CommentsType;

            if (this.comments.length < 1) {
              this.comments = commentsData.comments;
            } else {
              const comments = this.comments
              commentsData.comments.forEach(commentData => {
                if (comments.some(comment => comment.id === commentData.id)) {

                } else {
                  this.comments.push(commentData)
                }
              })
            }

            this.comments.sort((a, b) => {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            })
            this.commentsAllCount = commentsData.allCount;
          })
      }
    } else if (idComment.length > 0) {
      if (this.article) {
        const article = this.article;

        let isFind = false;
        let count = 10;
        for (let i = 0; i < this.totalCommentsCountFromBack; i += count) {
          this.commentsService.getComments(this.totalCommentsCountFromBack - count, article.id)
            .subscribe((data: DefaultResponseType | CommentsType) => {
              if ((data as DefaultResponseType).error !== undefined) {
                const error = (data as DefaultResponseType).message;
                throw new Error(error);
              }

              const commentsData = data as CommentsType;

              commentsData.comments.forEach(item => {
                if (item.id === idComment) {
                  isFind = true;

                  this.comments.forEach(comment => {
                    if (comment.id === idComment) {
                      comment.likesCount = item.likesCount;
                      comment.dislikesCount = item.dislikesCount;
                    }
                  })
                }
              })
            })

          if (isFind) {
            break;
          }

          count = count + 10;
        }
      }

      // this.commentsService.getComments(this.totalCommentsCountFromBack - this.commentsCountForUpdate, article.id)
      //   .pipe(
      //     expand(response => console.log(response)
      //   this.commentsService.getComments(this.totalCommentsCountFromBack - this.commentsCountForUpdate, article.id) : EMPTY)
      // if (data.comments.some((item: CommentType) => item.id !== idComment)) {
      //   this.commentsService.getComments(this.totalCommentsCountFromBack - this.commentsCountForUpdate, article.id)
      // } else {
      // }
      // )


    }
  }

  addComment(): void {
    if (this.article) {
      this.commentsService.addComment(this.commentText, this.article.id)
        .subscribe(data => {
          if ((data as DefaultResponseType).error !== undefined) {
            const message = (data as DefaultResponseType).message;

            this.currentCountComments = this.getCurrentCountComments$() + 1;

            this.updateComments();
            this._snackBar.open(message);
            this.commentText = "";

            throw new Error(message);
          } else if ((data as DefaultResponseType).error !== undefined) {

          }

        })
    }
  }

  moreComments(): void {
    if ((this.totalCommentsCountFromBack - this.commentsCountForUpdate) > 10) {
      this.currentCountComments = this.getCurrentCountComments$() + 10;
    } else {
      this.currentCountComments = this.getCurrentCountComments$() + (this.totalCommentsCountFromBack - this.commentsCountForUpdate);
    }

  }

  changeReaction(idComment: string) {
    this.updateComments( idComment);
  }
}
