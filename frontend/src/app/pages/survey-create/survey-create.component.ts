import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from '../../core/services/survey.service';
import { QuestionRequest, OptionRequest, SurveyRequest } from '../../models/survey.model';

@Component({
  selector: 'app-survey-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">{{ isEdit ? '编辑问卷' : '创建问卷' }}</h1>
      <p class="page-subtitle">{{ isEdit ? '修改您的问卷内容' : '创建一个新的问卷' }}</p>
    </div>

    <form [formGroup]="surveyForm" (ngSubmit)="onSubmit()">
      <div class="card">
        <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 20px;">基本信息</h3>
        
        <div class="form-group">
          <label class="form-label">问卷标题 <span style="color: var(--danger);">*</span></label>
          <input
            type="text"
            formControlName="title"
            class="form-input"
            placeholder="请输入问卷标题"
          />
          <div *ngIf="submitted && surveyForm.get('title')?.invalid" class="error-message">
            <span *ngIf="surveyForm.get('title')?.errors?.['required']">请输入问卷标题</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">问卷描述</label>
          <textarea
            formControlName="description"
            class="form-input form-textarea"
            placeholder="请输入问卷描述（可选）"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">问卷类型</label>
          <div class="d-flex gap-4 flex-wrap" style="margin-top: 8px;">
            <label class="d-flex align-items-center" style="cursor: pointer;">
              <input
                type="radio"
                formControlName="isAnonymous"
                [value]="true"
                style="margin-right: 8px;"
              />
              <span>匿名问卷（允许非登录用户填写）</span>
            </label>
            <label class="d-flex align-items-center" style="cursor: pointer;">
              <input
                type="radio"
                formControlName="isAnonymous"
                [value]="false"
                style="margin-right: 8px;"
              />
              <span>需登录填写</span>
            </label>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="d-flex justify-content-between align-items-center" style="margin-bottom: 20px;">
          <h3 style="font-size: 16px; font-weight: 600;">问题列表</h3>
          <button
            type="button"
            (click)="addQuestion()"
            class="btn btn-secondary btn-sm"
          >
            + 添加问题
          </button>
        </div>

        <div formArrayName="questions">
          <div *ngFor="let questionGroup of questions.controls; let i = index" class="question-card">
            <div class="d-flex justify-content-between align-items-start" style="margin-bottom: 16px;">
              <div style="flex: 1;">
                <div class="d-flex align-items-center" style="margin-bottom: 8px;">
                  <span class="question-number">{{ i + 1 }}</span>
                  <span style="font-weight: 500;">问题</span>
                  <span *ngIf="questionGroup.get('isRequired')?.value" style="color: var(--danger); margin-left: 4px;">*</span>
                </div>
                <input
                  type="text"
                  [formControlName]="i"
                  formControlName="questionText"
                  class="form-input"
                  placeholder="请输入问题内容"
                  style="max-width: 500px;"
                />
              </div>
              <button
                type="button"
                (click)="removeQuestion(i)"
                class="btn btn-danger btn-sm"
                style="margin-left: 12px;"
              >
                删除
              </button>
            </div>

            <div [formGroupName]="i" class="d-flex gap-4 flex-wrap" style="margin-bottom: 16px;">
              <label class="d-flex align-items-center" style="cursor: pointer;">
                <input
                  type="radio"
                  formControlName="questionType"
                  value="SINGLE_CHOICE"
                  style="margin-right: 8px;"
                />
                <span>单选题</span>
              </label>
              <label class="d-flex align-items-center" style="cursor: pointer;">
                <input
                  type="radio"
                  formControlName="questionType"
                  value="MULTIPLE_CHOICE"
                  style="margin-right: 8px;"
                />
                <span>多选题</span>
              </label>
              <label class="d-flex align-items-center" style="cursor: pointer;">
                <input
                  type="checkbox"
                  formControlName="isRequired"
                  style="margin-right: 8px;"
                />
                <span>必填</span>
              </label>
            </div>

            <div [formGroupName]="i">
              <div formArrayName="options">
                <div *ngFor="let optionGroup of getOptions(questionGroup).controls; let j = index" 
                     class="d-flex align-items-center" style="margin-bottom: 8px;">
                  <span style="color: var(--text-secondary); margin-right: 12px; min-width: 30px;">
                    {{ getOptionLetter(j) }}.
                  </span>
                  <input
                    type="text"
                    [formControlName]="j"
                    formControlName="optionText"
                    class="form-input"
                    placeholder="选项内容"
                    style="flex: 1; max-width: 400px;"
                  />
                  <button
                    type="button"
                    *ngIf="getOptions(questionGroup).length > 2"
                    (click)="removeOption(questionGroup, j)"
                    class="btn btn-danger btn-sm"
                    style="margin-left: 8px;"
                  >
                    删除
                  </button>
                </div>
              </div>
              <button
                type="button"
                (click)="addOption(questionGroup)"
                class="btn btn-secondary btn-sm"
                style="margin-top: 8px;"
              >
                + 添加选项
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="submitted && questions.length === 0" class="alert alert-error">
          请至少添加一个问题
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
          {{ loading ? '保存中...' : (isEdit ? '保存修改' : '保存问卷') }}
        </button>
      </div>
    </form>
  `
})
export class SurveyCreateComponent implements OnInit {
  surveyForm: FormGroup;
  isEdit = false;
  surveyId: number | null = null;
  submitted = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private surveyService: SurveyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.surveyForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      isAnonymous: [true],
      questions: this.fb.array([])
    });
  }

  get questions(): FormArray {
    return this.surveyForm.get('questions') as FormArray;
  }

  getOptions(questionGroup: AbstractControl): FormArray {
    return questionGroup.get('options') as FormArray;
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.surveyId = parseInt(id, 10);
      this.loadSurvey();
    } else {
      this.addQuestion();
    }
  }

  loadSurvey(): void {
    if (!this.surveyId) return;
    
    this.surveyService.getSurvey(this.surveyId).subscribe({
      next: (survey) => {
        this.surveyForm.patchValue({
          title: survey.title,
          description: survey.description,
          isAnonymous: survey.isAnonymous
        });

        this.questions.clear();
        if (survey.questions) {
          for (const question of survey.questions) {
            const questionGroup = this.createQuestionGroup();
            questionGroup.patchValue({
              questionText: question.questionText,
              questionType: question.questionType,
              isRequired: question.isRequired
            });

            const optionsArray = this.getOptions(questionGroup);
            optionsArray.clear();
            if (question.options) {
              for (const option of question.options) {
                optionsArray.push(this.createOptionGroup(option.optionText));
              }
            }

            this.questions.push(questionGroup);
          }
        }
      }
    });
  }

  createQuestionGroup(): FormGroup {
    return this.fb.group({
      questionText: ['', Validators.required],
      questionType: ['SINGLE_CHOICE'],
      isRequired: [true],
      options: this.fb.array([
        this.createOptionGroup(''),
        this.createOptionGroup('')
      ])
    });
  }

  createOptionGroup(text: string): FormGroup {
    return this.fb.group({
      optionText: [text, Validators.required]
    });
  }

  addQuestion(): void {
    this.questions.push(this.createQuestionGroup());
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  addOption(questionGroup: AbstractControl): void {
    const optionsArray = this.getOptions(questionGroup);
    optionsArray.push(this.createOptionGroup(''));
  }

  removeOption(questionGroup: AbstractControl, index: number): void {
    const optionsArray = this.getOptions(questionGroup);
    optionsArray.removeAt(index);
  }

  goBack(): void {
    this.router.navigate(['/surveys']);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.surveyForm.invalid || this.questions.length === 0) {
      return;
    }

    const formValue = this.surveyForm.value;
    const surveyRequest: SurveyRequest = {
      title: formValue.title,
      description: formValue.description,
      isAnonymous: formValue.isAnonymous,
      questions: formValue.questions.map((q: any, index: number): QuestionRequest => ({
        questionText: q.questionText,
        questionType: q.questionType,
        isRequired: q.isRequired,
        orderIndex: index,
        options: q.options.map((o: any, optIndex: number): OptionRequest => ({
          optionText: o.optionText,
          orderIndex: optIndex
        }))
      }))
    };

    this.loading = true;

    if (this.isEdit && this.surveyId) {
      this.surveyService.updateSurvey(this.surveyId, surveyRequest).subscribe({
        next: () => {
          this.router.navigate(['/surveys']);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      this.surveyService.createSurvey(surveyRequest).subscribe({
        next: () => {
          this.router.navigate(['/surveys']);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    }
  }
}
