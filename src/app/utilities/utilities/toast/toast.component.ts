import { Component, inject } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
import { NgFor, NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgFor,NgIf,NgClass],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  private toastService=inject(UtilityService);
  toast:any

  ngOnInit(): void {
    this.toastService.toastSubject$.subscribe((data:any)=>{
      this.toast=data
    })
  }
  ngOnDestroy(): void {
    
  }
}
