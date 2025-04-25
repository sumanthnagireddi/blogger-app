import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OnlinePublishingService } from '../../services/online-publishing.service';
import { AppState, selectCurrentUser } from '../../store/userData.selector';
import { DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  imports: [NgIf,DatePipe],
  templateUrl: './feature-card.component.html',
  styleUrl: './feature-card.component.scss'
})
export class FeatureCardComponent {
  featuredData = input<any>();
  router = inject(Router)
  isSaved: boolean = false
  @Output() refreshEvent = new EventEmitter<boolean>()
  articleService = inject(OnlinePublishingService)
  private store = inject(Store<AppState>)
  constructor() {
    effect(() => {
      this.isSavedArticle(this.featuredData()?._id)
    })
  }
  ngOnInit(): void {
  }
  navigate(title: string) {
    this.router.navigate(['discover', 'article-details', this.featuredData()?._id,this.featuredData()?.views])
  }
  navigateToAuthorPage(author: string) {
    this.router.navigate(['discover', 'author-details', author])
  }
  addTosave(articleId: any) {
    this.store.select(selectCurrentUser).subscribe(data => {
      // console.log(data);
      if (data) {
        if (this.isSaved) {
          this.articleService.removeFromSaved(articleId, data?.userUid).subscribe(data => {
            this.isSavedArticle(this.featuredData()?._id)
            this.refreshEvent.emit(true)
          })
        } else {
          this.articleService.addToSaved(articleId, data?.userUid).subscribe(data => {
            this.isSavedArticle(this.featuredData()?._id)
            this.refreshEvent.emit(true)
          })
        }
      }
    })

  }
  isSavedArticle(id: any) {
    this.store.select(selectCurrentUser).subscribe(data => {
      if (data) {
        this.articleService.isSavedArticle('saved',data?.userUid, id).subscribe(data => {
          this.isSaved = data
        })
      }
    })

  }
}
