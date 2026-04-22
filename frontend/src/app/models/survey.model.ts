export interface Option {
  id: number;
  optionText: string;
  orderIndex: number;
}

export interface Question {
  id: number;
  questionText: string;
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  orderIndex: number;
  isRequired: boolean;
  options: Option[];
}

export interface Survey {
  id: number;
  title: string;
  description: string;
  creatorId: number;
  creatorName: string;
  isAnonymous: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  responseCount: number;
  questions: Question[];
}

export interface SurveyRequest {
  title: string;
  description: string;
  isAnonymous: boolean;
  questions: QuestionRequest[];
}

export interface QuestionRequest {
  id?: number;
  questionText: string;
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  orderIndex?: number;
  isRequired: boolean;
  options: OptionRequest[];
}

export interface OptionRequest {
  id?: number;
  optionText: string;
  orderIndex?: number;
}
