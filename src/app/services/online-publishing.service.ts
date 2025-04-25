import { inject, Injectable } from '@angular/core';
import { arrayRemove, arrayUnion, collection, doc, Firestore, getDoc, getDocs, increment, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable, from, map, switchMap, forkJoin, catchError, of, throwError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnlinePublishingService {
  firestore = inject(Firestore);
  constructor() { }

  // returns all the articles from database
  getAllArticles(): Observable<any> {
    const articleRef = collection(this.firestore, 'articles');
    const articlesQuery = query(articleRef, where("status", "==", 'published'));
    return from(getDocs(articlesQuery)).pipe(
      map(querySnapshot =>
        querySnapshot.docs.map(doc => doc.data())
      )
    );
  }

  //gets my account
  getMyAccount(userId: any): Observable<any> {
    const userAccountRef = doc(this.firestore, 'userAccounts', userId);
    return from(getDoc(userAccountRef)).pipe(
      map(doc => {
        return doc.data()
      }))
  }

  // returns all the articles by logged in user
  getAllArticlesByLoggedInUser(collection: string, category: string, userID: string): Observable<any> {
    // console.log(collection, category);

    const articleRef = doc(this.firestore, 'userAccounts', userID);
    return from(getDoc(articleRef)).pipe(
      map(res => {

        const userAccountData = res.data();
        return userAccountData?.[collection]
      }),
      switchMap(articleIds => this.getArticlesByIds(category, articleIds))
    )
  }

  // get all saved articles by loggdein user
  getAllSavedArticlesByLoggedInUser(category: string, userID: string): Observable<any> {
    // console.log(category);

    const articleRef = doc(this.firestore, 'userAccounts', userID);
    return from(getDoc(articleRef)).pipe(
      map(res => {
        const userAccountData = res.data();
        return userAccountData?.['saved'] || []
      }),
      switchMap(articleIds => this.getArticlesByIds(category, articleIds))
    )
  }

  // get group of articles at one go based on array of IDs
  getArticlesByIds(category: string, articleIds: string[]): Observable<any[]> {
    // console.log(articleIds);

    const articleRequests = articleIds.map(id => this.getArticleById(category, id))
    return forkJoin(articleRequests)
  }

  // get single article based on id and category
  getArticleById(category: string, id: string): Observable<any[]> {
    const articleRef = collection(this.firestore, 'articles');
    const articlesQuery = query(articleRef, where("status", "==", category), where("_id", "==", id));

    return from(getDocs(articlesQuery)).pipe(map(res =>
      res.docs.map(doc => doc.data())
    ))
  }

  // post a article to the user id ka articles array and articles collection
  createArticle(category: string, payload: any): Observable<any> {
    // console.log(category);

    const docRef = doc(this.firestore, 'articles', payload._id);
    return from(setDoc(docRef, payload)).pipe(
      switchMap(() => {
        return this.saveArticleIdToUserAccount(category, docRef.id, payload?.authorId)
      })
    )
  }

  // save article id to userAccount
  saveArticleIdToUserAccount(category: string, id: string, userID: string): Observable<any> {
    // console.log(category);

    const userAccountRef = doc(this.firestore, 'userAccounts', userID);
    let updateData: any = {};

    if (category === 'published') {
      updateData.articles = arrayUnion(id);
    } else if (category === 'drafted') {
      updateData.drafts = arrayUnion(id);
    } else {
      updateData.scheduled = arrayUnion(id);
    }

    return from(updateDoc(userAccountRef, updateData));

  }

  // adds +1 view to the article views
  handlePageViews(articleId: any) {
    return from(updateDoc(doc(this.firestore, 'articles', articleId), {
      views: increment(1)
    }))
  }

  // adds to the saved array of user
  addToSaved(articleId: any, uid: any): Observable<any> {
    const docRef = doc(this.firestore, 'userAccounts', uid);
    return from(updateDoc(docRef, {
      saved: arrayUnion(articleId)
    }))
  }

  // remove the article id from saved array of the user.
  removeFromSaved(articleId: any, uid: any) {
    const docRef = doc(this.firestore, 'userAccounts', uid);
    return from(updateDoc(docRef, {
      saved: arrayRemove(articleId)
    }))
  }

  // checks whether it is saved by user or not
  isSavedArticle(collection: string, userId: any, id: any): Observable<boolean> {
    return this.getMyAccount(userId).pipe(
      map(data => {
        if (data && data[collection] && Array.isArray(data[collection])) {
          return data[collection].includes(id);
        }
        return false;
      }),
      catchError(error => {
        // console.error('Error checking if article is saved:', error);
        return of(false);
      })
    );
  }

  // creates comment and adds into article id
  createComment(payload: any) {
    const articleRef = doc(this.firestore, 'articles', payload.articleId);
    return from(updateDoc(articleRef, {
      comments: arrayUnion(payload)
    })).pipe(
      catchError(error => {
        return throwError(error.message)
      })
    )
  }

  // gets all comments of article ID
  getComments(articleId: string) {
    const commentsRef = collection(this.firestore, 'articles');
    const commentsQuery = query(commentsRef, where("articleId", "==", articleId && articleId));
    return from(getDocs(commentsQuery)).pipe(map(res =>
      res.docs.map(doc => doc.data())
    ))
  }
  followAuthor(method: string, authorId: string, loggedUserId: string): Observable<any> {
    const followUpdate$ = this.updateFollowing(method, loggedUserId, authorId);
    const addFollowers$ = this.updateFollowers(method, authorId, loggedUserId);
    return followUpdate$.pipe(
      switchMap(() => addFollowers$),
      // tap(() => console.log('Follow and add follower operations completed successfully')),
      catchError(error => {
        // console.error('Error in follow and add followers operations:', error);
        return throwError(() => error);
      })
    );
  }
  private updateFollowing(method: string, userId: string, authorId: string): Observable<any> {
    const userAccountRef = doc(this.firestore, 'userAccounts', userId);
    return from(updateDoc(userAccountRef, {
      following: method == 'follow' ? arrayUnion(authorId) : arrayRemove(authorId)
    }));
  }
  private updateFollowers(method: string, authorId: string, loggedUserId: string): Observable<any> {
    const userAccountRef = doc(this.firestore, 'userAccounts', authorId);
    return from(updateDoc(userAccountRef, {
      followers: method == 'follow' ? arrayUnion(loggedUserId) : arrayRemove(loggedUserId)
    }));
  }

  //get author details based on author ID
  getAuthorDetailsByAuthorID(id: string): Observable<any> {
    const articlesRef = doc(this.firestore, 'articles', id);
    return from(getDoc(articlesRef)).pipe(
      map(res => {
        const userAccountData = res.data();
        return userAccountData?.['authorId']
      }),
      switchMap(authorId => this.getMyAccount(authorId))
    )
  }

  //get all authors;
  getAllAuthors(): Observable<any> {
    return from(getDocs(collection(this.firestore, 'userAccounts'))).pipe(
      // tap(querySnapShot => console.log(querySnapShot)),
      map(querySnapshot =>
        querySnapshot.docs.map(doc => doc.data())
      )
    );
  }
  deleteArticlesFromCollection(category: string, authorId: string, articleId: string): Observable<any> {
    const userAccountRef = doc(this.firestore, 'userAccounts', authorId);
    let updateData: any = {};

    if (category === 'published') {
      updateData.articles = arrayRemove(articleId);
    } else if (category === 'drafted') {
      updateData.drafts = arrayRemove(articleId);
    } else {
      updateData.scheduled = arrayRemove(articleId);
    }

    return from(updateDoc(userAccountRef, updateData));

  }
  updateArticleCollection(authorId: string, articleId: string): Observable<any> {
    const userAccountRef = doc(this.firestore, 'userAccounts', authorId);
    let updateData: any = {
      articles: arrayUnion(articleId)
    };
    return this.deleteArticlesFromCollection('scheduled', authorId, articleId).pipe(
      tap(() => this.updateArticleById(articleId)),
      switchMap(() => updateDoc(userAccountRef, updateData))
    );
  }
  updateArticleById(articleId: string): Observable<any> {
    const articleRef = doc(this.firestore, 'articles', articleId);
    let updateData: any = {
      status: 'published'
    };
    return from(updateDoc(articleRef, updateData))
  }

  getArticlesBasedOnTags(tag: any) {
    const articleRef = collection(this.firestore, 'articles');
    const articlesQuery = query(articleRef, where("tags", "array-contains", 'tag'));
    return from(getDocs(articlesQuery)).pipe(
      map(querySnapshot =>
        querySnapshot.docs.map(doc => doc.data())
      )
    );

  }
}
