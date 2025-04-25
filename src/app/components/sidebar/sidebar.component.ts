import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { AppState, selectCurrentUser } from '../../store/userData.selector';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  router = inject(Router);
  private authService = inject(AuthService)
  store = inject(Store<AppState>);
  current_userData: any
  @Output()clickEvent=new EventEmitter<any>()
  ngOnInit(): void {
    this.store.select(selectCurrentUser).subscribe(data => {
      this.current_userData = data;
      
    })

  }
  navigate(category: string) {
    this.router.navigate(['me', 'data', category])
  }

  logout() {
    const confirmMessage = `Are you sure you want to logout?`
    if (confirm(confirmMessage)) {
      this.authService.logout().subscribe(res => console.log(res))
    }
  }
  handleClick(){
    this.clickEvent.emit(true)
  }
}
