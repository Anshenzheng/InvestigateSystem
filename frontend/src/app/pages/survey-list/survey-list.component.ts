import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SurveyService } from '../../core/services/survey.service';
import { Survey } from '../../models/survey.model';

@Component({
  selector: 'app-survey-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header d-flex justify-content-between align-items-center">
      <div>
        <h1 class="page-title">我的问卷</h1>
        <p class="page-subtitle">管理您创建的所有问卷</p>
      </div>
      <a routerLink="/surveys/create" class="btn btn-primary">
        + 创建问卷
      </a>
    </div>

    <div *ngIf="loading" class="loading">
      <div class="spinner"></div>
    </div>

    <div *ngIf="!loading && surveys.length === 0" class="empty-state">
      <div class="empty-state-icon">📋</div>
      <div class="empty-state-title">暂无问卷</div>
      <p style="margin-bottom: 20px;">点击上方按钮创建您的第一个问卷</p>
      <a routerLink="/surveys/create" class="btn btn-primary">创建问卷</a>
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
              <span class="badge" [ngClass]="survey.isPublished ? 'badge-success' : 'badge-secondary'">
                {{ survey.isPublished ? '已发布' : '草稿' }}
              </span>
              <span class="badge" [ngClass]="survey.isAnonymous ? 'badge-primary' : 'badge-warning'">
                {{ survey.isAnonymous ? '匿名问卷' : '需登录填写' }}
              </span>
              <span class="badge badge-secondary">
                {{ survey.responseCount }} 份回答
              </span>
            </div>
          </div>
          <div class="d-flex gap-2" style="margin-left: 20px;">
            <button
              *ngIf="!survey.isPublished"
              (click)="editSurvey(survey)"
              class="btn btn-secondary btn-sm"
            >
              编辑
            </button>
            <button
              *ngIf="!survey.isPublished"
              (click)="publishSurvey(survey)"
              class="btn btn-success btn-sm"
            >
              发布
            </button>
            <button
              *ngIf="survey.isPublished"
              (click)="fillSurvey(survey)"
              class="btn btn-primary btn-sm"
            >
              填写
            </button>
            <button
              *ngIf="survey.isPublished"
              (click)="viewStatistics(survey)"
              class="btn btn-secondary btn-sm"
            >
              统计
            </button>
            <button
              *ngIf="!survey.isPublished"
              (click)="deleteSurvey(survey)"
              class="btn btn-danger btn-sm"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SurveyListComponent implements OnInit {
  surveys: Survey[] = [];
  loading = true;

  constructor(
    private surveyService: SurveyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSurveys();
  }

  loadSurveys(): void {
    this.surveyService.getMySurveys().subscribe({
      next: (surveys) => {
        this.surveys = surveys;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  editSurvey(survey: Survey): void {
    this.router.navigate(['/surveys/edit', survey.id]);
  }

  fillSurvey(survey: Survey): void {
    this.router.navigate(['/surveys/fill', survey.id]);
  }

  viewStatistics(survey: Survey): void {
    this.router.navigate(['/surveys/statistics', survey.id]);
  }

  publishSurvey(survey: Survey): void {
    if (confirm('确定要发布此问卷吗？发布后将无法修改。')) {
      this.surveyService.publishSurvey(survey.id).subscribe({
        next: () => {
          this.loadSurveys();
        }
      });
    }
  }

  deleteSurvey(survey: Survey): void {
    if (confirm('确定要删除此问卷吗？此操作不可撤销。')) {
      this.surveyService.deleteSurvey(survey.id).subscribe({
        next: () => {
          this.loadSurveys();
        }
      });
    }
  }
}
