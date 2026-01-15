import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AuthService} from "../../core/auth/auth.service";
import {map, Observable} from "rxjs";
import {DefaultResponseType} from "../../types/default-response.type";
import {CategoriesType} from "../../types/categories.type";
import {CategoryWithCheckedType} from "../../types/categoryWithChecked.type";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  getCategories(): Observable<CategoryWithCheckedType[]> {
    return this.http.get<CategoryWithCheckedType[]>(environment.api + 'categories')
  }
}
