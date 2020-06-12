export interface ConditionGroup {
  match: 'and' | 'or';
  condition: (ConditionGroup | ConditionRow)[];
}

export interface ConditionRow {
  data: string;
  property: string;
  check: string;
  value: string;
}

export interface ConditionTemplate {
  name: string;
  label?: string;
  property?: ConditionProperty[];
  input?: ConditionInput;
}

export interface ConditionProperty {
  name: string;
  label: string;
  input: ConditionInput;
}

export type ConditionInput =
  | ConditionInputType
  | { type: ConditionInputType; options?: { name: string; label: string }[] };

export type ConditionInputType = 'date' | 'text';
