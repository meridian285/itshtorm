import {ArticlesType} from "./articles.type";

export type ArticlesWithFilterType = {
  count: number,
  pages: number,
  items: ArticlesType[]
}
