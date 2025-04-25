import { createReducer, on } from '@ngrx/store';
import { login, logout } from './userData.action';

export interface UserState {
    user: any;
}

export const initialUserState: UserState = {
    user: null
};

export const userReducer = createReducer(
    initialUserState,
    on(login, (state, { user }) => {
        // console.log('Login Action:', user);
        return { ...state, user };
    }),
    on(logout, (state) => {
        // console.log('Logout Action');
        return { ...state, user: null };
    })
);
