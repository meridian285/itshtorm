import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ArticleComponent} from "./article/article.component";
import {BlogComponent} from "./blog/blog.component";

const routes: Routes = [
  {path: 'articles', component: BlogComponent},
  {path: 'articles/:url', component: ArticleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
