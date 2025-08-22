import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import {CommentComponent} from "./components/comment/comment.component";



@NgModule({
    declarations: [
        ArticleCardComponent,
        ModalDialogComponent,
        CommentComponent,
        CommentComponent
    ],
    exports: [
        ArticleCardComponent,
        CommentComponent
    ],
  imports: [
    RouterModule,
    FormsModule,
    CommonModule
  ]
})
export class SharedModule { }
