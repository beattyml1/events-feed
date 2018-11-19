import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EventListComponent} from "./event-list/event-list.component";
import {EventViewComponent} from "./event-view/event-view.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./core/auth.guard";
import {RegisterComponent} from "./register/register.component";
import {UserComponent} from "./user/user.component";
import {UserResolver} from "./user/user.resolver";
import {LoggedinGuard} from "./core/loggedin.guard";

const routes: Routes = [
  { path: '', component: EventListComponent, pathMatch: 'full' },
  { path: 'events/:id', component: EventViewComponent }, //redirectTo: 'login',
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent,  resolve: { data: UserResolver}, canActivate: [LoggedinGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
