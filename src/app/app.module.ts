import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventViewComponent } from './event-view/event-view.component';
import {environment} from "../environments/environment";
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import {LoggedinGuard} from "./core/loggedin.guard";
import {AuthGuard} from "./core/auth.guard";
import {UserResolver} from "./user/user.resolver";
import {UserService} from "./core/user.service";
import {AuthService} from "./core/auth.service";
import { NgReduxModule, NgRedux, DevToolsExtension } from '@angular-redux/store';
import { rootReducer } from './reducers';

import {
  MatCheckboxModule, MatInputModule, MatDatepickerModule,MatSlideToggleModule, MatRadioModule, MatSelectModule, // MatAutocompleteModule,  MatSliderModule,
  MatTableModule, MatTabsModule, MatDialogModule, MatCardModule, MatMenuModule, MatFormFieldModule,
  MatDividerModule,  MatIconModule, MatProgressSpinnerModule,
  MatButtonModule, MatButtonToggleModule, MatExpansionModule,
  MatListModule, MatPaginatorModule, MatSidenavModule
} from '@angular/material';
import {UserComponent} from "./user/user.component";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppState} from "./AppState";
import {AnyAction, Reducer} from "redux";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


@NgModule({
  declarations: [
    AppComponent,
    EventListComponent,
    EventViewComponent,
    LoginComponent,
    UserComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgReduxModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule, MatInputModule, MatDatepickerModule,MatSlideToggleModule, MatRadioModule, MatSelectModule, // MatAutocompleteModule,  MatSliderModule,
    MatTableModule, MatTabsModule, MatDialogModule, MatCardModule, MatMenuModule, MatFormFieldModule,
    MatDividerModule,  MatIconModule, MatProgressSpinnerModule, MatExpansionModule,
    MatButtonModule, MatButtonToggleModule,
    MatListModule, MatPaginatorModule, MatSidenavModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
  ],
  providers: [AuthService, UserService, UserResolver, AuthGuard, LoggedinGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<AppState>, reduxDevTools: DevToolsExtension) {
    let enhancers = [];
    // ... add whatever other enhancers you want.

    // You probably only want to expose this tool in devMode.
    if (reduxDevTools.isEnabled()) {
      enhancers = [ ...enhancers, reduxDevTools.enhancer() ];
    }
    ngRedux.configureStore(rootReducer as Reducer<AppState, AnyAction>, { }, [],  enhancers);
  }
}
