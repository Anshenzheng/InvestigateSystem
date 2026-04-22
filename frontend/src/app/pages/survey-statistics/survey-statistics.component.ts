import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StatisticsService } from '../../core/services/statistics.service';
import { SurveyStatistics, QuestionStatistics, OptionStatistics } from '../../models/statistics.model';
import { NgChartsModule } from 'ng2-charts';

type ChartType = 'pie' | 'bar' | 'line' | 'doughnut' | 'radar' | 'polarArea';

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

interface ChartDataset {
  data: number[];
  backgroundColor?: string[];
  borderWidth?: number;
  borderColor?: string;
}

interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      position?: string;
      labels?: {
        padding?: number;
        usePointStyle?: boolean;
      };
    };
  };
}

@Component({
  selector: 'app-survey-statistics',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `
    <div *ngIf="loading" class="loading">
      <div class="spinner"></div>
    </div>

    <div *ngIf="!loading && !statistics" class="empty-state">
      <div class="empty-state-icon">❌</div>
      <div class="empty-state-title">数据不存在</div>
      <button (click)="goBack()" class="btn btn-primary mt-4">返回</button>
    </div>

    <div *ngIf="!loading && statistics">
      <div class="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 class="page-title">{{ statistics.surveyTitle }}</h1>
          <p class="page-subtitle">
            共收到 <span style="font-weight: 600; color: var(--primary);">{{ statistics.totalResponses }}</span> 份回答
          </p>
        </div>
        <button (click)="goBack()" class="btn btn-secondary">
          返回
        </button>
      </div>

      <div *ngIf="statistics.totalResponses === 0" class="card text-center">
        <div class="empty-state-icon">📊</div>
        <div class="empty-state-title">暂无数据</div>
        <p>该问卷暂未收到任何回答</p>
      </div>

      <div *ngIf="statistics.totalResponses > 0">
        <div *ngFor="let question of statistics.questions; let i = index" class="card">
          <div class="d-flex align-items-start" style="margin-bottom: 20px;">
            <span class="question-number">{{ i + 1 }}</span>
            <div>
              <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">
                {{ question.questionText }}
              </h3>
              <span class="badge badge-secondary">
                {{ question.questionType === 'SINGLE_CHOICE' ? '单选题' : '多选题' }}
              </span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <div>
              <canvas baseChart
                [data]="getChartData(question)"
                [type]="chartType"
                [options]="chartOptions">
              </canvas>
            </div>

            <div>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding: 12px 8px; border-bottom: 1px solid var(--border); font-weight: 600;">选项</th>
                    <th style="text-align: right; padding: 12px 8px; border-bottom: 1px solid var(--border); font-weight: 600;">数量</th>
                    <th style="text-align: right; padding: 12px 8px; border-bottom: 1px solid var(--border); font-weight: 600;">占比</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let option of question.options">
                    <td style="padding: 12px 8px; border-bottom: 1px solid var(--border);">
                      {{ option.optionText }}
                    </td>
                    <td style="padding: 12px 8px; border-bottom: 1px solid var(--border); text-align: right; font-weight: 500;">
                      {{ option.count }}
                    </td>
                    <td style="padding: 12px 8px; border-bottom: 1px solid var(--border); text-align: right;">
                      <span style="color: var(--primary); font-weight: 500;">{{ option.percentage }}%</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div *ngFor="let option of question.options" style="margin-top: 16px;">
                <div class="d-flex justify-content-between" style="margin-bottom: 4px;">
                  <span style="font-size: 13px; color: var(--text-secondary);">{{ option.optionText }}</span>
                  <span style="font-size: 13px; font-weight: 500;">{{ option.percentage }}%</span>
                </div>
                <div style="height: 8px; background: var(--background); border-radius: 4px; overflow: hidden;">
                  <div 
                    [style.width.%]="option.percentage"
                    [style.background]="getBarColor(option, question.options)">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SurveyStatisticsComponent implements OnInit {
  statistics: SurveyStatistics | null = null;
  loading = true;
  surveyId: number | null = null;

  chartType: ChartType = 'pie';
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      }
    }
  };

  private colors = [
    '#6366f1',
    '#818cf8',
    '#a5b4fc',
    '#c7d2fe',
    '#e0e7ff',
    '#10b981',
    '#34d399',
    '#6ee7b7',
    '#f59e0b',
    '#fbbf24',
    '#ef4444',
    '#f87171'
  ];

  constructor(
    private statisticsService: StatisticsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.surveyId = parseInt(id, 10);
      this.loadStatistics();
    }
  }

  loadStatistics(): void {
    if (!this.surveyId) return;

    this.statisticsService.getSurveyStatistics(this.surveyId).subscribe({
      next: (stats) => {
        this.statistics = stats;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/surveys']);
  }

  getChartData(question: QuestionStatistics): ChartData {
    const labels = question.options.map(o => o.optionText);
    const data = question.options.map(o => o.count);

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: this.colors.slice(0, question.options.length),
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };
  }

  getBarColor(option: OptionStatistics, options: OptionStatistics[]): string {
    const index = options.indexOf(option);
    return this.colors[index % this.colors.length];
  }
}
