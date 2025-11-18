
import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  isActive: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  onFocus: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, isActive, onToggle, onDelete, onUpdate, onFocus }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleUpdate = () => {
    if (editText.trim()) {
      onUpdate(task.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Escape') {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  return (
    <li className={`flex items-center p-3 rounded-lg transition-colors duration-200 group ${isActive ? 'bg-slate-700' : 'hover:bg-slate-800'}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="form-checkbox h-5 w-5 rounded-md bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
      />
      <div className="flex-1 ml-4">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={handleKeyDown}
            className="w-full bg-slate-600 text-slate-100 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        ) : (
          <span
            className={`cursor-pointer ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}
            onDoubleClick={() => !task.completed && setIsEditing(true)}
          >
            {task.text}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!task.completed && !isActive && (
          <button onClick={() => onFocus(task.id)} className="p-1 text-slate-400 hover:text-cyan-400" title="Focar na tarefa">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5a1 1 0 112 0v2.252a1 1 0 01-.342.743l-2.5 2.5a1 1 0 01-1.414-1.414l2.05-2.05V5z" clipRule="evenodd" /></svg>
          </button>
        )}
        {!task.completed && (
            <button onClick={() => setIsEditing(true)} className="p-1 text-slate-400 hover:text-yellow-400" title="Editar tarefa">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
            </button>
        )}
        <button onClick={() => onDelete(task.id)} className="p-1 text-slate-400 hover:text-red-400" title="Deletar tarefa">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
