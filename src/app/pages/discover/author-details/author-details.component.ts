import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ArticleCardComponent } from '../../../components/article-card/article-card.component';
import { OnlinePublishingService } from '../../../services/online-publishing.service';
import { TabsComponent } from '../../../components/tabs/tabs.component';
import { BLOGS } from '../../../utilities/consts';
import { AppState, selectCurrentUser } from '../../../store/userData.selector';

@Component({
  selector: 'app-author-details',
  standalone: true,
  imports: [NgClass, NgFor, ArticleCardComponent, NgIf,TabsComponent,DatePipe],
  templateUrl: './author-details.component.html',
  styleUrl: './author-details.component.scss'
})
export class AuthorDetailsComponent {
  id = input<string>()
  currentTab = signal<string>('Home');
  tabNames: string[] = ['Home', 'About', 'Following']
  articleService = inject(OnlinePublishingService)
  loggedUser$: any
  authorDetails: any
  store$ = inject(Store<AppState>)
  articles: any = [];
  isFollowing: boolean = false
  constructor() {
    effect(() => {
      this.getArticles(this.id());
    })
  }
  ngOnInit(): void {
    // console.log(this.id(),this.currentTab());

  }
  updateCurrentTab(tab: string) {
    this.currentTab.set(tab)
    // console.log(tab);
    

  }
  getAuthorName() {
    return this.id()?.replace(/-/g, ' ')
  }
  getArticles(id?:string) {
    this.store$.select(selectCurrentUser).subscribe(user => {
      // console.log(user);
      
      this.loggedUser$ = user
      if (this.loggedUser$?.userUid) {
        this.articleService.getMyAccount(this.id()).subscribe(data => {
        
          this.authorDetails = data;
          this.isUserFollowing(this.authorDetails?.userUid)
          if (data?.articles) {
            this.articleService.getArticlesByIds('published', data.articles).subscribe(data => {
              this.articles = data?.flat()
            })
          }
        })
      }
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

  followUser() {
    if (!this.isFollowing) {
      this.articleService.followAuthor('follow', this.authorDetails?.userUid, this.loggedUser$?.userUid).subscribe(data => {
        this.getArticles()
      })
    } else {
      this.articleService.followAuthor('unfollow', this.authorDetails?.userUid, this.loggedUser$?.userUid).subscribe(data => {
        this.getArticles()
      })
    }

  }
}
