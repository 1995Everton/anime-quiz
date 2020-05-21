export interface Answers {
  id: number;
  tip: string;
  photo: string;
  question: Question;
  answers: Answer[];
}

export interface Answer {
  id: number;
  name: string;
}

export interface Question {
  id: number;
  question: string;
}
