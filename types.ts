export type StepId = 
  | 'START'
  | 'PATH_A_LEVEL'
  | 'PATH_A_INTEREST'
  | 'PATH_B_AREA'
  | 'PATH_B_SERVICE_CLIENTS'
  | 'PATH_B_SERVICE_DIFFICULTY'
  | 'PATH_B_PRODUCT_REVENUE'
  | 'PATH_B_PRODUCT_DIFFICULTY'
  | 'PATH_C_AREA'
  | 'PATH_C_DESC'
  | 'PATH_C_REVENUE'
  | 'RESULT_ELECTI'
  | 'RESULT_CALENDLY';

export type QuestionType = 'single_choice' | 'text_input' | 'info';

export interface Option {
  label: string;
  value: string;
  nextStep?: StepId; // If the path is linear or specific to this option
}

export interface Step {
  id: StepId;
  type: QuestionType;
  question?: string; // The main text
  description?: string; // Optional subtext
  options?: Option[];
  placeholder?: string; // For text inputs
  ctaText?: string; // For result pages
  ctaLink?: string; // For result pages
}

export interface QuizState {
  currentStepId: StepId;
  history: StepId[];
  answers: Record<string, string>;
}