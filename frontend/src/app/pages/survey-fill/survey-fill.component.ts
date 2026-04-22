import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from '../../core/services/survey.service';
import { ResponseService } from '../../core/services/response.service';
import { AuthService } from '../../core/services/auth.service';
import { Survey, Question, Option } from '../../models/survey.model';
import { ResponseRequest, Answer } from '../../models/response.model';

@Component({
  selector: 'app-survey-fill',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="loading" class="loading">
      <div class="spinner"></div>
    </div>

    <div *ngIf="!loading && !survey" class="empty-state">
      <div class="empty-state-icon">❌</div>
      <div class="empty-state-title">问卷不存在</div>
      <p>该问卷可能已被删除或未发布</p>
      <button (click)="goBack()" class="btn btn-primary mt-4">返回</button>
    </div>

    <div *ngIf="!loading && survey">
      <div class="page-header text-center">
        <h1 class="page-title">{{ survey.title }}</h1>
        <p *ngIf="survey.description" class="page-subtitle">{{ survey.description }}</p>
        <div class="d-flex gap-2 justify-content-center mt-3">
          <span class="badge" [ngClass]="survey.isAnonymous ? 'badge-primary' : 'badge-warning'">
            {{ survey.isAnonymous ? '匿名问卷' : '需登录填写' }}
          </span>
        </div>
      </div>

      <div *ngIf="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>

      <div *ngIf="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>

      <form [formGroup]="responseForm" (ngSubmit)="onSubmit()" *ngIf="!submittedSuccessfully">
        <div class="card" *ngFor="let questionGroup of questions.controls; let i = index">
          <div [formGroupName]="i">
            <div class="question-text d-flex align-items-start">
              <span class="question-number">{{ i + 1 }}</span>
              <span>{{ getQuestion(i)?.questionText }}</span>
              <span *ngIf="getQuestion(i)?.isRequired" style="color: var(--danger); margin-left: 4px;">*</span>
            </div>

            <div *ngIf="getQuestion(i)?.questionType === 'SINGLE_CHOICE'">
              <div *ngFor="let option of getQuestion(i)?.options" 
                   class="option-item"
                   [class.selected]="questionGroup.get('selectedOption')?.value === option.id"
                   (click)="selectSingleOption(i, option.id)">
                <input
                  type="radio"
                  formControlName="selectedOption"
                  [value]="option.id"
                  class="option-radio"
                  (change)="selectSingleOption(i, option.id)"
                />
                <span class="option-text">{{ option.optionText }}</span>
              </div>
            </div>

            <div *ngIf="getQuestion(i)?.questionType === 'MULTIPLE_CHOICE'">
              <div formArrayName="selectedOptions">
                <div *ngFor="let option of getQuestion(i)?.options; let j = index" 
                     class="option-item"
                     [class.selected]="isOptionSelected(i, option.id)">
                  <input
                    type="checkbox"
                    [formControlName]="j"
                    class="option-checkbox"
                    (change)="toggleOption(i, option.id, $event)"
                    [checked]="isOptionSelected(i, option.id)"
                  />
                  <span class="option-text">{{ option.optionText }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex gap-3">
          <button
            type="button"
            (click)="goBack()"
            class="btn btn-secondary"
          >
            取消
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="loading"
          >
            {{ loading ? '提交中...' : '提交问卷' }}
          </button>
        </div>
      </form>

      <div *ngIf="submittedSuccessfully" class="card text-center">
        <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
        <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">提交成功！</h3>
        <p style="color: var(--text-secondary); margin-bottom: 24px;">感谢您的参与</p>
        <button (click)="goBack()" class="btn btn-primary">返回</button>
      </div>
    </div>
  `
})
export class SurveyFillComponent implements OnInit {
  survey: Survey | null = null;
  responseForm: FormGroup;
  loading = true;
  errorMessage = '';
  successMessage = '';
  submittedSuccessfully = false;
  surveyId: number | null = null;

  private selectedOptionIds: Map<number, number[]> = new Map();

  constructor(
    private fb: FormBuilder,
    private surveyService: SurveyService,
    private responseService: ResponseService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.responseForm = this.fb.group({
      questions: this.fb.array([])
    });
  }

  get questions(): FormArray {
    return this.responseForm.get('questions') as FormArray;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.surveyId = parseInt(id, 10);
      this.loadSurvey();
    }
  }

  loadSurvey(): void {
    if (!this.surveyId) return;

    this.surveyService.getPublishedSurvey(this.surveyId).subscribe({
      next: (survey) => {
        this.survey = survey;
        this.buildForm();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error || '问卷不存在或未发布';
        this.loading = false;
      }
    });
  }

  buildForm(): void {
    if (!this.survey) return;

    this.questions.clear();
    this.selectedOptionIds.clear();

    for (const question of this.survey.questions) {
      const questionGroup = this.fb.group({
        selectedOption: [question.isRequired ? null : undefined, question.isRequired ? Validators.required : []],
        selectedOptions: this.fb.array(
          question.options.map(() => this.fb.control(false))
        )
      });
      this.questions.push(questionGroup);
      this.selectedOptionIds.set(question.id, []);
    }
  }

  getQuestion(index: number): Question | undefined {
    return this.survey?.questions[index];
  }

  selectSingleOption(questionIndex: number, optionId: number): void {
    const questionGroup = this.questions.at(questionIndex);
    questionGroup.get('selectedOption')?.setValue(optionId);
    
    const question = this.getQuestion(questionIndex);
    if (question) {
      this.selectedOptionIds.set(question.id, [optionId]);
    }
  }

  toggleOption(questionIndex: number, optionId: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const question = this.getQuestion(questionIndex);
    
    if (!question) return;

    const current = this.selectedOptionIds.get(question.id) || [];
    
    if (checkbox.checked) {
      this.selectedOptionIds.set(question.id, [...current, optionId]);
    } else {
      this.selectedOptionIds.set(question.id, current.filter(id => id !== optionId));
    }
  }

  isOptionSelected(questionIndex: number, optionId: number): boolean {
    const question = this.getQuestion(questionIndex);
    if (!question) return false;
    
    const selected = this.selectedOptionIds.get(question.id) || [];
    return selected.includes(optionId);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  onSubmit(): void {
    if (!this.survey || !this.surveyId) return;

    this.errorMessage = '';

    if (!this.survey.isAnonymous && !this.authService.isAuthenticated()) {
      this.errorMessage = '此问卷需要登录后才能填写';
      return;
    }

    for (let i = 0; i < this.survey.questions.length; i++) {
      const question = this.survey.questions[i];
      if (question.isRequired) {
        const selected = this.selectedOptionIds.get(question.id) || [];
        if (selected.length === 0) {
          this.errorMessage = `请回答问题 ${i + 1}: ${question.questionText}`;
          return;
        }
      }
    }

    const answers: Answer[] = [];
    
    for (const question of this.survey.questions) {
      const selected = this.selectedOptionIds.get(question.id) || [];
      
      if (question.questionType === 'SINGLE_CHOICE' && selected.length > 0) {
        answers.push({
          questionId: question.id,
          optionId: selected[0]
        });
      } else if (question.questionType === 'MULTIPLE_CHOICE' && selected.length > 0) {
        answers.push({
          questionId: question.id,
          optionIds: [...selected]
        });
      }
    }

    const responseRequest: ResponseRequest = {
      surveyId: this.surveyId,
      answers
    };

    this.loading = true;
    this.responseService.submitResponse(responseRequest).subscribe({
      next: () => {
        this.submittedSuccessfully = true;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error || '提交失败，请重试';
        this.loading = false;
      }
    });
  }
}
