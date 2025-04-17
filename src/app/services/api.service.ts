import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;  
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://dummyjson.com';

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, payload);
  }

  getAllPosts(): Observable<{ posts: Post[] }> {
    return this.http.get<{ posts: Post[] }>(`${this.baseUrl}/posts`);
  }

  getUserPosts(userId: number): Observable<{ posts: Post[] }> {
    return this.http.get<{ posts: Post[] }>(`${this.baseUrl}/posts/user/${userId}`);
  }

  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/posts/${postId}`);
  }

  getProfile(): Observable<LoginResponse> {
    const token = localStorage.getItem('authToken');
    return this.http.get<LoginResponse>(`${this.baseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
}
