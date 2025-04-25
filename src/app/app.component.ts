import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { OnlinePublishingService } from './services/online-publishing.service';
import { ToastComponent } from "./utilities/utilities/toast/toast.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'online-publishing-platform';
  authService = inject(AuthService);
  articlesService = inject(OnlinePublishingService);
  ngOnInit(): void {
  
  }
}
