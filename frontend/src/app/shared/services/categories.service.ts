import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AuthService} from "../../core/auth/auth.service";
import {Observable} from "rxjs";
import {CategoryWithCheckedType} from "../../types/categoryWithChecked.type";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient,) {
  }

  getCategories(): Observable<CategoryWithCheckedType[]> {
    return this.http.get<CategoryWithCheckedType[]>(environment.api + 'categories')
  }
}
