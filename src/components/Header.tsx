import React from 'react';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdate?: string;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, isRefreshing, lastUpdate }) => {
  return (
    <header className="bg-white shadow-lg rounded-2xl p-6 mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
            <span
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary-600 p-3 text-white"
              aria-hidden="true"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5m0 14h16M7 16v-4m4 4V8m4 8v-6m4 6V5" />
              </svg>
            </span>
            <span>Indicadores Previsionales Chile</span>
          </h1>
          <p className="text-slate-600 mt-2">
            Capturas previsionales por período
          </p>
          {lastUpdate && (
            <p className="text-sm text-slate-500 mt-1">
              Fecha de captura: {new Date(lastUpdate).toLocaleString('es-CL', { timeZone: 'UTC' })} UTC
            </p>
          )}
        </div>
        
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`
            px-6 py-3 rounded-xl font-semibold
            bg-gradient-to-r from-primary-500 to-indigo-500 
            text-white shadow-lg hover:shadow-xl
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:scale-105 active:scale-95
            flex items-center gap-2
          `}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isRefreshing ? 'Consultando...' : 'Volver a consultar'}
        </button>
      </div>
    </header>
  );
};
