
import { TimerMode } from './types';

export const TIMER_DURATIONS: Record<TimerMode, number> = {
  [TimerMode.Pomodoro]: 25 * 60,
  [TimerMode.ShortBreak]: 5 * 60,
  [TimerMode.LongBreak]: 15 * 60,
};

export const POMODOROS_UNTIL_LONG_BREAK = 4;
