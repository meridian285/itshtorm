import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {UserService} from "../../services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {UserInfoType} from "../../../types/user-info.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  selectedMenu: string | null = null;
  isLogged: boolean = true;
  userInfo: UserInfoType | null = null;

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private userService: UserService,
  ) {
  }

  ngOnInit(): void {

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;

      if (this.isLogged) {
          this.userService.getUserInfo()
            .subscribe((data: UserInfoType | DefaultResponseType)=> {
              if ((data as DefaultResponseType).error !== undefined) {
                const error = (data as DefaultResponseType).message;
                throw new Error(error);
              }

              this.userInfo = data as UserInfoType;
            })
      }
    });
  }

  scrollToElement(event: Event, elementId: string, item: string): void {
    event.preventDefault();
    this.selectedMenu = item;

    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 1);
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        }
      })
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

}
