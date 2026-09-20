import type { ApiResponse, IndicadoresData } from '../types/api.types';
export interface Periodo { anio: number; mes: number }
const invalid = (): never => { throw new Error('La API devolvió una captura incompleta o inválida. No se mostrarán valores de reemplazo.'); };
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return invalid();
  return value as Record<string, unknown>;
}
function numeric(value: unknown) { if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) invalid(); }
function text(value: unknown) { if (typeof value !== 'string' || !value.trim()) invalid(); }
function timestamp(value: unknown) { if (typeof value !== 'string' || !value.endsWith('Z') || !Number.isFinite(Date.parse(value))) invalid(); }
export function validateResponse(input: unknown, requested?: Periodo): ApiResponse<IndicadoresData> {
  const response = object(input);
  if (response.success !== true) invalid();
  const data = object(response.data);
  if (typeof data.periodo !== 'string' || !/^(0[1-9]|1[0-2])\d{4}$/.test(data.periodo)) invalid();
  if (requested && data.periodo !== `${String(requested.mes).padStart(2, '0')}${requested.anio}`) throw new Error('La API devolvió un período diferente al solicitado.');
  for (const key of ['UF','UFAnterior','UTM','UTA','SIS','RentaMinima','RentabilidadProtegida','ExpectativaVida','TopeImponibleAFP_UF','TopeImponibleIPS_UF','TopeImponibleSC_UF']) numeric(data[key]);
  const afps = object(data.AFP);
  if (!Object.keys(afps).length) invalid();
  for (const entry of Object.values(afps)) {
    const afp = object(entry);
    for (const key of ['CodigoSuper','Cotizacion','Comision']) text(afp[key]);
    for (const key of ['Cotizacion','Comision']) if (!/^\d+(\.\d+)?$/.test(String(afp[key]))) invalid();
    for (const key of ['CargoTrabajador','CargoEmpleador','TotalPagar']) numeric(afp[key]);
  }
  const tax = object(data.impuestoUnico), family = object(data.asignacionFamiliar), insurance = object(data.seguroCesantia);
  for (const block of [tax, family, insurance]) if (block.periodo !== data.periodo) invalid();
  if (!Array.isArray(tax.tramosImpuestoUnico) || !tax.tramosImpuestoUnico.length) invalid();
  for (const entry of tax.tramosImpuestoUnico as unknown[]) {
    const bracket = object(entry);
    for (const key of ['tramoInferior','factor','rebaja']) numeric(bracket[key]);
    if (bracket.tramoSuperior !== null) numeric(bracket.tramoSuperior);
  }
  const metadata = object(tax.metadata);
  for (const key of ['descripcion','vigencia','fuente','actualizacion']) text(metadata[key]);
  const brackets = object(family.tramos);
  for (const name of ['A','B','C','D']) {
    const bracket = object(brackets[name]); numeric(bracket.monto); text(bracket.descripcion);
    const range = object(bracket.requisitos); numeric(range.minimo); numeric(range.maximo);
    if (Number(range.minimo) > Number(range.maximo)) invalid();
  }
  for (const name of ['PlazoIndefinido','PlazoFijo','PlazoIndefinido11','CasaParticular']) {
    const entry = object(insurance[name]); numeric(entry.empleador); numeric(entry.trabajador);
  }
  timestamp(data.timestamp);
  const cache = object(response.cache); timestamp(cache.lastUpdate);
  if (!['database','fresh'].includes(String(cache.source)) || data.timestamp !== cache.lastUpdate) invalid();
  text(response.version);
  return input as ApiResponse<IndicadoresData>;
}
