export interface Answer {
  questionId: number;
  optionId?: number;
  optionIds?: number[];
}

export interface ResponseRequest {
  surveyId: number;
  answers: Answer[];
}

export interface SurveyResponse {
  id: number;
  surveyId: number;
  userId: number | null;
  submittedAt: string;
  answers: Answer[];
}
