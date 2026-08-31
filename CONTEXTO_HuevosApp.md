# CONTEXTO HuevosApp — para reanudar sin re-explicar

> Archivo de memoria del proyecto. Mañana abre el proyecto y dile al asistente:
> **"Lee `C:\Users\Marmijo\OneDrive\Documentos\Default Project\HuevosApp\CONTEXTO_HuevosApp.md` y continúa"**.
> Así no pierdes tiempo enseñándole desde cero.

## Qué es
PWA de control de venta de huevos (feria los domingos + ventas sueltas, compras, gastos, deudas, cajas).
Todo vive en **un solo archivo HTML con JS inline** (no framework, no build).

## Archivos clave
- **Fuente de verdad:** `C:\Users\Marmijo\OneDrive\Documentos\Default Project\HuevosApp\MisHuevos_Movil.html`
- `sw.js` — service worker; `CACHE_NAME='mis-huevos-X.Y'`
- `bump\-version.js` — sube versión
- `version.txt` — la versión ("X.Y"), única fuente
- `Backups\respaldo-datos-MisHuevos.json` — datos del usuario
- **Espejo de deploy:** `C:\Users\Marmijo\OneDrive\Documentos\GitHub\Huevos` (git pull tras push)
- Repo: `https://github.com/xmarmijo/Huevos.git` (rama `main`)

## Flujo de deploy (siempre igual)
1. Editar en `Default Project\HuevosApp`.
2. `cd "C:\Users\Marmijo\OneDrive\Documentos\Default Project\HuevosApp"; git add -A; git commit -m "..."; git push origin main`
3. `cd "C:\Users\Marmijo\OneDrive\Documentos\GitHub\Huevos"; git pull --ff-only origin main`
4. (Opcional) `node bump-version.js` ANTES del commit para subir versión.

## Versionado
- Formato `vMAYOR.MINOR` (ej. v1.7). `bump-version.js` sube MINOR; al pasar 9 reinicia a MAYOR+1.
- Muestra "v1" si minor=0, si no "v1.7". Span `#appVer` en HTML.

## Módulo Control Bancario (Banco de Chile, cuenta corriente SIN tarjeta)
Botón 🏦 en "Para revisar". Estado en `estado.banco = { saldo, saldoInicial, movs[], pendienteEfectivo[], desde }`.

**Reglas de negocio acordadas:**
- `saldoInicial`: se pone UNA vez; luego el input se bloquea (disabled). Para meter plata tuya usa **Aporte personal**, no lo toques.
- **Saldo banco (calculado)** = `saldoInicial + depósitos + aportes + vt − pagoCompra − pagoGasto − giro`.
  - `vt` = suma de ventas `pago==='transferencia'` con `f >= banco.desde` (solo desde que activó el módulo, para no duplicar).
  - Efectivo NO entra al banco hasta que lo depositas.
- **Utilidad bancaria** = `(depósitos + vt) − (pagoCompra + pagoGasto)`.
- **Aporte personal** / **Giro personal**: botones directos en el modal.
- **Efectivo al vender:** al registrar venta `efectivo` (normal, feria u "otro") sale `modalDepositoEfectivo` con 3 opciones:
  - "Sí, ya lo deposité" → agrega mov `deposito` (sube el banco).
  - "Aún no, lo llevo el lunes" → lo mete a `pendienteEfectivo` (NO sube aún).
  - "No, es efectivo personal / me lo quedo" → no hace nada.
  - El pendiente se muestra como tarjeta y con aviso global `bancoAviso` que se pone ROJO desde el domingo >=12h ("ya es hora, llévalo al banco los lunes"). Botón "Registrar depósito" suma todo el pendiente de una vez.
- **Proyección de stock:** recaudación total, costo (promedio de compras), ganancia real.
- Campo "Saldo actual / estado de cuenta" y su alerta de gap FUERON ELIMINADOS (v1.7) por confusión. El banco usa solo el saldo calculado.

**Funciones JS (ya existen, no rehacer):** `abrirBanco, renderBanco, bancoCalc, bancoProyeccion, renderBancoProy, agregarMovBanco, eliminarMovBanco, bancoSetSaldo, reiniciarBanco, preguntarDepositoBanco, depositoEfectivoSi, depositoEfectivoPendiente, depositoEfectivoPersonal, depositarAcumuladoBanco, bancoTipoRapido, actualizarAvisoBanco, bancoApremiante`.
**Gancho en ventas:** `confirmarVenta`, `confirmarFeria`, `agregarOtro` llaman `preguntarDepositoBanco(precio)` cuando `pago==='efectivo'`.

## Feria en cajas (v50)
1 caja = 6 bandejas = 180 huevos. El módulo feria trabaja en cajas. Helper global `cajasTxt(b)` → "2 cajas + 4 bandejas".

## Mejoras de feria (v2.1, 31-08)
1. **Fix visibilidad de calidad:** los botones `feriaProdPrimera`/`feriaProdSegunda` se muestran si hay stock en el negocio **O** si hay stock en la salida de feria activa (`salidaFeria.quedan[prod]>0`). Antes solo dependían del stock del negocio: si llevabas TODAS las cajas de Segunda a la feria (negocio en 0), el botón SEGUNDA desaparecía y no podías venderla. Verificado con jsdom.
2. **Auto-selección de calidad:** `abrirFeria()` ahora elige automáticamente la primera calidad disponible (Primera>Segunda>Tercera, considerando feria activa). Helper `feriaDisponible(p)`.
3. **Selectors de pago en feria:** se portó a producción el experimento de QA — la feria ahora permite elegir **Efectivo/Transferencia** (`feriaPago(p)`, `feria.pago`). `confirmarFeria` guarda `pago:feria.pago` y solo ofrece depósito a banco si `pago==='efectivo'`.

## Ambiente QA sincronizado (31-08)
- `MisHuevos_QA.html` es copia de producción con: `manifest-qa.json`, `sw-qa.js` (cache `mis-huevos-qa-v2.1`), badge `v2.1 QA`, `data-qa="1"`.
- **Aislamiento de datos:** guarda en `localStorage['misHuevosQA']` (y DB `misHuevosQADB`, `misHuevosQA_backup_auto`). NO toca los datos reales de producción. Firebase (config) sí se comparte.
- Para re-sincronizar QA desde producción, copiar `MisHuevos_Movil.html`→`MisHuevos_QA.html` y transformar: `manifest.json`→`manifest-qa.json`, `sw.js`→`sw-qa.js`, `'misHuevos'`→`'misHuevosQA'`, `misHuevosDB`→`misHuevosQADB`, `misHuevos_backup_auto`→`misHuevosQA_backup_auto`, badge→`v2.1 QA`. NO tocar `misHuevosFirebase`.

## Convenciones del código
- `fmt(n)` global → `$X.XXX` (es-CL).
- `miConfirmar(msj, callback)` para confirmaciones.
- `abrirModal(id)` / `cerrarModal(id)`.
- `guardar()` persiste (localStorage+IndexedDB+session); `actualizarTodo()` refresca UI (llama `actualizarAvisoBanco()`).
- Tests jsdom en `C:\Users\Marmijo\AppData\Local\Temp\opencode\feriatest\` (banktest1..7).

## Historial de bugs ya resueltos
- v49: el modal de feria se cerraba solo por `history.back()` en `cerrarModal`; se quitó el `history.back()` (el popstate cerraba el modal y desincronizaba). Verificado con jsdom.

## Pendiente / no hecho todavía
- [ ] Check "¿pagado con banco del negocio?" en **compras** (en gastos ya existe desde v1.8: descuenta el banco en `pagoGasto`).
- [ ] El usuario a veces pasa plata de su cuenta personal y se queda el efectivo (ya cubierto con opción 3 del aviso).

## Cómo pedir cosas al asistente
Ser directo y dar el dato del banco real. Ejemplos ya hechos: feria por cajas, backup ZIP total, versionado compacto, Control Bancario con aviso de efectivo. El asistente edita el HTML, prueba con jsdom y hace deploy.
