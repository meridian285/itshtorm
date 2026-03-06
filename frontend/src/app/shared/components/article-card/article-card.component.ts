import {Component, Input, OnInit} from '@angular/core';
import {ArticlesType} from "../../../types/articles.type";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {

  @Input() card: ArticlesType;

  constructor() {
    this.card = {
      id: '',
      title: '',
      description: '',
      image: '',
      date: '',
      category: '',
      url: ''
    }
  }

  ngOnInit(): void {
  }

}
