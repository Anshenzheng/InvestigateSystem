import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <nav class="navbar">
      <div class="navbar-content">
        <a routerLink="/" class="navbar-brand">
          <span>📋</span>
          <span>在线问卷系统</span>
        </a>
        <div class="navbar-nav">
          <a routerLink="/" routerLinkActive="active" class="nav-link">首页</a>
          <a routerLink="/public" routerLinkActive="active" class="nav-link">问卷广场</a>
          <ng-container *ngIf="isAuthenticated$ | async">
            <a routerLink="/surveys" routerLinkActive="active" class="nav-link">我的问卷</a>
          </ng-container>
          <ng-container *ngIf="!(isAuthenticated$ | async)">
            <a routerLink="/login" routerLinkActive="active" class="nav-link">登录</a>
            <a routerLink="/register" routerLinkActive="active" class="nav-link">注册</a>
          </ng-container>
          <ng-container *ngIf="isAuthenticated$ | async">
            <span class="nav-link text-muted">
              {{ (currentUser$ | async)?.username }}
            </span>
            <button (click)="logout()" class="btn btn-secondary btn-sm">退出</button>
          </ng-container>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <div class="container">
        <router-outlet></router-outlet>
      </div>
    </main>
  `
})
export class AppComponent {
  isAuthenticated$ = this.authService.isAuthenticated$;
  currentUser$ = this.authService.currentUser$;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
