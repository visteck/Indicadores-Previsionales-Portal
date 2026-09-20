import { useState, useEffect } from 'react';
import { getAllIndicadores } from './services/api.service';
import type { Periodo } from './services/validate';
import type { ApiResponse, IndicadoresData } from './types/api.types';
import { Header } from './components/Header';
import { IndicatorCard } from './components/IndicatorCard';
import { AFPTable } from './components/AFPTable';
import { ImpuestoUnicoTable } from './components/ImpuestoUnicoTable';
import { LoadingSpinner, ErrorMessage } from './components/LoadingSpinner';

function App() {
  const [capture, setCapture] = useState<ApiResponse<IndicadoresData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<Periodo | undefined>();
  const [month, setMonth] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    getAllIndicadores(periodo, controller.signal).then(result => {
      if (!controller.signal.aborted) setCapture(result);
    }).catch(err => {
      if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'No se pudo completar la consulta.');
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [periodo, revision]);
  const query = (next?: Periodo) => {
    setCapture(null); setError(null); setLoading(true);
    setPeriodo(next); setRevision(value => value + 1);
  };
  const data = capture?.data;
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyWithDecimals = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Función para formatear periodo de "012026" a "enero 2026"
  const formatPeriodo = (periodo: string): string => {
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const mes = parseInt(periodo.substring(0, 2)) - 1;
    const anio = periodo.substring(2);
    return `${meses[mes]} ${anio}`;
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header onRefresh={() => query(periodo)} isRefreshing={loading} lastUpdate={capture?.cache.lastUpdate} />
        <form className="card mb-6 flex flex-wrap items-end gap-4" onSubmit={event => {
          event.preventDefault();
          const [anio, mes] = month.split('-').map(Number);
          if (!anio || !mes) return;
          query({ anio, mes });
        }}>
          <label className="font-semibold text-slate-700">Período de remuneraciones
            <input aria-label="Período de remuneraciones" type="month" required value={month}
              onChange={event => setMonth(event.target.value)} className="block border border-slate-400 rounded-lg p-2 mt-2" />
          </label>
          <button type="submit" className="bg-blue-700 text-white rounded-lg px-4 py-3">Consultar período</button>
          <button type="button" onClick={() => { setMonth(''); query(); }} className="border border-blue-700 text-blue-800 rounded-lg px-4 py-3">Último almacenado</button>
          <p className="w-full text-sm text-slate-600">Solo se muestran períodos disponibles. Consultar de nuevo no fuerza una actualización desde Previred.</p>
        </form>
        {loading && <div role="status"><LoadingSpinner /></div>}
        {error && <div role="alert"><ErrorMessage message={error} onRetry={() => query(periodo)} /></div>}
        {data && capture && <>
        <div className="mb-6 rounded-lg bg-blue-100 text-blue-950 p-4" role="status">
          <strong>Período mostrado: {formatPeriodo(data.periodo)}</strong>
          <p>Origen: {capture.cache.source === 'database' ? 'Captura almacenada' : 'Nueva captura'} · API {capture.version}</p>
        </div>
        {/* Grid de indicadores principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <IndicatorCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="UF (Unidad de Fomento)"
            value={formatCurrencyWithDecimals(data.UF)}
            subtitle={`UF anterior: ${formatCurrencyWithDecimals(data.UFAnterior)}`}
            color="primary"
            badge={formatPeriodo(data.periodo)}
          />

          <IndicatorCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
            title="UTM (Unidad Tributaria Mensual)"
            value={formatCurrency(data.UTM)}
            color="green"
            badge={formatPeriodo(data.periodo)}
          />

          <IndicatorCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            title="UTA (Unidad Tributaria Anual)"
            value={formatCurrency(data.UTA)}
            color="blue"
            badge={formatPeriodo(data.periodo)}
          />

          <IndicatorCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            title="SIS (Seguro Invalidez y Sobrevivencia)"
            value={`${data.SIS}%`}
            color="purple"
            badge={formatPeriodo(data.periodo)}
          />

          <IndicatorCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            title="Renta Mínima"
            value={formatCurrency(data.RentaMinima)}
            subtitle="Trabajadores dependientes"
            color="orange"
            badge={formatPeriodo(data.periodo)}
          />

          <IndicatorCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            title="Tope Imponible AFP"
            value={`${data.TopeImponibleAFP_UF} UF`}
            subtitle={formatCurrency(data.TopeImponibleAFP_UF * data.UF)}
            color="primary"
            badge={formatPeriodo(data.periodo)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <IndicatorCard icon="%" title="Rentabilidad Protegida" value={`${data.RentabilidadProtegida.toLocaleString('es-CL')} %`} badge={formatPeriodo(data.periodo)} />
          <IndicatorCard icon="%" title="Expectativa de Vida" value={`${data.ExpectativaVida.toLocaleString('es-CL')} %`} subtitle="Tasa porcentual" badge={formatPeriodo(data.periodo)} />
          <IndicatorCard icon="UF" title="Tope Imponible IPS" value={`${data.TopeImponibleIPS_UF.toLocaleString('es-CL')} UF`} subtitle={`Equivalente con UF de la captura: ${formatCurrency(data.TopeImponibleIPS_UF * data.UF)}`} />
          <IndicatorCard icon="UF" title="Tope Seguro de Cesantía" value={`${data.TopeImponibleSC_UF.toLocaleString('es-CL')} UF`} subtitle={`Equivalente con UF de la captura: ${formatCurrency(data.TopeImponibleSC_UF * data.UF)}`} />
        </div>
        <p className="text-slate-700 mb-5">Los cargos del empleador se muestran separados de los descuentos del trabajador. El total AFP no equivale al descuento del trabajador.</p>
        {/* Tabla de AFP */}
        <div className="mb-8">
          <AFPTable data={data.AFP} />
        </div>

        {/* Tabla de Impuesto Único */}
        <div className="mb-8">
          <ImpuestoUnicoTable tramos={data.impuestoUnico.tramosImpuestoUnico} />
        </div>

        <p className="text-sm text-slate-600 mb-8">Impuesto Único · Vigencia: {data.impuestoUnico.metadata.vigencia}. {data.impuestoUnico.metadata.fuente}</p>
        {/* Asignación Familiar */}
        <div className="mb-8">
          <div className="card animate-slide-up">
            <div className="card-header">
              <div className="p-3 rounded-xl bg-green-50 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="card-title">Asignación Familiar por Tramos</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.asignacionFamiliar?.tramos && Object.entries(data.asignacionFamiliar.tramos).map(([key, tramo]) => (
                <div key={key} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 mb-1">Tramo {key}</div>
                  <div className="text-3xl font-bold text-slate-800 mb-2">
                    {formatCurrency(tramo.monto)}
                  </div>
                  <div className="text-sm text-slate-600">{tramo.descripcion}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seguro de Cesantía */}
        <div className="mb-8">
          <div className="card animate-slide-up">
            <div className="card-header">
              <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="card-title">Seguro de Cesantía (AFC)</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Tipo de Contrato</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Empleador</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Trabajador</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-800">Plazo Indefinido</td>
                    <td className="py-3 px-4 text-orange-600 font-semibold">{data.seguroCesantia.PlazoIndefinido.empleador}%</td>
                    <td className="py-3 px-4 text-orange-600 font-semibold">{data.seguroCesantia.PlazoIndefinido.trabajador}%</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-800">Plazo Fijo / Obra</td>
                    <td className="py-3 px-4 text-orange-600 font-semibold">{data.seguroCesantia.PlazoFijo.empleador}%</td>
                    <td className="py-3 px-4 text-orange-600 font-semibold">{data.seguroCesantia.PlazoFijo.trabajador}%</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-800">Plazo Indefinido +11 años</td>
                    <td className="py-3 px-4 text-orange-600 font-semibold">{data.seguroCesantia.PlazoIndefinido11.empleador}%</td>
                    <td className="py-3 px-4 text-orange-600 font-semibold">{data.seguroCesantia.PlazoIndefinido11.trabajador}%</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-800">Casa Particular</td>
                    <td className="py-3 px-4 text-orange-600 font-semibold">{data.seguroCesantia.CasaParticular.empleador}%</td>
                    <td className="py-3 px-4 text-orange-600 font-semibold">{data.seguroCesantia.CasaParticular.trabajador}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-slate-600">
          <p className="mb-2">
            Datos obtenidos desde{' '}
            <a 
              href="https://www.previred.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Previred.com
            </a>
          </p>
          <p className="text-sm">
            Desarrollado por{' '}
            <a 
              href="https://victorcabrera.cl/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Victor Cabrera
            </a>
            {' • '}Período: {formatPeriodo(data.periodo)}
          </p>
        </footer>
        </>}
      </div>
    </div>
  );
}

export default App;
