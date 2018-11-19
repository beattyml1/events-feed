import {AppState} from "../AppState";
import {Action, AnyAction, combineReducers} from "redux";
import * as actions from '../actions'

export const rootReducer = combineReducers<AppState, Action&{payload}>({userData});

function userData(state: {}, action: Action&{payload}) {
  switch (action.type) {
    case(actions.UserActions.SET_USER_DATA): setUserData(state, action)
    default: return {
    ...state
    }
  }
}

function setUserData(state, action: Action&{payload}) {
  return action.payload
}
