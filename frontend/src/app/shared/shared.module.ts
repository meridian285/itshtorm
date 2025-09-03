import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import {CommentComponent} from "./components/comment/comment.component";
import {MatSelectModule} from "@angular/material/select";
import {FilterItemComponent} from "./components/filter-item/filter-item.component";



@NgModule({
    declarations: [
        ArticleCardComponent,
        ModalDialogComponent,
        CommentComponent,
        CommentComponent,
        FilterItemComponent
    ],
    exports: [
        ArticleCardComponent,
        CommentComponent,
        ModalDialogComponent,
        FilterItemComponent
    ],
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule
  ]
})
export class SharedModule { }
