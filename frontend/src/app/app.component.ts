import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SharedService } from './shared.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterOutlet,
    SidebarComponent,
    AdminDashboardComponent // Add AdminDashboardComponent to imports
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ACT4GOOD Community Forum';
  isLoggedIn = false;
  isAdmin = false; // New property to track admin status
  private authSubscription!: Subscription;
  private loggedInSubscription!: Subscription;

  constructor(
    @Inject(Router) private router: Router,
    private authService: AuthService,
    @Inject(SharedService) private sharedService: SharedService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication status
    this.authSubscription = this.authService.isAuthenticated().subscribe(
      (isAuthenticated: boolean) => {
        this.isLoggedIn = isAuthenticated;
      }
    );

    // Subscribe to login events
    this.loggedInSubscription = this.authService.loggedInEvent.subscribe(() => {
      this.isLoggedIn = true;
      this.authService.setAuthenticationStatus(true);
      this.checkAdminStatus(); // Check admin status on login
    });

    // Check if token exists in localStorage and update auth status
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn = true;
        this.authService.setAuthenticationStatus(true);
        this.checkAdminStatus(); // Check admin status on page load
      }
    }
    
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.loggedInSubscription) {
      this.loggedInSubscription.unsubscribe();
    }
  }

  login(): void {
    this.sharedService.triggerLoginEvent();
    this.router.navigate(['/']);
  }
  
  register(): void {
    this.sharedService.triggerRegisterEvent();
    this.router.navigate(['/']);
  }

  logout(): void {
    // Update auth status through the service
    this.authService.setAuthenticationStatus(false);
    this.isLoggedIn = false;
    this.isAdmin = false; // Reset admin status on logout
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/']);
  }

  loadContent(page: string): void {
    if (!this.isLoggedIn) {
      // Optionally handle unauthorized access
      this.router.navigate(['/']);
      return;
    }

    switch(page) {
      case 'allposts':
        this.router.navigate(['/getAllPosts']);
        break;
      case 'addpost':
        this.router.navigate(['/createPost']);
        break;
      case 'myposts':
        this.router.navigate(['/getMyPosts']);
        break;
    }
  }

  navigateToAdminDashboard(): void {
    this.router.navigate(['/adminDashboard']);
  }

  private checkAdminStatus(): void {
    // Check if the user is an admin based on the token or a service call
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    this.isAdmin = isAdmin;
  }
}