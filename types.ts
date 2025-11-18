
export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export enum TimerMode {
  Pomodoro = 'POMODORO',
  ShortBreak = 'SHORT_BREAK',
  LongBreak = 'LONG_BREAK',
}
