import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Survey, SurveyRequest } from '../../models/survey.model';

const API_URL = 'http://localhost:8080/api/surveys';
const PUBLIC_API_URL = 'http://localhost:8080/api/surveys/public';

@Injectable({ providedIn: 'root' })
export class SurveyService {
  constructor(private http: HttpClient) {}

  getMySurveys(): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${API_URL}/my`);
  }

  getSurvey(id: number): Observable<Survey> {
    return this.http.get<Survey>(`${API_URL}/${id}`);
  }

  getPublishedSurvey(id: number): Observable<Survey> {
    return this.http.get<Survey>(`${PUBLIC_API_URL}/${id}`);
  }

  getAllPublishedSurveys(): Observable<Survey[]> {
    return this.http.get<Survey[]>(PUBLIC_API_URL);
  }

  createSurvey(survey: SurveyRequest): Observable<Survey> {
    return this.http.post<Survey>(API_URL, survey);
  }

  updateSurvey(id: number, survey: SurveyRequest): Observable<Survey> {
    return this.http.put<Survey>(`${API_URL}/${id}`, survey);
  }

  deleteSurvey(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }

  publishSurvey(id: number): Observable<Survey> {
    return this.http.post<Survey>(`${API_URL}/${id}/publish`, {});
  }

  unpublishSurvey(id: number): Observable<Survey> {
    return this.http.post<Survey>(`${API_URL}/${id}/unpublish`, {});
  }
}
