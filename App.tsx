
import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task } from './types';
import TaskList from './components/TaskList';
import PomodoroTimer from './components/PomodoroTimer';
import GeminiTaskBreaker from './components/GeminiTaskBreaker';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('focusflow-tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to parse tasks from localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('focusflow-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (text: string) => {
    const newTask: Task = {
      id: uuidv4(),
      text,
      completed: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleAddSubTasks = (subTasks: string[]) => {
    const newTasks: Task[] = subTasks.map(text => ({
        id: uuidv4(),
        text,
        completed: false
    }));
    setTasks(prevTasks => [...prevTasks, ...newTasks]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    if (id === activeTaskId) {
        setActiveTaskId(null);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    if (id === activeTaskId) {
      setActiveTaskId(null);
    }
  };
  
  const handleUpdateTask = (id: string, text: string) => {
      setTasks(prevTasks => 
        prevTasks.map(task => 
            task.id === id ? { ...task, text } : task
        )
      );
  };
  
  const handleFocusTask = (id: string) => {
      const taskToFocus = tasks.find(t => t.id === id);
      if (taskToFocus && !taskToFocus.completed) {
          setActiveTaskId(id);
      }
  };

  const handleTimerComplete = useCallback(() => {
    if (activeTaskId) {
        handleToggleTask(activeTaskId);
        setActiveTaskId(null);
    }
  }, [activeTaskId]);

  const activeTask = tasks.find(t => t.id === activeTaskId);

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
          FocusFlow
        </h1>
        <p className="text-slate-400 mt-2">Concentre-se no que importa.</p>
      </header>
      
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-8">
            <TaskList
              tasks={tasks}
              activeTaskId={activeTaskId}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
              onFocusTask={handleFocusTask}
            />
        </div>
        
        <div className="lg:col-span-1">
            <PomodoroTimer 
                activeTaskText={activeTask?.text || null}
                onTimerComplete={handleTimerComplete}
            />
        </div>

        <div className="lg:col-span-1">
            <GeminiTaskBreaker onAddSubTasks={handleAddSubTasks} />
        </div>
      </main>

      <footer className="text-center mt-12 text-slate-500 text-sm">
        <p>Criado com React, Tailwind CSS, e Gemini AI.</p>
      </footer>
    </div>
  );
};

export default App;
