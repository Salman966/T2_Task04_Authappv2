import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';

export interface ResolvedDashboardData {
  user: User;
  allPosts: Post[];
  userPosts: Post[];
}

export const userResolver: ResolveFn<ResolvedDashboardData | null> = () => {
  const http = inject(HttpClient);
  const auth = inject(AuthService);
  const user = auth.getUser();

  if (!user) return of(null);

  return forkJoin({
    allPosts: http.get<{ posts: Post[] }>('https://dummyjson.com/posts'),
    userPosts: http.get<{ posts: Post[] }>(`https://dummyjson.com/posts/user/${user.id}`)
  }).pipe(
    map((res) => ({
      user,
      allPosts: res.allPosts.posts,
      userPosts: res.userPosts.posts
    }))
  );
};
