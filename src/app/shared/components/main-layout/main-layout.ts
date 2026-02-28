import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';
import { JwtTokenService } from '../../services/jwt-token.service';
import { UserAccountService } from '../../../features/user-account/services/user-account.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  userEmail: string | null = null;
  currentRoute = '';
  tokenTimeRemaining: number | null = null;

  private routerSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private jwtTokenService: JwtTokenService,
    private userAccountService: UserAccountService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.currentRoute = this.router.url;

    // Subscribe to route changes
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentRoute = (event as NavigationEnd).url;
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  onLogout(): void {
    this.userAccountService.logout();
    this.router.navigate(['/user-account/login']);
  }

  onNavigate(route: string): void {
    this.router.navigate([route]);
  }

  private loadUserData(): void {
    this.userEmail = this.jwtTokenService.getEmailFromToken();
    this.tokenTimeRemaining = this.jwtTokenService.getTimeUntilExpiration();

    // If no email found or token is expired, redirect to login
    if (!this.userEmail || this.jwtTokenService.isTokenExpired()) {
      console.warn('No valid token found, redirecting to login');
      this.router.navigate(['/user-account/login']);
    }
  }
}
