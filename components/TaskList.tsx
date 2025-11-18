
import React, { useState } from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import PlusIcon from './icons/PlusIcon';

interface TaskListProps {
  tasks: Task[];
  activeTaskId: string | null;
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, text: string) => void;
  onFocusTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, activeTaskId, onAddTask, onToggleTask, onDeleteTask, onUpdateTask, onFocusTask }) => {
  const [newTaskText, setNewTaskText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim());
      setNewTaskText('');
    }
  };
  
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="bg-slate-800/50 p-6 rounded-3xl h-full flex flex-col">
      <h2 className="text-2xl font-bold text-slate-100 mb-4">Minhas Tarefas</h2>
      
      <form onSubmit={handleSubmit} className="flex items-center mb-4">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Adicionar nova tarefa..."
          className="flex-1 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
        />
        <button
          type="submit"
          className="ml-2 p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
          disabled={!newTaskText.trim()}
          aria-label="Adicionar Tarefa"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        <h3 className="text-lg font-semibold text-slate-300 mt-4 mb-2">A fazer ({pendingTasks.length})</h3>
        <ul className="space-y-2">
            {pendingTasks.length > 0 ? (
                pendingTasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    isActive={task.id === activeTaskId}
                    onToggle={onToggleTask}
                    onDelete={onDeleteTask}
                    onUpdate={onUpdateTask}
                    onFocus={onFocusTask}
                />
                ))
            ) : (
                <p className="text-slate-500 text-center py-4">Nenhuma tarefa pendente!</p>
            )}
        </ul>

        {completedTasks.length > 0 && (
             <>
                <h3 className="text-lg font-semibold text-slate-300 mt-6 mb-2">Concluídas ({completedTasks.length})</h3>
                <ul className="space-y-2">
                {completedTasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        isActive={task.id === activeTaskId}
                        onToggle={onToggleTask}
                        onDelete={onDeleteTask}
                        onUpdate={onUpdateTask}
                        onFocus={onFocusTask}
                    />
                ))}
                </ul>
            </>
        )}
      </div>
    </div>
  );
};

export default TaskList;
