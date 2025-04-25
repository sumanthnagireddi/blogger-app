import { Component, inject } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { Store } from '@ngrx/store';
import { AppState, selectCurrentUser } from '../../store/userData.selector';
import { NgIf, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SearchComponent, UpperCasePipe, RouterLink, SidebarComponent,NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    store=inject(Store<AppState>);
    username:any;
    showMenu:boolean=false
    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.store.select(selectCurrentUser).subscribe(data=>{
        this.username=data?.username
      })
    }
}
