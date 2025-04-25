import { Component, inject } from '@angular/core';
import { AuthorCardComponent } from "../../components/author-card/author-card.component";
import { FeatureCardComponent } from "../../components/feature-card/feature-card.component";
import { NoDataComponent } from "../../components/no-data/no-data.component";
import { ReaderCardComponent } from "../../components/reader-card/reader-card.component";
import { CommonModule, NgFor } from '@angular/common';
import { BLOGS } from '../../utilities/consts';
import { ArticleCardComponent } from '../../components/article-card/article-card.component';
import { Store } from '@ngrx/store';
import { timer, map, Observable } from 'rxjs';
import { OnlinePublishingService } from '../../services/online-publishing.service';
import { AppState, selectCurrentUser } from '../../store/userData.selector';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ArticleCardComponent, AuthorCardComponent, FormsModule, FeatureCardComponent, NoDataComponent, ReaderCardComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  popular_blogs: any = [];
  selectedId: string = '';
  currentFeaturedBlog: any
  source$ = timer(1000, 5000);
  pageSize = 5;
  currentPage = 1;
  sort_criteria: any = 'most_recent'
  totalPages = 0;
  currentItems: any = []
  articleService = inject(OnlinePublishingService)
  store = inject(Store<AppState>);
  currentuser: any
  currentUser$: Observable<any> | undefined;
  ngOnInit(): void {
    this.getArticles()
  }
  getArticles() {
    this.store.select(selectCurrentUser).subscribe(data => {
      if (data) {
        this.currentuser = data
        this.articleService.getAllArticles().subscribe(data => {
          this.currentFeaturedBlog = data[0]
          this.popular_blogs = data
          this.totalPages = Math.ceil(this.popular_blogs.length / this.pageSize);
          const sortedBlogs: any = this.popular_blogs.sort((a: any, b: any) => b.views - a.views);

          this.source$.pipe(
            map(() => sortedBlogs.slice(0, 3)?.[Math.floor(Math.random() * sortedBlogs?.length)]),
          ).subscribe(data => {
            this.currentFeaturedBlog = data
          })
          this.loadItems();

        })
      }
    })

  }
  greet() {
    const time = new Date();
    const hours = time.getHours();
    if (hours < 12) {
      return `Good Morning`
    } else if (hours < 18) {
      return 'Good Afternoon'
    } else {
      return 'Good Evening'
    }
  }

  loadItems() {
    let sortedBlogs = [...this.popular_blogs];
    sortedBlogs = sortedBlogs.map(blog => ({
      ...blog,
      date: new Date(blog.published)
    }));
    switch (this.sort_criteria) {
      case 'most_recent':
        sortedBlogs.sort((a, b) => b.date.getTime() - a.date.getTime());
        break;
      case 'oldest':
        sortedBlogs.sort((a, b) => a.date.getTime() - b.date.getTime());
        break;
      case 'popular':
        sortedBlogs.sort((a, b) => b.views - a.views);
        break;
    }

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.currentItems = sortedBlogs.slice(start, end);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadItems();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadItems();
    }
  }
  getToValue() {
    return Math.min(this.currentPage * this.pageSize, this.popular_blogs?.length)
  }
  filter() {
    this.loadItems()
  }
}
