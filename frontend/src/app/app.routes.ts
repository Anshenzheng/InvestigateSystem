import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'surveys',
    loadComponent: () => import('./pages/survey-list/survey-list.component').then(m => m.SurveyListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'surveys/create',
    loadComponent: () => import('./pages/survey-create/survey-create.component').then(m => m.SurveyCreateComponent),
    canActivate: [authGuard]
  },
  {
    path: 'surveys/edit/:id',
    loadComponent: () => import('./pages/survey-create/survey-create.component').then(m => m.SurveyCreateComponent),
    canActivate: [authGuard]
  },
  {
    path: 'surveys/fill/:id',
    loadComponent: () => import('./pages/survey-fill/survey-fill.component').then(m => m.SurveyFillComponent)
  },
  {
    path: 'surveys/statistics/:id',
    loadComponent: () => import('./pages/survey-statistics/survey-statistics.component').then(m => m.SurveyStatisticsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'public',
    loadComponent: () => import('./pages/public-surveys/public-surveys.component').then(m => m.PublicSurveysComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
