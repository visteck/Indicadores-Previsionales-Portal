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
- El selector se inicializa con el último período almacenado y vuelve a él si se vacía.
- Volver a consultar realiza una lectura normal; nunca envía refresh=true ni tokens.
- Las respuestas se validan antes de mostrarse: estado, tipos, campos requeridos,
  períodos internos y metadatos de captura. La validación de negocio reside en la API.
- Al cambiar una consulta se cancela la anterior y se retiran los datos previos.
- 404 permite seleccionar otro período; 500/502/503 no usan valores ficticios.
- No existe modo de demostración ni fallback a mocks en producción.
- Fecha de captura tomada del servidor, presentada en UTC.
- AFP: cotización, comisión, trabajador, empleador y total. Cargos separados.
- SIS, RentabilidadProtegida y ExpectativaVida se presentan como porcentajes.
- UF, UTM, UTA, SIS, Renta Mínima, Rentabilidad Protegida y Expectativa de Vida
  muestran un gráfico de área compacto con el período seleccionado y sus doce
  meses previos.
- Las tendencias consultan los períodos históricos de la API; si alguno no está
  disponible, se informa sin ocultar los indicadores del período seleccionado.
- Se muestran los topes APV mensual y anual en CLP, la distribución de salud
  CCAF/FONASA y las cotizaciones de trabajos pesados separadas por empleador y
  trabajador.
- Impuesto Único usa tramosImpuestoUnico: tramoInferior, tramoSuperior, factor
  decimal y rebaja UTM, junto a metadata de vigencia.
- Topes AFP, IPS y cesantía en UF; equivalentes en pesos calculados con la UF
  de la captura. No se deducen fechas de UF que no estén en el contrato.

No incluye importación histórica ni actualización mensual automática.

## Pruebas y validación

`npm test` ejecuta pruebas offline de contrato y transporte y renderiza las tablas
AFP, tributaria y de cotizaciones adicionales, además de la tarjeta con sparkline.
El fixture es una respuesta real del endpoint para el período 092026; ver
test/fixtures/README.md. Los fixtures no se incluyen en dist.

El 21-10-2026 se verificaron respuestas públicas HTTP 200 de `/indicadores`
(período 102026) y de la consulta exacta para 092026; ambas contienen los campos
adicionales documentados aquí. Esto no certifica vigencia normativa ni disponibilidad futura.

Las pruebas, el build, ESLint y la revisión visual local pasan. Pendiente prueba
desde la URL final del portal, aún no definida. No se ha publicado este paquete.

Consultar DEPLOY_CPANEL.md para publicación y reversión.
