import { NgFor, NgIf } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { OnlinePublishingService } from '../../services/online-publishing.service';
import { ArticleCardComponent } from "../../components/article-card/article-card.component";
import { NoDataComponent } from "../../components/no-data/no-data.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [NgFor, ArticleCardComponent, NgIf, NoDataComponent],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss'
})
export class TagsComponent {
  tag = input();
  articles: any = [];
  articleService = inject(OnlinePublishingService);
  tags: any = []
  router = inject(Router)
  constructor() {
    effect(() => {
      this.getArticles()
    })
  }
  getArticles() {
    this.articleService.getAllArticles().subscribe(data => {
      this.articles = data?.filter((data: any) => data?.tags?.includes(this.tag()));
    })
  }
  navigateToKeyword(tag: string) {
    // window.location.reload()
    this.router.navigate(['discover', 'tags', tag]);
  }

}
