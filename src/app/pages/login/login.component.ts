import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  identity: string = '';
  password: string = '';
  error: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    localStorage.removeItem('authUser');
    console.log('authUser cleared on login page');
  }

  login(event: Event): void {
    event.preventDefault();

    this.http.get<{ users: User[] }>('https://dummyjson.com/users').subscribe((data) => {
      const user = data.users.find(
        (u) =>
          (u.email === this.identity || u.username === this.identity) &&
          u.password === this.password
      );

      if (user) {
        this.authService.setUser(user);
        this.router.navigateByUrl('/dashboard');
      } else {
        this.error = true;
        console.log('❌ Invalid credentials');
      }
    });
  }
}
