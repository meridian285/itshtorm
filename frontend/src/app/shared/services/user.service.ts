import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AuthService} from "../../core/auth/auth.service";
import {Observable, throwError} from "rxjs";
import {UserInfoType} from "../../types/user-info.type";
import {DefaultResponseType} from "../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  getUserInfo(): Observable<UserInfoType | DefaultResponseType> {
    const tokens = this.authService.getTokens();
    let headers: HttpHeaders = new HttpHeaders()

    if (tokens && tokens.accessToken) {
      headers.set("x-auth", tokens.accessToken);
      return this.http.get<UserInfoType | DefaultResponseType>(environment.api + 'users', {headers: headers});
    }

    throw throwError(() => 'Can not find token');
  }
}
