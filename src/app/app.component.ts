import { Component } from '@angular/core';
import {NgRedux, select} from "@angular-redux/store";
import {AppState} from "./AppState";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'events-feed';
  @select((s: AppState) => s.userData) userData$: Observable<any>;

  constructor(private ngRedux: NgRedux<any>) {

  }
}
