import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ArticleType} from "../../../types/article.type";
import {ArticlesService} from "../../../shared/services/articles.service";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ArticlesType} from "../../../types/articles.type";
import {ActivatedRoute} from "@angular/router";
import {CommentsService} from "../../../shared/services/comments.service";
import {CommentsType} from "../../../types/comments.type";
import {CommentType} from "../../../types/comment.type";
import {CurrentUrlType} from "../../../shared/current-url.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BehaviorSubject, catchError, combineLatest, distinctUntilChanged, map, of, switchMap} from "rxjs";


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  @ViewChild('articleText') articleText!: ElementRef;

  commentText: string = '';
  comments: CommentType[] = [];
  commentsAllCount: number = 0
  currentUrl: CurrentUrlType = {url: ''};
  loggedIn: boolean = false;
  totalCommentsCountFromBack: number = 0;
  article: ArticleType | null = null;
  relatedArticles: ArticlesType[] | null = null;
  displayedCommentsCount$ = new BehaviorSubject<number>(3);

  constructor(
    private articlesService: ArticlesService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private activeRouter: ActivatedRoute,
    private commentsService: CommentsService
  ) {
    this.loggedIn = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    // Главный поток: параметры URL + желаемое количество комментариев
    combineLatest([
      this.activeRouter.params,
      this.displayedCommentsCount$.pipe(distinctUntilChanged())
    ]).pipe(
      switchMap(([params, desiredCount]) => {
        this.currentUrl = params as CurrentUrlType;
        return this.articlesService.getArticle(params['url']).pipe(
          map((data: ArticleType | DefaultResponseType) => {
            if ('error' in data) {
              throw new Error(data.message || 'Ошибка загрузки статьи');
            }
            return { article: data as ArticleType, desiredCount };
          }),
          catchError(err => {
            console.error(err);
            this._snackBar.open('Не удалось загрузить статью', 'OK', { duration: 4000 });
            return of(null);
          })
        );
      }),
      // Если статья успешно загрузилась, то загружаем комментарии
      switchMap(result => {
        if (!result?.article) return of(null);
        this.article = result.article;
        this.totalCommentsCountFromBack = result.article.commentsCount;
        // Устанавливаем текст статьи
        if (this.articleText) {
          this.articleText.nativeElement.innerHTML = this.article.text;
        }
        const countToLoad = Math.min(result.desiredCount, this.totalCommentsCountFromBack);
        const offset = this.totalCommentsCountFromBack - countToLoad;
        return this.commentsService.getComments(offset, this.article.id).pipe(
          map((data: CommentsType | DefaultResponseType) => {
            if ('error' in data) {
              throw new Error(data.message || 'Ошибка загрузки комментариев');
            }
            return data as CommentsType;
          }),
          catchError(err => {
            console.error(err);
            this._snackBar.open('Не удалось загрузить комментарии', 'OK', { duration: 4000 });
            return of({ comments: [], allCount: 0 });
          })
        );
      })
    ).subscribe((commentsData: {comments: CommentType[], allCount: number} | null) => {
      if (!commentsData) return;

      // Заменяем весь список
      this.comments = [...commentsData.comments].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      this.commentsAllCount = commentsData.allCount;
    });
    // Загрузка связанных статей (независимый поток)
    this.articlesService.getArticlesRelate().subscribe({
      next: (data: ArticlesType[] | DefaultResponseType) => {
        if ('error' in data) {
          console.error(data.message);
          return;
        }
        this.relatedArticles = data;
      },
      error: err => console.error('Ошибка связанных статей', err)
    });
  }

  addComment() {
    if (!this.article || !this.commentText.trim()) return;
    this.commentsService.addComment(this.commentText, this.article.id).subscribe({
      next: (response) => {
        if (response.error) {
          this._snackBar.open(response.message || 'Ошибка добавления', 'OK', { duration: 5000 });
          return;
        }
        // Увеличиваем отображаемое количество → подтянется новый коммент
        const currentCount = this.displayedCommentsCount$.value;
        this.displayedCommentsCount$.next(currentCount + 1);
        this.commentText = '';
        this._snackBar.open('Комментарий добавлен!', 'OK', { duration: 3000 });
      },
      error: err => {
        console.error(err);
        this._snackBar.open('Не удалось добавить комментарий', 'OK', { duration: 5000 });
      }
    });
  }

  changeReaction(commentId: string) {
    if (!this.article) return;
    this.displayedCommentsCount$.next(this.displayedCommentsCount$.value); // триггер перезагрузки
  }

  moreComments() {
    const current = this.displayedCommentsCount$.value;
    const remaining = this.totalCommentsCountFromBack - current;
    if (remaining <= 0) return;
    const addCount = Math.min(10, remaining);
    this.displayedCommentsCount$.next(current + addCount);
  }
}

