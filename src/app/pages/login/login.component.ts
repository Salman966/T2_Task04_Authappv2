import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService, LoginPayload, LoginResponse } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  error: boolean = false;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private authService: AuthService
  ) {
   
    this.loginForm = this.fb.group({
      identity: ['', Validators.required],
      password: ['', Validators.required]
    });


    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
  }

  login(): void {
    const payload: LoginPayload = {
      username: this.loginForm.value.identity,
      password: this.loginForm.value.password
    };
  
    this.api.login(payload).subscribe({
      next: (res: LoginResponse) => {
        const token = res.accessToken;
        localStorage.setItem('authToken', token);
        this.token = token; 
  
        this.api.getProfile().subscribe({
          next: (profile) => {
            console.log('Token:', token); 
            this.authService.setUser({ ...profile, accessToken: token });
            this.router.navigateByUrl('/dashboard');
          },
          error: (err) => {
            this.error = true;
            console.error('❌ Failed to fetch profile:', err);
          }
        });
      },
      error: () => {
        this.error = true;
        console.log('❌ Invalid credentials');
      }
    });
  }
  
}
