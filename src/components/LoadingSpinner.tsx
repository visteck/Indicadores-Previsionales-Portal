import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-48">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mb-4"></div>
        <p className="text-xl font-semibold text-slate-700">Cargando indicadores...</p>
        <p className="text-sm text-slate-500 mt-2">Consultando indicadores disponibles</p>
      </div>
    </div>
  );
};

export const ErrorMessage: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-48 p-4">
      <div className="card max-w-md text-center">
        <div className="p-4 rounded-full bg-red-50 text-red-600 inline-block mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Error al cargar datos</h2>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="px-6 py-3 rounded-xl font-semibold bg-primary-500 text-white hover:bg-primary-600 transition-colors"
          >
            Reintentar
          </button>

        </div>
        <p className="text-xs text-slate-500 mt-4">
          Si el problema persiste, la API podría estar temporalmente fuera de servicio.
        </p>
      </div>
    </div>
  );
};
