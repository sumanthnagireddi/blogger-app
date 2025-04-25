import { createSelector } from '@ngrx/store';

export interface AppState {
    user: UserState;
}

export interface UserState {
    user: any;
}

export const selectUserState = (state: AppState) => state?.user

export const selectCurrentUser = createSelector(
    selectUserState,
    (state: UserState) => {
        return state.user; 
    }
);

export const selectIsAuthenticated = createSelector(
    selectCurrentUser,
    (user: any) => {
        // console.log('Current User:', user); 
        return !!user; 
    }
);
