export interface Option {
  label: string;
  value: string;
  description?: string;
}

export interface QuestionConfig {
  question: string;
  header?: string;
  options: Option[];
  multiSelect: boolean;
  allowOther: boolean;
}

export interface SelectionState {
  selected: Set<string>;
  otherText: string;
  isOtherSelected: boolean;
}
