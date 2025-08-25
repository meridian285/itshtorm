import {Component, OnInit} from '@angular/core';
import {NgbCarouselConfig} from "@ng-bootstrap/ng-bootstrap";
import {OwlOptions} from "ngx-owl-carousel-o";
import {FavoriteService} from "../../shared/services/favorite.service";
import {ArticlesType} from "../../types/articles.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {RequestService} from "../../shared/services/request.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  type: string = '';
  isOpenModal: boolean  = false;
  favoriteArticles: ArticlesType[] | null = null;
  selectedPoint: string = '';

  reviews = [
    {
      name: 'Станислав',
      image: 'review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'

    },
    {
      name: 'Алёна',
      image: 'review2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    }
  ];
  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 26,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false
  }

  images = [
    '@import "../../../assets/images/slider/img1.png',
    '@import "../../../assets/images/slider/img2.png',
    '@import "../../../assets/images/slider/img3.png'
  ];

  constructor(config: NgbCarouselConfig,
              private favorites: FavoriteService,
              private requestService: RequestService

  ) {
    //интервал смены слайдера
    config.interval = 100000;
  }

  ngOnInit(): void {
    this.favorites.getTopArticles()
      .subscribe({
        next: (data: ArticlesType[] | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }

          this.favoriteArticles = data as ArticlesType[];
        },
        error: (error) => {

        }
      })
  }

  open(type: string, value: string) {
    this.type = type;
    this.isOpenModal = true;
    this.selectedPoint = value;

  }
}
