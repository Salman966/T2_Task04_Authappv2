import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private storageKey = 'authUser';
  private tokenKey = 'authToken';

  setUser(user: User & { accessToken: string }): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    localStorage.setItem(this.tokenKey, user.accessToken);
  }

  getUser(): User | null {
    const userJson = localStorage.getItem(this.storageKey);
    return userJson ? JSON.parse(userJson) as User : null;
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.storageKey);
  }
}
