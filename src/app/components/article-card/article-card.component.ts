import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OnlinePublishingService } from '../../services/online-publishing.service';
import { AppState, selectCurrentUser } from '../../store/userData.selector';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [RouterModule, DatePipe, NgClass,NgIf],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss'
})
export class ArticleCardComponent {
  router = inject(Router);
  isToolsShow:boolean=false
  data: any = input();
  isSaved: boolean = false
  isDrafted:boolean=false;
  isScheduled:boolean=false
  @Output() refreshEvent = new EventEmitter<boolean>()
  articleService = inject(OnlinePublishingService)
  private store = inject(Store<AppState>)
  constructor() {
    effect(() => {
      this.isSavedArticle(this.data()?._id)
    })
  }
  ngOnInit(): void {
    this.readingTime()
  }
  readingTime() {
    const text: any = document.getElementById("article")?.innerText;
    const wpm = 300;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    return time
  }
  navigate(_id: string, views: number) {
    this.router.navigate(['discover', 'article-details', _id, views])
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
            this.isSavedArticle(this.data()?._id)
            this.refreshEvent.emit(true)
          })
        } else {
          this.articleService.addToSaved(articleId, data?.userUid).subscribe(data => {
            this.isSavedArticle(this.data()?._id)
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
        this.articleService.isSavedArticle('drafts',data?.userUid, id).subscribe(data => {
          this.isDrafted = data
        })
        this.articleService.isSavedArticle('scheduled',data?.userUid, id).subscribe(data => {
          this.isScheduled = data
        })
      }
    })

  }
  deleteDraftArticle(id:any){
    this.store.select(selectCurrentUser).subscribe(data => {
      this.articleService.deleteArticlesFromCollection('drafted',data?.userUid, id).subscribe(data=>{
        this.refreshEvent.emit(true)
      })
    })
  }
  publishArticle(id:any){
    this.store.select(selectCurrentUser).subscribe(data=>{
      this.articleService.updateArticleCollection(data?.userUid,id).subscribe(data=>{
        this.refreshEvent.emit(true)
      })
    })
  }
  ediArticle(id:any){
    this.router.navigate(['article','edit',id])
  }
}
