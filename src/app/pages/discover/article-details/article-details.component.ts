import { Component, effect, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { OnlinePublishingService } from '../../../services/online-publishing.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ReaderCardComponent } from '../../../components/reader-card/reader-card.component';
import { SidebarModule } from 'primeng/sidebar';
import { CommentsComponent } from "./comments/comments.component";
import { Store } from '@ngrx/store';
import { AppState, selectCurrentUser } from '../../../store/userData.selector';
import { NoDataComponent } from "../../../components/no-data/no-data.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [NgFor, ReaderCardComponent, DatePipe, SidebarModule, NgIf, CommentsComponent, NoDataComponent,RouterLink],
  templateUrl: './article-details.component.html',
  styleUrl: './article-details.component.scss'
})
export class ArticleDetailsComponent {
  articleName = input<string>();
  title: any;
  sidebarVisible2: boolean = false
  readersChoices: any
  currentData: any;
  editorContent: any
  articleService = inject(OnlinePublishingService)
  sanitizer = inject(DomSanitizer)
  views = input<any>();
  isFollowing: boolean = false
  store$ = inject(Store<AppState>)
  loggedUser$: any
  constructor() {
    effect(() => {
      this.getData(this.articleName());
    })
  }
  ngOnInit(): void {
   
    this.articleService.handlePageViews(this.articleName())

  }
  getData(id: any) {
    this.store$.select(selectCurrentUser).subscribe(user => {
      this.loggedUser$ = user;
      this.articleService.getArticleById('published', id).subscribe(data => {
        // console.log(data);/
        
        this.currentData = data[0];
        this.editorContent = this.transformHtml();
     
        this.isUserFollowing(this.currentData?.authorId)
        if(this.currentData){
          this.articleService.getAllArticles().subscribe((data:any[]) => {
            // console.log(data);
            this.readersChoices = data?.splice(0,3)
          });
        }
      })
    })


  }

  isUserFollowing(id: any) {


    this.articleService.getMyAccount(this.loggedUser$?.userUid).subscribe(data => {
      if (data && data.following && Array.isArray(data.following)) {
        this.isFollowing = data.following.includes(id);
      } else {
        this.isFollowing = false;
      }

    })
  }

  transformHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.currentData?.editorContent);
  }
  openComments() {
    this.sidebarVisible2 = true
  }
  followUser() {
    if (!this.isFollowing) {
      this.articleService.followAuthor('follow', this.currentData?.authorId, this.loggedUser$?.userUid).subscribe(data => {
        this.getData(this.articleName())
      })
    } else {
      this.articleService.followAuthor('unfollow', this.currentData?.authorId, this.loggedUser$?.userUid).subscribe(data => {
        this.getData(this.articleName())
      })
    }

  }
}

