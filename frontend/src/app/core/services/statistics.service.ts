import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SurveyStatistics } from '../../models/statistics.model';

const API_URL = 'http://localhost:8080/api/statistics';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  constructor(private http: HttpClient) {}

  getSurveyStatistics(surveyId: number): Observable<SurveyStatistics> {
    return this.http.get<SurveyStatistics>(`${API_URL}/survey/${surveyId}`);
  }
}
