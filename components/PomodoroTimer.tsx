import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TimerMode } from '../types';
import { TIMER_DURATIONS, POMODOROS_UNTIL_LONG_BREAK } from '../constants';

interface PomodoroTimerProps {
  activeTaskText: string | null;
  onTimerComplete: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ activeTaskText, onTimerComplete }) => {
  const [mode, setMode] = useState<TimerMode>(TimerMode.Pomodoro);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS[TimerMode.Pomodoro]);
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const alarmSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    alarmSound.current = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
  }, []);

  const switchMode = useCallback(() => {
    if (mode === TimerMode.Pomodoro) {
      const newPomodoroCount = pomodoroCount + 1;
      setPomodoroCount(newPomodoroCount);
      onTimerComplete();
      
      if (newPomodoroCount % POMODOROS_UNTIL_LONG_BREAK === 0) {
        setMode(TimerMode.LongBreak);
        setTimeLeft(TIMER_DURATIONS[TimerMode.LongBreak]);
      } else {
        setMode(TimerMode.ShortBreak);
        setTimeLeft(TIMER_DURATIONS[TimerMode.ShortBreak]);
      }
    } else {
      setMode(TimerMode.Pomodoro);
      setTimeLeft(TIMER_DURATIONS[TimerMode.Pomodoro]);
    }
    setIsActive(false);
  }, [mode, pomodoroCount, onTimerComplete]);
  
  useEffect(() => {
    // Fix: In a browser environment, setInterval returns a number, not a NodeJS.Timeout.
    let interval: number | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      if(alarmSound.current) {
        alarmSound.current.play();
      }
      switchMode();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeLeft, switchMode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(TIMER_DURATIONS[mode]);
  };

  const selectMode = (newMode: TimerMode) => {
    if (isActive) {
        if (!window.confirm("O temporizador está ativo. Tem certeza que deseja trocar de modo? O progresso será reiniciado.")) {
            return;
        }
    }
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(TIMER_DURATIONS[newMode]);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (TIMER_DURATIONS[mode] - timeLeft) / TIMER_DURATIONS[mode];
  const strokeDashoffset = 283 * (1 - progress);

  const getModeStyles = () => {
    switch (mode) {
      case TimerMode.Pomodoro:
        return 'bg-red-500 text-red-500';
      case TimerMode.ShortBreak:
        return 'bg-cyan-500 text-cyan-500';
      case TimerMode.LongBreak:
        return 'bg-indigo-500 text-indigo-500';
    }
  };

  const modeTextMap: Record<TimerMode, string> = {
    [TimerMode.Pomodoro]: 'Pomodoro',
    [TimerMode.ShortBreak]: 'Pausa Curta',
    [TimerMode.LongBreak]: 'Pausa Longa'
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-slate-800 rounded-3xl shadow-2xl h-full">
      <div className="flex space-x-2 mb-8">
        {Object.values(TimerMode).map((m) => (
          <button
            key={m}
            onClick={() => selectMode(m)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
              mode === m
                ? `${getModeStyles().split(' ')[0]} text-white`
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {modeTextMap[m]}
          </button>
        ))}
      </div>

      <div className="relative w-64 h-64 md:w-80 md:h-80 mb-6">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-slate-700"
            strokeWidth="7"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <circle
            className={`${getModeStyles().split(' ')[1]} transition-all duration-1000 ease-linear`}
            strokeWidth="7"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
            <span className="text-6xl md:text-7xl font-bold text-slate-100 tracking-tighter">
                {formatTime(timeLeft)}
            </span>
        </div>
      </div>

      <div className="text-center mb-8 h-12">
        <p className="text-slate-400">Foco atual:</p>
        <p className="text-lg font-medium text-slate-200 truncate max-w-xs">{activeTaskText || 'Nenhuma tarefa selecionada'}</p>
      </div>

      <div className="flex items-center space-x-4">
        <button
            onClick={resetTimer}
            className="p-3 bg-slate-700 rounded-full text-slate-300 hover:bg-slate-600 transition-colors"
            aria-label="Resetar temporizador"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 15" /></svg>
        </button>

        <button
          onClick={toggleTimer}
          className={`w-24 h-24 rounded-full text-2xl font-bold flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105 ${getModeStyles().split(' ')[0]} text-white`}
        >
          {isActive ? 'PAUSAR' : 'INICIAR'}
        </button>
        <div className="w-12 h-12 flex items-center justify-center text-slate-400">
            #{pomodoroCount}
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;