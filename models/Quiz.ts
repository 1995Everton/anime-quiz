import { Answer, Answers } from './Answers';

export interface Quiz {
  start: boolean;
  modal: boolean;
  hint: boolean;
  transitioning: boolean;
  progress: number;
  answers: Answer[];
  breadcrumbs: Breadcrumbs[];
  scenes: Answers[];
  circle: {
    background: string;
    transform: string;
    transitionDuration: string;
  };
  feedback: {
    text: string;
    classe: {
      correct: boolean;
      wrong: boolean;
    };
    style: {
      transform: string;
    };
  };
  config: {
    audio: boolean;
    audioSwitch: boolean;
    sfxSwitch: boolean;
  };
  music: {
    soundtrack: HTMLAudioElement;
    buttonClick: HTMLAudioElement;
    correct: HTMLAudioElement;
    slide: HTMLAudioElement;
    wrong: HTMLAudioElement;
  };
  colors: string[];
}

export interface Breadcrumbs {
  classe: string;
  status: boolean;
}
