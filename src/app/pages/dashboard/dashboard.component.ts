import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { ResolvedDashboardData } from '../../resolvers/user.resolver';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  user: User | null = null;
  allPosts: Post[] = [];
  userPosts: Post[] = [];
  loading = signal(false);

  tabForm: FormGroup = this.fb.group({
    selectedTab: ['all']
  });

  get selectedTab(): 'all' | 'mine' {
    return this.tabForm.get('selectedTab')?.value;
  }

  constructor() {
    const resolvedData = this.route.snapshot.data['user'] as ResolvedDashboardData;

    console.log('Resolved data from resolver:', resolvedData);

    if (!resolvedData || !resolvedData.user) {
      this.router.navigate(['/'], { replaceUrl: true });
      return;
    }

    this.user = resolvedData.user;
    this.allPosts = resolvedData.allPosts;
    this.userPosts = resolvedData.userPosts;

    this.tabForm.get('selectedTab')?.valueChanges.subscribe(() => {
      this.loading.set(true);
      setTimeout(() => this.loading.set(false), 500);
    });
  }

  logout(): void {
    localStorage.removeItem('authUser');
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  deletePost(postId: number): void {
    this.loading.set(true);
    this.http.delete(`https://dummyjson.com/posts/${postId}`).subscribe(() => {
      this.allPosts = this.allPosts.filter((p) => p.id !== postId);
      this.userPosts = this.userPosts.filter((p) => p.id !== postId);
      this.loading.set(false);
    }, () => this.loading.set(false));
  }
}
