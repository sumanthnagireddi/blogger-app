import { NgFor, NgIf } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { NoDataComponent } from '../../../components/no-data/no-data.component';
import { OnlinePublishingService } from '../../../services/online-publishing.service';
import { BLOGS } from '../../../utilities/consts';
import { ArticleCardComponent } from '../../../components/article-card/article-card.component';
import { AppState, selectCurrentUser } from '../../../store/userData.selector';

@Component({
  selector: 'app-blogs-child',
  standalone: true,
  imports: [ArticleCardComponent, NgFor, NgIf, NoDataComponent],
  templateUrl: './blogs-child.component.html',
  styleUrl: './blogs-child.component.scss',
})
export class BlogsChildComponent {
  category: any = input<string>();
  articles: any = [];
  publishedArticles: any = [];
  articleService = inject(OnlinePublishingService);
  loggedUser$: any;
  store$ = inject(Store<AppState>);
  constructor() {
    effect(() => {
      this.getArticles(this.category());
    });
  }
  ngOnInit(): void {}
  getArticles(category: any) {
    this.articles=[]
    this.store$.select(selectCurrentUser).subscribe((user) => {
      if (category != 'saved') {
        this.articleService
          .getAllArticlesByLoggedInUser(
            category == 'published'
              ? 'articles'
              : category == 'drafts'
              ? 'drafts'
              : 'scheduled',
            category == 'published'
              ? 'published'
              : category == 'drafts'
              ? 'drafted'
              : 'scheduled',
            user?.userUid
          )
          .subscribe((data) => {
            this.articles = data?.flat();
          });
      } else {
        this.articleService
          .getAllSavedArticlesByLoggedInUser('published', user?.userUid)
          .subscribe((data) => {
            this.articles = data?.flat();
          });
      }
    });
  }
}
