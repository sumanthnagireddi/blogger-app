import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgClass, JsonPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastType, UtilityService } from '../../../utilities/services/utility.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf, NgClass, JsonPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  registrationForm!: FormGroup
  fb = inject(FormBuilder)
  isSubmitted: boolean = false
  private authService = inject(AuthService);
  private toastService=inject(UtilityService)
  router = inject(Router)
  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  loginWithProvider(provider: string) {
    this.authService.loginWithProvider(provider).subscribe(res => {
      if (res) {
        // console.log(res);
        this.toastService.addToToast({ type: ToastType.success, message: `Welcome To Online Publishing Platform ${res?.user?.displayName || res?.user?.email}` })
        this.router.navigate(['/'])
      }
    })
  }
  login() {
    if (this.registrationForm.valid) {
      const { email,  password } = this.registrationForm.value;
      this.authService.loginWithUserNameandPassword(email, password).subscribe(res => {
        this.toastService.addToToast({ type: ToastType.success, message: ' Registration Success' });
        this.router.navigate(['/'])
      })
    } else {
      this.isSubmitted = true;
    }
  }
  isControlInvalid(controlName: string) {
    const control: any = this.registrationForm?.get(controlName);
    return (
      (this.isSubmitted &&
        !this.registrationForm.value[controlName]) ||
      (control.touched && !this.registrationForm.value[controlName])
    );
  }
}
