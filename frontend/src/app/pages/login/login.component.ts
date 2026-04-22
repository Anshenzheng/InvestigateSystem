import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div style="max-width: 400px; margin: 0 auto;">
      <div class="page-header text-center">
        <h1 class="page-title">登录</h1>
        <p class="page-subtitle">欢迎回来，请登录您的账号</p>
      </div>

      <div class="card">
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div *ngIf="errorMessage" class="alert alert-error">
            {{ errorMessage }}
          </div>
          
          <div *ngIf="successMessage" class="alert alert-success">
            {{ successMessage }}
          </div>

          <div class="form-group">
            <label class="form-label">用户名</label>
            <input
              type="text"
              formControlName="username"
              class="form-input"
              placeholder="请输入用户名"
              [class.error]="submitted && loginForm.get('username')?.invalid"
            />
            <div *ngIf="submitted && loginForm.get('username')?.invalid" class="error-message">
              <span *ngIf="loginForm.get('username')?.errors?.['required']">请输入用户名</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">密码</label>
            <input
              type="password"
              formControlName="password"
              class="form-input"
              placeholder="请输入密码"
              [class.error]="submitted && loginForm.get('password')?.invalid"
            />
            <div *ngIf="submitted && loginForm.get('password')?.invalid" class="error-message">
              <span *ngIf="loginForm.get('password')?.errors?.['required']">请输入密码</span>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            style="width: 100%;"
            [disabled]="loading"
          >
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>

        <div class="divider"></div>

        <p class="text-center text-muted">
          还没有账号？
          <a routerLink="/register" style="color: var(--primary); text-decoration: none; font-weight: 500;">立即注册</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    if (this.route.snapshot.queryParams['registered']) {
      this.successMessage = '注册成功，请登录';
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/surveys';
        this.router.navigate([returnUrl]);
      },
      error: (err) => {
        this.errorMessage = err.error || '用户名或密码错误';
        this.loading = false;
      }
    });
  }
}
