import React from 'react';
import type { AFPData } from '../types/api.types';

interface AFPTableProps {
  data: AFPData;
}

export const AFPTable: React.FC<AFPTableProps> = ({ data }) => {
  const afps = Object.entries(data);

  return (
    <div className="card animate-slide-up">
      <div className="card-header">
        <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="card-title">Administradoras de Fondos de Pensiones (AFP)</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">AFP</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Cotización</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Comisión</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Trabajador</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Empleador</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Total AFP</th>
            </tr>
          </thead>
          <tbody>
            {afps.map(([name, afp]) => (
              <tr key={name} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-800">{name}</td>
                <td className="py-3 px-4 text-slate-600">{afp.Cotizacion}%</td>
                <td className="py-3 px-4 font-semibold text-primary-600">{afp.Comision}%</td>
                <td className="py-3 px-4 text-slate-800">{afp.CargoTrabajador.toLocaleString('es-CL')} %</td>
                <td className="py-3 px-4 text-slate-800">{afp.CargoEmpleador.toLocaleString('es-CL')} %</td>
                <td className="py-3 px-4 text-slate-800">{afp.TotalPagar.toLocaleString('es-CL')} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
