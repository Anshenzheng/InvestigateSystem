import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div style="max-width: 400px; margin: 0 auto;">
      <div class="page-header text-center">
        <h1 class="page-title">注册</h1>
        <p class="page-subtitle">创建您的账号，开始使用</p>
      </div>

      <div class="card">
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div *ngIf="errorMessage" class="alert alert-error">
            {{ errorMessage }}
          </div>

          <div class="form-group">
            <label class="form-label">用户名</label>
            <input
              type="text"
              formControlName="username"
              class="form-input"
              placeholder="请输入用户名（3-50个字符）"
              [class.error]="submitted && registerForm.get('username')?.invalid"
            />
            <div *ngIf="submitted && registerForm.get('username')?.invalid" class="error-message">
              <span *ngIf="registerForm.get('username')?.errors?.['required']">请输入用户名</span>
              <span *ngIf="registerForm.get('username')?.errors?.['minlength']">用户名至少3个字符</span>
              <span *ngIf="registerForm.get('username')?.errors?.['maxlength']">用户名最多50个字符</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">邮箱</label>
            <input
              type="email"
              formControlName="email"
              class="form-input"
              placeholder="请输入邮箱"
              [class.error]="submitted && registerForm.get('email')?.invalid"
            />
            <div *ngIf="submitted && registerForm.get('email')?.invalid" class="error-message">
              <span *ngIf="registerForm.get('email')?.errors?.['required']">请输入邮箱</span>
              <span *ngIf="registerForm.get('email')?.errors?.['email']">请输入有效的邮箱地址</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">密码</label>
            <input
              type="password"
              formControlName="password"
              class="form-input"
              placeholder="请输入密码（至少6个字符）"
              [class.error]="submitted && registerForm.get('password')?.invalid"
            />
            <div *ngIf="submitted && registerForm.get('password')?.invalid" class="error-message">
              <span *ngIf="registerForm.get('password')?.errors?.['required']">请输入密码</span>
              <span *ngIf="registerForm.get('password')?.errors?.['minlength']">密码至少6个字符</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">确认密码</label>
            <input
              type="password"
              formControlName="confirmPassword"
              class="form-input"
              placeholder="请再次输入密码"
              [class.error]="submitted && (registerForm.get('confirmPassword')?.invalid || registerForm.errors?.['mismatch'])"
            />
            <div *ngIf="submitted && (registerForm.get('confirmPassword')?.invalid || registerForm.errors?.['mismatch'])" class="error-message">
              <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">请确认密码</span>
              <span *ngIf="registerForm.errors?.['mismatch']">两次输入的密码不一致</span>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            style="width: 100%;"
            [disabled]="loading"
          >
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </form>

        <div class="divider"></div>

        <p class="text-center text-muted">
          已有账号？
          <a routerLink="/login" style="color: var(--primary); text-decoration: none; font-weight: 500;">立即登录</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value
      ? { mismatch: true }
      : null;
  };

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    const { confirmPassword, ...registerData } = this.registerForm.value;
    
    this.loading = true;
    this.authService.register(registerData).subscribe({
      next: () => {
        this.router.navigate(['/login'], { queryParams: { registered: true } });
      },
      error: (err) => {
        this.errorMessage = err.error || '注册失败，请重试';
        this.loading = false;
      }
    });
  }
}
