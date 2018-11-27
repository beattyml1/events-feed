import { Component } from '@angular/core';
import {NgRedux, select} from "@angular-redux/store";
import {AppState} from "./AppState";
import {Observable} from "rxjs";
import {UserService} from "./core/user.service";
import {AuthService} from "./core/auth.service";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'events-feed';
  loggedIn:  boolean;

  constructor(
    private ngRedux: NgRedux<any>,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location : Location) {
    // this.userData$.subscribe(_ => this.loggedIn = !!_);
    authService.afAuth.authState.subscribe(_ => this.loggedIn = !!_);
  }

  logout(){
    this.authService.doLogout()
      .then((res) => {
      }, (error) => {
        console.log("Logout error", error);
      });
  }
}
