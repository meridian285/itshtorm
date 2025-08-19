import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {AuthService} from "../../../core/auth/auth.service";
import {LoginResponseType} from "../../../types/login-response.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {UserInfoType} from "../../../types/user-info.type";
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userInfo: UserInfoType | null = null;

  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
  }


  login() {
    if (this.loginForm && this.loginForm.value.email && this.loginForm.value.password) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe({
          next: (data: LoginResponseType | DefaultResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message

            }

            const loginResponse: LoginResponseType = (data as LoginResponseType);
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Ошибка авторизации';
            }

            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
            this.authService.isLogged = true;
            this.getUserInfo();
            this._snackBar.open('Вы успешно авторизовались');
            this.router.navigate(['/']);

          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка авторизации');
            }
          }
        })
    }
  }

  getUserInfo() {
    if (this.authService.isLogged) {
      this.userService.getUserInfo()
        .subscribe({
          next: (data: UserInfoType | DefaultResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message
            }

            this.userInfo = data as UserInfoType;
            console.log(this.userInfo)

          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка авторизации');
            }
          }
        })
    }

  }
}
