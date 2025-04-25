import { Component, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reader-card',
  standalone: true,
  imports: [],
  templateUrl: './reader-card.component.html',
  styleUrl: './reader-card.component.scss'
})
export class ReaderCardComponent {

  data = input<any>();
  readerCardData:any;
  private router = inject(Router);
  constructor(){
    effect(()=>{
      this.readerCardData=this.data()
    })
  }
  navigate(_id: string) {
    this.router.navigate(['discover', 'article-details', _id,this.data()?.views])
  }
}
