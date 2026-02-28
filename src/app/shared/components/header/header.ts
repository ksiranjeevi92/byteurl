import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  // Signal-based inputs
  userEmail = input<string | null>(null);
  currentRoute = input<string>('');
  tokenTimeRemaining = input<number | null>(null);

  // Signal-based outputs
  logout = output<void>();
  navigate = output<string>();

  // Computed values
  displayEmail = computed(() => this.userEmail() || 'Guest User');
  emailInitial = computed(() => this.displayEmail().charAt(0).toUpperCase());

  onLogout(): void {
    this.logout.emit();
  }

  navigateTo(route: string): void {
    this.navigate.emit(route);
  }

  isRouteActive(route: string): boolean {
    const current = this.currentRoute();
    return current === route || current.startsWith(route + '/');
  }
}
