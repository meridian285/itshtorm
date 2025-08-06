import {NgModule} from "@angular/core";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {CommonModule} from "@angular/common";
import {UserRoutingModule} from "./user-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
