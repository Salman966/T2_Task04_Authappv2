import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  user: User | null = null;
  allPosts: Post[] = [];
  userPosts: Post[] = [];
  activeTab: 'all' | 'mine' = 'all';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute

  ) {}

  ngOnInit(): void {
    this.user = this.route.snapshot.data['user'];
  
    console.log('Dashboard loaded. User:', this.user);
  
    if (!this.user) {
      console.warn('User not authenticated. Redirecting...');
      this.router.navigate(['/'], { replaceUrl: true });
      return;
    }
  
    this.http
      .get<{ posts: Post[] }>('https://dummyjson.com/posts')
      .subscribe((res) => {
        this.allPosts = res.posts;
        this.userPosts = res.posts.filter(
          (post) => post.userId === this.user?.id
        );
      });
  }
  
  

  logout(): void {
    localStorage.removeItem('authUser');
      this.router.navigateByUrl('/', { replaceUrl: true });
  }

  switchTab(tab: 'all' | 'mine'): void {
    this.activeTab = tab;
  }
}
