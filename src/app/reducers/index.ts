import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
} from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import * as fromUser from '../store/userData.reducer';
export interface State {
  user: fromUser.UserState;
}

export const reducers: ActionReducerMap<State> = {
  user: fromUser.userReducer,
};

export function localStorageSyncReducer(reducer: any) {
  return localStorageSync({ keys: ['user'], rehydrate: true })(reducer);
}

export const metaReducers: Array<MetaReducer<any, any>> = [
  localStorageSyncReducer,
];
