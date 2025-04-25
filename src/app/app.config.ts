import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { META_REDUCERS, MetaReducer, provideStore } from '@ngrx/store';
import { provideQuillConfig } from 'ngx-quill/config';
import { TOOLBAR } from './utilities/consts';
import { provideAnimations } from '@angular/platform-browser/animations';
import { userReducer } from './store/userData.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { localStorageSync } from 'ngrx-store-localstorage';

export function localStorageSyncReducer(reducer: any) {
  return localStorageSync({ keys: ['user'], rehydrate: true })(reducer);
}
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideFirebaseApp(() => initializeApp({
      projectId: 'sumanth-article-publishing',
      appId: '1:706459179395:web:49b792b0df61bbab90feb6',
      databaseURL: 'https://sumanth-article-publishing-default-rtdb.asia-southeast1.firebasedatabase.app',
      storageBucket: 'sumanth-article-publishing.appspot.com',
      apiKey: 'AIzaSyBOx93nJBARMmyrnSK6LOGIY7lUhIEfvVw',
      authDomain: 'sumanth-article-publishing.firebaseapp.com',
      messagingSenderId: '706459179395',
      measurementId: 'G-W53E4QHKT3',
    })),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideStore({ user: userReducer },{metaReducers}),
    provideAnimations(),
    provideQuillConfig({
      modules: {
        syntax: false,
        toolbar: TOOLBAR,
      },
    }),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true
    })
  ],
};
