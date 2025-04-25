import { Component, inject, signal } from '@angular/core';
import { TabsComponent } from "../../components/tabs/tabs.component";
import { CommonModule, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { OnlinePublishingService } from '../../services/online-publishing.service';
import { BLOGS } from '../../utilities/consts';
import { ArticleCardComponent } from '../../components/article-card/article-card.component';
import { AppState, selectCurrentUser } from '../../store/userData.selector';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [TabsComponent, CommonModule, ArticleCardComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  currentTab = signal<string>('Home');
  tabNames: string[] = ['Home', 'About', 'Following']
  articleService = inject(OnlinePublishingService)
  loggedUser$: any
  store$ = inject(Store<AppState>)
  myDetails: any
  myArticles: any = []
  constructor() {

  }
  ngOnInit(): void {
    this.getMyDetails()
  }
  updateCurrentTab(tab: string) {
    this.currentTab.set(tab)
  }
  getMyDetails() {
    this.store$.select(selectCurrentUser).subscribe(user => {
      this.loggedUser$ = user;
      if (this.loggedUser$?.userUid) {
        this.articleService.getMyAccount(user?.userUid).subscribe(data => {
          this.myDetails = data;
          // console.log(data);
          
          if (data.articles) {
            this.articleService.getArticlesByIds('published', data.articles).subscribe(data => {
              this.myArticles = data?.flat()
            })
          }
        })

      }

    });
  }

  getArticles() {
    this.store$.select(selectCurrentUser).subscribe(user => {
      this.loggedUser$ = user
      this.articleService.getAllArticlesByLoggedInUser(
        'articles','published', this.loggedUser$?.userUid).subscribe(data => {
          // console.log(data);
          // this.articles = data
        })
    })

  }
}
