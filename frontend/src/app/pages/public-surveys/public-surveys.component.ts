import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SurveyService } from '../../core/services/survey.service';
import { Survey } from '../../models/survey.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-public-surveys',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <h1 class="page-title">问卷广场</h1>
      <p class="page-subtitle">浏览并参与公开问卷</p>
    </div>

    <div *ngIf="loading" class="loading">
      <div class="spinner"></div>
    </div>

    <div *ngIf="!loading && surveys.length === 0" class="empty-state">
      <div class="empty-state-icon">📋</div>
      <div class="empty-state-title">暂无公开问卷</div>
      <p>目前没有已发布的问卷</p>
      <ng-container *ngIf="isAuthenticated$ | async">
        <a routerLink="/surveys/create" class="btn btn-primary mt-4">创建问卷</a>
      </ng-container>
    </div>

    <div *ngIf="!loading && surveys.length > 0">
      <div *ngFor="let survey of surveys" class="card">
        <div class="d-flex justify-content-between align-items-start">
          <div style="flex: 1;">
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">
              {{ survey.title }}
            </h3>
            <p *ngIf="survey.description" class="text-muted" style="margin-bottom: 12px; font-size: 14px;">
              {{ survey.description }}
            </p>
            <div class="d-flex gap-2 flex-wrap">
              <span class="badge" [ngClass]="survey.isAnonymous ? 'badge-primary' : 'badge-warning'">
                {{ survey.isAnonymous ? '匿名问卷' : '需登录填写' }}
              </span>
              <span class="badge badge-secondary">
                发布者: {{ survey.creatorName }}
              </span>
              <span class="badge badge-secondary">
                {{ survey.responseCount }} 人参与
              </span>
            </div>
          </div>
          <div style="margin-left: 20px;">
            <button
              (click)="fillSurvey(survey)"
              class="btn btn-primary"
            >
              参与问卷
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PublicSurveysComponent implements OnInit {
  surveys: Survey[] = [];
  loading = true;
  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(
    private surveyService: SurveyService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSurveys();
  }

  loadSurveys(): void {
    this.surveyService.getAllPublishedSurveys().subscribe({
      next: (surveys) => {
        this.surveys = surveys;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  fillSurvey(survey: Survey): void {
    this.router.navigate(['/surveys/fill', survey.id]);
  }
}
