import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const folder = mkdtempSync(`${process.cwd()}/.test-build-`);
let count = 0;
const originalFetch = globalThis.fetch;
try {
  for (const name of ['validate','api.service']) {
    const source = readFileSync(`src/services/${name}.ts`, 'utf8')
      .replace("'./validate'", "'./validate.mjs'")
      .replace('import.meta.env.VITE_API_BASE_URL', 'undefined');
    writeFileSync(`${folder}/${name}.mjs`, ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText);
  }
  const { validateResponse } = await import(pathToFileURL(`${folder}/validate.mjs`));
  const { getAllIndicadores } = await import(pathToFileURL(`${folder}/api.service.mjs`));
  const fixture = JSON.parse(readFileSync('test/fixtures/capture.json','utf8'));
  const test = async (name, fn) => { await fn(); count++; console.log(`OK ${count}: ${name}`); };
  await test('Acepta el contrato real con metadatos, AFP completas y ocho tramos', () => {
    const result = validateResponse(fixture, {anio:2026,mes:9});
    assert.equal(result.data.impuestoUnico.tramosImpuestoUnico.length,8);
    assert.equal(result.data.AFP.Capital.CargoEmpleador,0.1);
    assert.equal(result.data.ExpectativaVida,0.72);
  });
  await test('Rechaza período distinto sin sustituirlo', () => assert.throws(() => validateResponse(fixture,{anio:2026,mes:8}), /diferente/));
  for (const [name, mutate] of [
    ['SIS ausente', f => {delete f.data.SIS;}],
    ['cargo AFP ausente', f => {delete f.data.AFP.Capital.CargoEmpleador;}],
    ['contrato tributario antiguo', f => {f.data.impuestoUnico.tramos=f.data.impuestoUnico.tramosImpuestoUnico;delete f.data.impuestoUnico.tramosImpuestoUnico;}],
    ['períodos internos diferentes', f => {f.data.asignacionFamiliar.periodo='082026';}],
    ['timestamp inventado o inválido', f => {f.cache.lastUpdate='invalid';}],
    ['origen desconocido', f => {f.cache.source='cache';}],
  ]) await test(`Rechaza ${name}`, () => {const f=structuredClone(fixture);mutate(f);assert.throws(()=>validateResponse(f));});
  await test('Acepta ceros legítimos de cesantía y tramo D', () => { const result=validateResponse(fixture);assert.equal(result.data.asignacionFamiliar.tramos.D.monto,0);assert.equal(result.data.seguroCesantia.PlazoFijo.trabajador,0); });
  await test('Lectura exacta con anio/mes, sin token ni refresh', async () => {
    let calls=0;
    globalThis.fetch=async(url,options)=>{calls++;assert.equal(url.pathname,'/apis/indicadores-previsionales/indicadores');assert.equal(url.search,'?anio=2026&mes=9');assert.deepEqual(options.headers,{Accept:'application/json'});return Response.json(fixture);};
    assert.equal((await getAllIndicadores({anio:2026,mes:9})).cache.lastUpdate,fixture.cache.lastUpdate);assert.equal(calls,1);
  });
  await test('Último almacenado sin parámetros de fecha', async () => {
    globalThis.fetch=async(url)=>{assert.equal(url.search,'');return Response.json(fixture);};await getAllIndicadores();
  });
  for (const [status, pattern] of [[404,/No hay indicadores/],[503,/almacenamiento/],[502,/Previred/]]) await test(`HTTP ${status} sin fallback`, async () => {
    let calls=0;globalThis.fetch=async()=>{calls++;return new Response('error',{status});};await assert.rejects(getAllIndicadores(),pattern);assert.equal(calls,1);
  });
  await test('Rechaza HTML cuando se espera JSON', async()=>{globalThis.fetch=async()=>new Response('<html>');await assert.rejects(getAllIndicadores(),/JSON/);});
  await test('Validación local de mes evita solicitud inválida', async()=>{globalThis.fetch=async()=>{throw Error('No debería consultar');};await assert.rejects(getAllIndicadores({anio:2026,mes:13}),/Revisa/);});
  await test('Cancela solicitudes anteriores', async()=>{
    globalThis.fetch=(_url,{signal})=>new Promise((_resolve,reject)=>{signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')));});
    const controller=new AbortController();const pending=getAllIndicadores(undefined,controller.signal);controller.abort();await assert.rejects(pending,{name:'AbortError'});
  });
  for (const component of ['AFPTable','ImpuestoUnicoTable']) {
    const file = `${folder}/${component}.cjs`;
    writeFileSync(file, ts.transpileModule(readFileSync(`src/components/${component}.tsx`,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText);
    const View=createRequire(import.meta.url)(file)[component];
    await test(`Renderiza ${component} con el contrato actual`,()=>{
      const props=component==='AFPTable'?{data:fixture.data.AFP}:{tramos:fixture.data.impuestoUnico.tramosImpuestoUnico};
      const html=renderToStaticMarkup(createElement(View,props));
      assert.ok(!html.includes('NaN'));
      if(component==='AFPTable'){assert.ok(html.includes('Empleador'));assert.ok(html.includes('11,54'));}
      else {assert.ok(html.includes('38.82'));assert.ok(html.includes('Sin límite superior'));}
    });
  }
  console.log(`${count} pruebas aprobadas.`);
} finally { globalThis.fetch=originalFetch;rmSync(folder,{recursive:true,force:true}); }
