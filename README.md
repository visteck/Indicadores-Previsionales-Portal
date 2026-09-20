# Portal de indicadores previsionales

Frontend React + TypeScript + Vite que consume la API pública de indicadores
previsionales. Publicación estática en cPanel: no requiere proceso Node en hosting.

## Desarrollo

Con Node compatible con Vite 7 (20.19+ o 22.12+):

```sh
npm ci
npm run dev
npm test
npm run lint
npm run build
npm run preview
```

La API se configura opcionalmente en `.env.local` usando `.env.example`.
VITE_API_BASE_URL es una URL pública y se incorpora durante el build. No colocar
credenciales ni ADMIN_REFRESH_TOKEN en variables VITE ni en el código frontend.

## Integración

- GET /indicadores sin parámetros: último período almacenado.
- GET /indicadores?anio=2026&mes=9: consulta exacta; el portal verifica 092026.
- Volver a consultar realiza una lectura normal; nunca envía refresh=true ni tokens.
- Las respuestas se validan antes de mostrarse: tipos, campos requeridos,
  períodos internos y metadatos de captura. La validación de negocio reside en la API.
- Al cambiar una consulta se cancela la anterior y se retiran los datos previos.
- 404 permite seleccionar otro período; 500/502/503 no usan valores ficticios.
- No existe modo de demostración ni fallback a mocks en producción.
- Fecha de captura tomada del servidor, presentada en UTC.
- AFP: cotización, comisión, trabajador, empleador y total. Cargos separados.
- SIS, RentabilidadProtegida y ExpectativaVida se presentan como porcentajes.
- Impuesto Único usa tramosImpuestoUnico: tramoInferior, tramoSuperior, factor
  decimal y rebaja UTM, junto a metadata de vigencia.
- Topes AFP, IPS y cesantía en UF; equivalentes en pesos calculados con la UF
  de la captura. No se deducen fechas de UF que no estén en el contrato.

No incluye importación histórica ni actualización mensual automática.

## Pruebas y validación

`npm test` ejecuta pruebas offline de contrato y transporte y renderiza las tablas
AFP/tributaria. El fixture procede del HTML real aportado en la revisión de la API;
ver test/fixtures/README.md. Los fixtures no se incluyen en dist.

Se verificó adicionalmente una respuesta pública HTTP 200 de /indicadores,
período 092026 y origen database, aceptada por el validador el 20-09-2026.
Esto no certifica vigencia normativa ni disponibilidad futura.

El build y ESLint pasan. Pendiente revisión visual en navegador y prueba desde la
URL final del portal, aún no definida. No se ha publicado este paquete.

Consultar DEPLOY_CPANEL.md para publicación y reversión.
