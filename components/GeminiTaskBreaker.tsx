
import React, { useState } from 'react';
import { breakDownTask } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';

interface GeminiTaskBreakerProps {
  onAddSubTasks: (subTasks: string[]) => void;
}

const GeminiTaskBreaker: React.FC<GeminiTaskBreakerProps> = ({ onAddSubTasks }) => {
  const [complexTask, setComplexTask] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBreakDown = async () => {
    if (!complexTask.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const subTasks = await breakDownTask(complexTask);
      onAddSubTasks(subTasks);
      setComplexTask('');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-3xl h-full flex flex-col">
      <div className="flex items-center mb-4">
        <SparklesIcon className="w-6 h-6 text-indigo-400 mr-3"/>
        <h2 className="text-2xl font-bold text-slate-100">Quebrar Tarefa com IA</h2>
      </div>
      <p className="text-slate-400 mb-4">
        Tem uma tarefa grande? Descreva-a abaixo e a IA irá dividi-la em etapas menores e gerenciáveis.
      </p>
      <textarea
        value={complexTask}
        onChange={(e) => setComplexTask(e.target.value)}
        placeholder="Ex: Criar uma apresentação sobre o projeto X..."
        className="w-full h-24 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors mb-4 resize-none"
        rows={3}
      />
      <button
        onClick={handleBreakDown}
        disabled={isLoading || !complexTask.trim()}
        className="w-full flex justify-center items-center bg-indigo-600 text-white font-semibold rounded-lg px-4 py-3 hover:bg-indigo-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5 mr-2" />
            Quebrar Tarefa
          </>
        )}
      </button>
      {error && <p className="text-red-400 mt-2 text-sm text-center">{error}</p>}
    </div>
  );
};

export default GeminiTaskBreaker;
