import {Action} from "redux";
import {Injectable} from "@angular/core";

@Injectable()
export class UserActions {
  static SET_USER_DATA = 'SET_USER_DATA';

  setUserData(): Action {
    return { type: UserActions.SET_USER_DATA };
  }
}
