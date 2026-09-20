# Publicación estática en cPanel

## Archivos preparados

- portal-produccion.zip: contenido de dist (index.html, assets y .htaccess).
- portal-actualizado.zip: fuentes, lockfile, pruebas, documentación y dist.

La URL y la carpeta final deben confirmarse antes de publicar. Elegir una carpeta
propia del portal, independiente de la raíz de la API Express y de sus docs.
No se requiere crear otra aplicación Node, ejecutar npm en cPanel ni reiniciar la API.

## Pasos

1. Identificar en Administrador de archivos la carpeta asociada a la URL elegida.
2. Si contiene un portal previo, descargar una copia completa fuera de la carpeta
   pública. Registrar sus ajustes .htaccess para poder volver a esa versión.
3. Extraer portal-produccion.zip en una carpeta temporal y revisar su contenido.
4. Subir assets a la carpeta del portal y luego reemplazar index.html. Conservar
   temporalmente assets de la versión anterior para pestañas ya abiertas.
5. Revisar el .htaccess incluido: DirectoryIndex y no-cache para HTML. Si existe
   uno en destino, integrar estas reglas sin borrar ajustes del hosting. Revisar
   que no se hereden reglas Passenger o redirecciones de otra aplicación.
6. Abrir la URL final con barra final y recarga completa. Los assets usan rutas
   relativas; funciona tanto en dominio como en subcarpeta.
7. Verificar en navegador: carga CSS/JS sin 404, consulta último almacenado,
   consulta del mismo año/mes, AFP con sus cargos, ocho tramos de impuesto,
   porcentajes, metadatos UTC, mensaje para un período ausente y vista móvil.
8. Confirmar en Network que se usa únicamente GET /indicadores (sin refresh ni
   X-Admin-Refresh-Token). La API pública observada permite CORS; comprobarlo desde
   el origen final. Revisar errores Console antes de dar el despliegue por terminado.

Si falla, restaurar index.html, assets y configuración del respaldo del portal.
No cambiar la API para ocultar errores del frontend.

## Recompilar

Si se cambia VITE_API_BASE_URL, ejecutar npm ci, npm test, npm run lint y
npm run build en el equipo de desarrollo. Publicar exclusivamente dist.
No publicar node_modules, src, fixtures ni archivos .env.

## Git local

Copiar las fuentes en el repositorio real del portal y revisar git diff antes
de agregar archivos. El ZIP recibido no contiene historial Git, por lo que aquí
no se hizo commit ni push. Mensaje sugerido:

feat: adaptar portal al contrato actual de indicadores previsionales
