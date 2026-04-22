export interface OptionStatistics {
  optionId: number;
  optionText: string;
  count: number;
  percentage: number;
}

export interface QuestionStatistics {
  questionId: number;
  questionText: string;
  questionType: string;
  options: OptionStatistics[];
}

export interface SurveyStatistics {
  surveyId: number;
  surveyTitle: string;
  totalResponses: number;
  questions: QuestionStatistics[];
}
