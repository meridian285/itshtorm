import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {ArticlesWithFilterType} from "../../types/articles-with-filter.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }


  request(name: string, phone: string, service: string, type: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', {
      name: name,
      phone: phone,
      service: service,
      type: type
    });
  }
}
