import {Component, OnInit} from '@angular/core';
import {NgbCarouselConfig} from "@ng-bootstrap/ng-bootstrap";
import {OwlOptions} from "ngx-owl-carousel-o";
import {FavoriteService} from "../../shared/services/favorite.service";
import {ArticlesType} from "../../types/articles.type";
import {DefaultResponseType} from "../../types/default-response.type";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  type: string = '';
  favoriteArticles: ArticlesType[] | null = null;
  selectedPoint: string = '';

  isDialogOpen = false;

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
  services = [
    {
      title: 'Создание сайтов',
      image: 'creating-sites.png',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: '7 500'
    },
    {
      title: 'Продвижение',
      image: 'promotion.png',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: '3 500'
    },
    {
      title: 'Реклама',
      image: 'img.png',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: '1 000'
    },
    {
      title: 'Копирайтинг',
      image: 'copywriting.png',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: '750'
    }
  ]

  images = [
    '@import "../../../assets/images/slider/img1.png',
    '@import "../../../assets/images/slider/img2.png',
    '@import "../../../assets/images/slider/img3.png'
  ];

  constructor(config: NgbCarouselConfig,
              private favorites: FavoriteService) {
    //интервал смены слайдера
    config.interval = 10000;
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

  open(type: string, value: string): void {
    this.type = type;
    this.selectedPoint = value;
    this.isDialogOpen = true;
  }
}
