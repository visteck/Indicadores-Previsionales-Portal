import { validateResponse } from './validate';
import type { Periodo } from './validate';
export const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://victorcabrera.cl/apis/indicadores-previsionales').replace(/\/$/, '');
const messages: Record<number, string> = {
  400: 'Revisa el año y el mes indicados.',
  401: 'La consulta no fue autorizada por el servidor.',
  404: 'No hay indicadores disponibles para ese período. Prueba otro período o consulta el último almacenado.',
  500: 'La API no pudo entregar una captura válida. Intenta más tarde.',
  502: 'No se pudo obtener una captura válida desde Previred.',
  503: 'El almacenamiento de indicadores no está disponible. Intenta más tarde.',
};
export async function getAllIndicadores(periodo?: Periodo, signal?: AbortSignal) {
  const url = new URL(`${BASE_URL}/indicadores`);
  if (periodo) {
    if (!Number.isInteger(periodo.anio) || periodo.anio < 1000 || periodo.anio > 9999 || !Number.isInteger(periodo.mes) || periodo.mes < 1 || periodo.mes > 12) throw new Error(messages[400]);
    url.searchParams.set('anio', String(periodo.anio)); url.searchParams.set('mes', String(periodo.mes));
  }
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  if (signal?.aborted) controller.abort();
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, 30000);
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: controller.signal, cache: 'no-store' });
    if (!response.ok) throw new Error(messages[response.status] || `La consulta falló (HTTP ${response.status}).`);
    let body: unknown;
    try { body = await response.json(); } catch { throw new Error('La API no devolvió una respuesta JSON válida.'); }
    return validateResponse(body, periodo);
  } catch (error) {
    if (timedOut) throw new Error('El servidor tardó demasiado en responder. Vuelve a consultar.');
    if (error instanceof TypeError) throw new Error('No se pudo conectar con la API. Revisa tu conexión; si persiste, verifica el acceso CORS del servidor.');
    throw error;
  } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
}
