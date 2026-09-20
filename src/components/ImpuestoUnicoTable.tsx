import React from 'react';
import type { TramoImpuestoUnico } from '../types/api.types';

interface ImpuestoUnicoTableProps {
  tramos: TramoImpuestoUnico[];
}

export const ImpuestoUnicoTable: React.FC<ImpuestoUnicoTableProps> = ({ tramos }) => {
  const formatNumber = (num: number | null) => {
    if (num === null) return 'En adelante';
    return new Intl.NumberFormat('es-CL').format(num);
  };


  // Validación de datos
  if (!tramos || !Array.isArray(tramos) || tramos.length === 0) {
    return (
      <div className="card animate-slide-up">
        <div className="card-header">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="card-title">Tramos Impuesto Único (UTM)</h3>
        </div>
        <p className="text-slate-600">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="card animate-slide-up">
      <div className="card-header">
        <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="card-title">Tramos Impuesto Único (UTM)</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Desde</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Hasta</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Factor</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Rebaja (UTM)</th>
            </tr>
          </thead>
          <tbody>
            {tramos.map((tramo, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 text-slate-600">{formatNumber(tramo.tramoInferior)} UTM</td>
                <td className="py-3 px-4 text-slate-600">{tramo.tramoSuperior === null ? 'Sin límite superior' : `${formatNumber(tramo.tramoSuperior)} UTM`}</td>
                <td className="py-3 px-4 font-semibold text-purple-600">{tramo.factor.toLocaleString('es-CL', {maximumFractionDigits: 4})}</td>
                <td className="py-3 px-4 text-slate-600">{tramo.rebaja} UTM</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
