import {Action, AnyAction} from "redux";
import {Injectable} from "@angular/core";

@Injectable()
export class UserActions {
  static SET_USER_DATA = 'SET_USER_DATA';

  static setUserData(payload): Action&AnyAction {
    return { type: UserActions.SET_USER_DATA, payload };
  }
}
