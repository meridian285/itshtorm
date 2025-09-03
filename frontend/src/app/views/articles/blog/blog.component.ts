import {Component, OnInit} from '@angular/core';
import {ArticlesType} from "../../../types/articles.type";
import {ArticlesService} from "../../../shared/services/articles.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ArticlesWithFilterType} from "../../../types/articles-with-filter.type";
import {ActiveParamsType} from "../../../types/active-params.type";
import {ActivatedRoute, Router} from "@angular/router";
import {CategoriesType} from "../../../types/categories.type";
import {CategoriesService} from "../../../shared/services/categories.service";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {AppliedFilterType} from "../../../types/applied-filter.type";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  articles: ArticlesType[] | null = null;
  sortingOpen = false;
  categories: CategoriesType[] | null = null;
  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType[] = [];

  pages: number[] = [];

  sortingOptions: CategoriesType[] = [];

  constructor(private articlesService: ArticlesService,
              private router: Router,
              private categoriesService: CategoriesService,
              private activatedRouter: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.categoriesService.getCategories()
      .subscribe((data: CategoriesType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }
        this.sortingOptions = data as CategoriesType[];
      });

    this.activatedRouter.queryParams.subscribe(params => {
      this.activeParams = ActiveParamsUtil.processParams(params);

      this.appliedFilters = [];
      this.activeParams.categories?.forEach(url => {

        const foundType = this.sortingOptions.find(category => category.url === url);
        if (foundType) {
          this.appliedFilters.push({
            name: foundType.name,
            urlParam: foundType.url,
          });
        }
      })

      this.articlesService.getArticles(this.activeParams)
        .subscribe((data: ArticlesWithFilterType | DefaultResponseType) => {
          // this.pages = [];
          // for (let i = 1; i <= data.pages; i++) {
          //   this.pages.push(i);
          // }
          if ((data as DefaultResponseType).error !== undefined) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }
          const items = data as ArticlesWithFilterType;

          this.articles = items.items as ArticlesType[];

        })
    })

  }

  toggleSorting(value: boolean) {
    this.sortingOpen = value;
  }

  sort(value: string) {
    this.activeParams.categories = [value];

    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

  updateFilterParam(url: string, value: boolean) {

    if(this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingTypeInParams = this.activeParams.categories.find(item => item === url);
      if (existingTypeInParams && !value) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
      } else if (!existingTypeInParams && value) {
        this.activeParams.categories.push(url);
      }
    } else if (value) {
      this.activeParams.categories = [url];
    }


    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }
}
