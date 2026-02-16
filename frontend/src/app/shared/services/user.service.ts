import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AuthService} from "../../core/auth/auth.service";
import {Observable} from "rxjs";
import {UserInfoType} from "../../types/user-info.type";
import {DefaultResponseType} from "../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,) {
  }

  getUserInfo(): Observable<UserInfoType | DefaultResponseType> {
    return this.http.get<UserInfoType | DefaultResponseType>(environment.api + 'users');
  }
}
