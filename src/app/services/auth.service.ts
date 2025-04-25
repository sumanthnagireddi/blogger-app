import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { from, map, switchMap, tap, catchError, throwError, finalize, Observable } from 'rxjs';
import { ToastType, UtilityService } from '../utilities/services/utility.service';
import { login, logout } from '../store/userData.action';
import { AppState } from '../store/userData.selector';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebase = inject(Auth);
  firestore = inject(Firestore);
  toastService = inject(UtilityService)
  storage: Storage = localStorage
  router = inject(Router)
  store = inject(Store<AppState>)
  constructor() { }

  registerUser(email: string, username: string, password: string) {
    this.toastService.show()
    const promise = createUserWithEmailAndPassword(this.firebase, email, password)
    return from(promise).pipe(
      map(response => {
        return updateProfile(response.user, { displayName: username }).then(() => response);
      }),
      switchMap(response => from(response)),
      switchMap(response =>
        this.createAccountInFirestore({ userUid: response.user.uid, email, username, joinedOn: response.user.metadata.creationTime, photoUrl: response.user.photoURL }).pipe(map(() => response),)
      ),
      switchMap(response =>
        from(response.user.getIdToken()).pipe(
          switchMap(token => this.addAccessTokenToLocalStorage(token).pipe(
            map(() => response)
          )),
        )
      ),
      catchError(error => {
        this.toastService.addToToast({ type: ToastType.error, message: error.message });
        return throwError(error)
      }),
      finalize(() => {
        this.toastService.hide()
      })
    );
  }
  loginWithUserNameandPassword(email: string, password: string): Observable<any> {
    this.toastService.show()
    const promise = signInWithEmailAndPassword(this.firebase, email, password);
    return from(promise).pipe(
      map((response: any) => response),
      switchMap(response =>
        this.createAccountInFirestore({ userUid: response.user.uid, email, username: response.user.email || '', joinedOn: response.user.metadata.creationTime, photoUrl: response.user.photoURL }).pipe(
          map(() => response)
        )
      ),
      switchMap(response =>
        from(response.user.getIdToken()).pipe(
          switchMap(token => this.addAccessTokenToLocalStorage(token).pipe(
            map(() => response)
          ))
        )
      ),
      catchError(error => {
        this.toastService.addToToast({ type: ToastType.error, message: error.message });
        return throwError(error)
      }),
      finalize(() => {
        this.toastService.hide()
      })
    )
  }
  loginWithProvider(provider: string): Observable<any> {
    this.toastService.show()
    const promise = signInWithPopup(this.firebase, provider == 'google' ? new GoogleAuthProvider() : new GithubAuthProvider());
    return from(promise).pipe(
      map((response: any) => response),
      switchMap(response =>
        this.createAccountInFirestore({ userUid: response.user.uid, email: response.user.email || '', username: response.user.displayName || '', joinedOn: response.user.metadata.creationTime, photoUrl: response.user.photoURL || '' }).pipe(
          map(() => response)
        )
      ),
      switchMap(response =>
        from(response.user.getIdToken()).pipe(
          switchMap(token => this.addAccessTokenToLocalStorage(token).pipe(
            map(() => response)
          ))
        )
      )
      ,
      finalize(() => {
        this.toastService.hide()
      })
    )
  }
  createAccountInFirestore(payload: any): Observable<any> {
    this.toastService.show()
    const userDocRef = doc(this.firestore, 'userAccounts', payload.userUid);
    this.store.dispatch(login({ ...payload }))


    return from(getDoc(userDocRef)).pipe(
      switchMap(docSnap => {
        if (!docSnap.exists()) {
          return from(setDoc(userDocRef, payload)).pipe(
            // tap(() => console.log('Account created successfully'))
          );
        } else {
          // console.log('Account already exists');
          return from(Promise.resolve(null));
        }
      }),
      finalize(() => {
        this.toastService.hide()
      })
    )

  }

  addAccessTokenToLocalStorage(token: any): Observable<void> {
    return new Observable(observer => {
      try {
        this.storage.setItem("token", token);
        observer.next();
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    })
  }

  isLoggedIn(): boolean {
    if (!localStorage.getItem('token')) {
      return false
    }
    return true
  }

  logout(): Observable<any> {
    this.toastService.show()
    const signoutPromise = signOut(this.firebase);
    return from(signoutPromise).pipe(
      tap(() => {
        this.store.dispatch(logout())
        localStorage.removeItem('user');
        this.router.navigate(['login'])
      }),
      tap(() => {
        this.store.dispatch(logout());
      })
      ,
      finalize(() => {
        this.toastService.hide()
      })
    )
  }
}
