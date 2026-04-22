import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="text-center" style="padding: 60px 20px;">
      <div style="font-size: 64px; margin-bottom: 24px;">📋</div>
      <h1 style="font-size: 36px; font-weight: 600; margin-bottom: 16px; color: var(--text-primary);">
        在线问卷系统
      </h1>
      <p style="font-size: 18px; color: var(--text-secondary); margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">
        简单、高效、专业的问卷制作平台。支持单选、多选题型，结果可视化统计，让数据收集变得轻松。
      </p>
      
      <div class="d-flex gap-3 justify-content-center flex-wrap">
        <ng-container *ngIf="isAuthenticated$ | async; else notAuthenticated">
          <a routerLink="/surveys/create" class="btn btn-primary btn-lg">
            创建问卷
          </a>
          <a routerLink="/surveys" class="btn btn-secondary btn-lg">
            我的问卷
          </a>
        </ng-container>
        <ng-template #notAuthenticated>
          <a routerLink="/register" class="btn btn-primary btn-lg">
            立即注册
          </a>
          <a routerLink="/login" class="btn btn-secondary btn-lg">
            登录账号
          </a>
        </ng-template>
      </div>

      <div class="divider" style="margin: 60px 0;"></div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 900px; margin: 0 auto;">
        <div class="card text-center">
          <div style="font-size: 40px; margin-bottom: 16px;">✏️</div>
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">轻松创建</h3>
          <p style="color: var(--text-secondary); font-size: 14px;">
            简单的拖拽式操作，快速创建专业问卷。支持单选、多选多种题型。
          </p>
        </div>
        
        <div class="card text-center">
          <div style="font-size: 40px; margin-bottom: 16px;">🔗</div>
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">一键分享</h3>
          <p style="color: var(--text-secondary); font-size: 14px;">
            发布问卷后生成分享链接，支持匿名填写或需要登录填写两种模式。
          </p>
        </div>
        
        <div class="card text-center">
          <div style="font-size: 40px; margin-bottom: 16px;">📊</div>
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">数据统计</h3>
          <p style="color: var(--text-secondary); font-size: 14px;">
            实时数据统计，可视化图表展示，让数据一目了然，洞察用户需求。
          </p>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(private authService: AuthService) {}
}
