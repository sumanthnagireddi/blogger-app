import { JsonPipe, NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf, NgClass, JsonPipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registrationForm!: FormGroup;
  private fb = inject(FormBuilder)
  isSubmitted: boolean = false
  private authService = inject(AuthService);
  // private toastService = inject('')
  router = inject(Router)
  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  register() {
    if (this.registrationForm.valid) {
      const { email, username, password } = this.registrationForm.value;
      this.authService.registerUser(email, username, password).subscribe(res => {
        // this.toastService.addToToast({ type: ToastType.success, message: ' Registration Success' });
        this.router.navigate(['/'])
      })
    } else {
      this.isSubmitted = true;
    }
  }
  loginWithProvider(provider: string) {
    this.authService.loginWithProvider(provider).subscribe(res => {
      if (res) {
        // this.toastService.addToToast({ type: ToastType.success, message: `Welcome To Online Publishing Platform ${res?.user?.displayName || res?.user?.email}` })
        this.router.navigate(['/'])
      }
    })
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
