import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { CommentsFormComponent } from './comments-form/comments-form.component';
import { CommentsHolderComponent } from './comments-holder/comments-holder.component';
import { NgFor } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../../services/auth.service';
import { v4 as uuidv4 } from 'uuid'
import { OnlinePublishingService } from '../../../../services/online-publishing.service';
import { AppState, selectCurrentUser } from '../../../../store/userData.selector';
import { FormsModule } from '@angular/forms';
interface Comment {
  _id: string;
  body: string;
  username: string;
  userId: string;
  parentId: string | null;
  createdAt: string;
  children?: Comment[];
}
@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommentsFormComponent, CommentsHolderComponent, NgFor,FormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent {
  service = inject(AuthService);
  private articleService = inject(OnlinePublishingService)
  comments: any = [];
  currentCommentId: any;
  currentArticle = input<any>()
  store$ = inject(Store<AppState>)
  @Output() commentsUpdated = new EventEmitter<any>()
  loggedUser$: any
  sortCriteria: any = 'most_recent'
  constructor() {
    effect(() => {
      this.store$.select(selectCurrentUser).subscribe(user => {
        this.loggedUser$ = user
        // this.getComments(this.currentArticle()?._id)
        this.comments = this.handleComments(this.currentArticle()?.comments)
      })
    })
  }
  ngOnInit(): void {
  }

  getComments(id: any) {
    // this.articleService.getComments(id).subscribe((data) => {
    //   const comments: any = data
    //   this.comments = this.handleComments(comments?.comments)
    // })
  }
  handleComments(comments: Comment[]): Comment[] {

    const commentObj: any = {};
    const topLevelComments: Comment[] = [];

    comments?.forEach(comment => {
      commentObj[comment._id] = { ...comment, children: [] };
    });
    comments?.forEach(comment => {
      if (comment.parentId) {
        const parent = commentObj[comment.parentId];
        if (parent) {
          parent.children?.push(commentObj[comment._id]);
        }
      } else {
        topLevelComments.push(commentObj[comment._id]);
      }
    });
    let sortedComments: any[] = [...topLevelComments];
    sortedComments = sortedComments.map(blog => ({
      ...blog,
      date: new Date(blog.createdAt)
    }));
    // console.log(sortedComments);
    
    switch (this.sortCriteria) {
      case 'most_recent':
        sortedComments.sort((a, b) => b.date.getTime() - a.date.getTime());
        break;
      case 'oldest':
        sortedComments.sort((a, b) => a.date.getTime() - b.date.getTime());
        break;
      case 'most_replied':
        sortedComments.sort((a, b) => b.children?.length - a.children?.length );
        break;
    }
    return sortedComments;

  }
  getComment(event: any) {
    const { body, parentId } = event;
    const payload = {
      "_id": uuidv4(),
      "articleId": this.currentArticle()?._id,
      "body": body,
      "username": this.loggedUser$?.username,
      "userId": this.loggedUser$?.userUid,
      "parentId": parentId,
      "createdAt": new Date().toDateString()
    }
    // console.log(payload);

    // console.log(payload);/
    this.articleService.createComment(payload).subscribe(_ => {
      // console.log("success");
      this.getComments(this.currentArticle()?._id);
      this.commentsUpdated.emit(true)
    })
  }
  filter(){
    this.comments = this.handleComments(this.currentArticle()?.comments)
  }
}
