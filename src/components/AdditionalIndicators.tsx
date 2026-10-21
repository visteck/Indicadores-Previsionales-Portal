import React from 'react';
import type {
  APVData,
  CotizacionTrabajosPesadosData,
  DistribucionSaludCCAFData,
} from '../types/api.types';

interface AdditionalIndicatorsProps {
  apv: APVData;
  distribucionSaludCCAF: DistribucionSaludCCAFData;
  cotizacionTrabajosPesados: CotizacionTrabajosPesadosData;
}

const currencyFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

const formatPercentage = (value: number) =>
  `${value.toLocaleString('es-CL', { maximumFractionDigits: 2 })}%`;

export const AdditionalIndicators: React.FC<AdditionalIndicatorsProps> = ({
  apv,
  distribucionSaludCCAF,
  cotizacionTrabajosPesados,
}) => {
  const healthContributions = [
    { label: 'CCAF', rate: distribucionSaludCCAF.CCAF },
    { label: 'FONASA', rate: distribucionSaludCCAF.FONASA },
  ];
  const heavyWorkContributions = [
    { label: 'Trabajo pesado', rates: cotizacionTrabajosPesados.trabajoPesado },
    { label: 'Trabajo menos pesado', rates: cotizacionTrabajosPesados.trabajoMenosPesado },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
      <section className="card animate-slide-up">
        <div className="card-header">
          <div className="p-3 rounded-xl bg-cyan-50 text-cyan-700 font-semibold" aria-hidden="true">APV</div>
          <h3 className="card-title">Topes de Ahorro Previsional Voluntario</h3>
        </div>
        <p className="text-sm text-slate-500 mb-3">Montos expresados en pesos chilenos.</p>
        <dl className="space-y-3">
          <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
            <dt className="text-slate-600">Mensual</dt>
            <dd className="font-semibold text-slate-800">{currencyFormatter.format(apv.topeMensual)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-600">Anual</dt>
            <dd className="font-semibold text-slate-800">{currencyFormatter.format(apv.topeAnual)}</dd>
          </div>
        </dl>
      </section>

      <section className="card animate-slide-up">
        <div className="card-header">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 font-semibold" aria-hidden="true">7%</div>
          <h3 className="card-title">Distribución de cotización de salud</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th scope="col" className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Entidad</th>
                <th scope="col" className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Cotización</th>
              </tr>
            </thead>
            <tbody>
              {healthContributions.map(({ label, rate }) => (
                <tr key={label} className="border-b border-slate-100">
                  <th scope="row" className="text-left py-3 px-4 font-medium text-slate-800">{label}</th>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">{formatPercentage(rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card animate-slide-up">
        <div className="card-header">
          <div className="p-3 rounded-xl bg-orange-50 text-orange-700 font-semibold" aria-hidden="true">+</div>
          <h3 className="card-title">Cotización por trabajos pesados</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th scope="col" className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Tipo de trabajo</th>
                <th scope="col" className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Empleador</th>
                <th scope="col" className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Trabajador</th>
                <th scope="col" className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {heavyWorkContributions.map(({ label, rates }) => (
                <tr key={label} className="border-b border-slate-100">
                  <th scope="row" className="text-left py-3 px-4 font-medium text-slate-800">{label}</th>
                  <td className="py-3 px-4 text-slate-600">{formatPercentage(rates.empleador)}</td>
                  <td className="py-3 px-4 text-slate-600">{formatPercentage(rates.trabajador)}</td>
                  <td className="py-3 px-4 font-semibold text-orange-700">{formatPercentage(rates.cotizacion)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
