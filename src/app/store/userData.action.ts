import { createAction, props } from '@ngrx/store';

export enum UserActionTypes {
  login = '[UserAuth] login',
  logut = '[UserAuth] logout',
}

export const login = createAction(UserActionTypes.login, props<{user:any}>())
export const logout = createAction(UserActionTypes.logut);
