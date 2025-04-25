import { Component, inject, input } from '@angular/core';
import { OnlinePublishingService } from '../../services/online-publishing.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BLOGS } from '../../utilities/consts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  width = input(400);
  showSearchIcon: boolean = true
  searchValue: any
  showCOntent: boolean = false
  showDropdown: boolean = false;
  currentValue: string = 'Articles';
  articles: any = [];
  authors: any = [];
  filteredItems: any = []
  dropdownMenu: string[] = ['Articles', 'Authors', 'Tags']
  articleService = inject(OnlinePublishingService)
  router = inject(Router)
  keyWords: any = []
  keyInput(event: any) {
    if (this.searchValue) {
      this.showCOntent = true;
      this.showDropdown = false
      this.search()
    } else {
      this.showCOntent = false;
      this.showDropdown = false
    }
  }

  ngOnInit(): void {
    this.articleService.getAllArticles().subscribe(data => {
      this.articles = data
      const tags = data.flatMap((element: any) => element.tags);
      this.keyWords = [...new Set(this.keyWords.concat(tags))];
    })
    this.articleService.getAllAuthors().subscribe(data => {
      this.authors = data;
      console.log(data);

    })
  }
  setCurrentSelector(selector: string) {
    this.currentValue = selector
    this.showDropdown = false
  }

  search() {
    if (this.currentValue === 'Articles') {
      this.filteredItems = this.articles.filter((element: any) => {
        const searchValue = this.searchValue.toLowerCase();
        return (
          element?.title?.toLowerCase().includes(searchValue) ||
          element?.description?.toLowerCase().includes(searchValue)
        );

      });
    } else if (this.currentValue == 'Authors') {
      this.filteredItems = this.authors.filter((element: any) => {
        const searchValue = this.searchValue.toLowerCase();
        return (
          element?.username?.toLowerCase().includes(searchValue)
        );

      })
    } else {
      this.filteredItems = this.keyWords.filter((element:any)=>{
        const searchValue = this.searchValue.toLowerCase();
        return (
          element.toLowerCase().includes(searchValue)
        );

      })
    }


  }
  navigate(data: any) {
    if (this.currentValue === 'Articles') {
      this.router.navigate(['discover', 'article-details', data?._id, data?.views])
    } else if (this.currentValue === 'Authors') {
      this.router.navigate(['discover', 'author-details', data?.userUid])

    } else {
      this.router.navigate(['discover', 'tags', data])
    }
    this.showCOntent = false;
    this.showDropdown = false
    this.searchValue = ''
  }
}
