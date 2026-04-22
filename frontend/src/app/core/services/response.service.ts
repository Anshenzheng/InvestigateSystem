import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseRequest, SurveyResponse } from '../../models/response.model';

const API_URL = 'http://localhost:8080/api/responses';

@Injectable({ providedIn: 'root' })
export class ResponseService {
  constructor(private http: HttpClient) {}

  submitResponse(response: ResponseRequest): Observable<SurveyResponse> {
    return this.http.post<SurveyResponse>(API_URL, response);
  }

  getSurveyResponses(surveyId: number): Observable<SurveyResponse[]> {
    return this.http.get<SurveyResponse[]>(`${API_URL}/survey/${surveyId}`);
  }

  getResponse(id: number): Observable<SurveyResponse> {
    return this.http.get<SurveyResponse>(`${API_URL}/${id}`);
  }
}
