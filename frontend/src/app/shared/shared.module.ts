import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';



@NgModule({
  declarations: [
    ArticleCardComponent,
    ModalDialogComponent
  ],
  exports: [
    ArticleCardComponent
  ],
  imports: [
    RouterModule,
    FormsModule,
    CommonModule
  ]
})
export class SharedModule { }
