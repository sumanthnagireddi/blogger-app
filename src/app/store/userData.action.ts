import { createAction, props } from "@ngrx/store";


export const login = createAction('login', (user: any) => ({ user }))
export const logout = createAction('logout')