import { Component, inject } from '@angular/core';
import { SearchComponent } from '../../../components/search/search.component';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthorCardComponent } from '../../../components/author-card/author-card.component';
import { ReaderCardComponent } from '../../../components/reader-card/reader-card.component';
import { OnlinePublishingService } from '../../../services/online-publishing.service';

@Component({
  selector: 'app-discover-home',
  standalone: true,
  imports: [SearchComponent, NgFor, ReaderCardComponent, AuthorCardComponent, RouterOutlet, NgIf],
  templateUrl: './discover-home.component.html',
  styleUrl: './discover-home.component.scss'
})
export class DiscoverHomeComponent {
  keyWords: any = [];
  authors: any = []
  readersChoices = [];
  itemsPerPage = 3;
  currentPage = 0;
  currentAuthorPage = 0
  AuthorsPerpage = 3
  router=inject(Router)
  private articleService = inject(OnlinePublishingService);

  ngOnInit(): void {
    this.articleService.getAllArticles().subscribe(data => {
      this.readersChoices = data
      const tags = data.flatMap((element: any) => element.tags);
      this.keyWords = [...new Set(this.keyWords.concat(tags))];
    })
    this.articleService.getAllAuthors().subscribe(data => {
      this.authors = data
    })
  }
  // Articles

  get currentItems(): any {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.readersChoices.slice(startIndex, endIndex);
  }

  get maxPage() {
    return Math.floor((this.readersChoices.length - 1) / this.itemsPerPage);
  }

  nextRow() {
    if (this.currentPage < this.maxPage) {
      this.currentPage++;
    }
  }

  prevRow() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  // authors
  get currentAuthors() {
    const startIndex = this.currentAuthorPage * this.AuthorsPerpage;
    const endIndex = startIndex + this.AuthorsPerpage;
    return this.authors.slice(startIndex, endIndex);
  }
  get authorsMaxPage() {
    return Math.floor((this.authors.length - 1) / this.AuthorsPerpage);
  }
  nextauthorsRow() {
    if (this.currentAuthorPage < this.authorsMaxPage) {
      this.currentAuthorPage++;
    }
  }
  prevAuthorsRow() {
    if (this.currentAuthorPage > 0) {
      this.currentAuthorPage--;
    }
  }
  navigateToKeyword(tag:string){
    this.router.navigate(['discover', 'tags', tag])
  }
}
