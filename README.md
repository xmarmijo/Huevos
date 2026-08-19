# MisHuevos - Sistema de Gestión para Venta de Huevos

**Última actualización:** 16/08/2026

## Descripción General

Aplicación web móvil para gestionar la venta de huevos por bandejas y cajas. Funciona 100% offline en cualquier navegador (Chrome, Brave, Edge, Safari) sin necesidad de servidor.

---

## Estado del Proyecto

**Versión actual:** 107.2KB | 40 pruebas automatizadas

### Módulos Implementados

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| Stock | ✅ Completo | Muestra bandejas y cajas en pantalla principal. Alerta de stock bajo. |
| Venta | ✅ Completo | Registro de ventas con producto, cantidad, pago (efectivo/transferencia/deuda), cliente. |
| Feria | ✅ Completo | Registro rápido para vender en feria. Soporta bandejas y cajas (6 bandejas). |
| Compras | ✅ Completo | Registro de compras a proveedores con fecha y precio por caja. |
| Gastos | ✅ Completo | Registro de gastos operativos. |
| Merma | ✅ Completo | Registro de huevos perdidos con cálculo de pérdida. |
| Deudas | ✅ Completo | Lista de clientes que deben. Pago parcial/total. Aviso de deudas 7+ días. |
| Cierre de día | ✅ Completo | Resumen diario: ventas, transferencias, gastos, compras, merma, neto. Botón para cerrar día. |
| Resumen | ✅ Completo | Ganancias de hoy, semana y mes. Actividad total. |
| Cambio | ✅ Completo | Calculadora de vuelto. Muestra efectivo y transferencias del día. |
| Control de Caja | ✅ Completo | Movimientos del día (entradas/salidas). |
| Arqueo | ✅ Completo | Control de efectivo: inicial + ventas vs. contado. Dice si cuadra, falta o sobra. |
| Ajustar Stock | ✅ Completo | Botones −6/−1/+1/+6 y campos para escribir stock exacto. |
| Historial Ventas | ✅ Completo | Tabla completa de todas las ventas con totales. |
| Respaldar | ✅ Completo | Exportar/importar datos JSON. Aviso si pasan 7+ días sin respaldo. |
| Excel/CSV | ✅ Completo | Exporta CSV con: resumen, ventas por día, gastos, compras, merma, deudas. |
| Sincronizar | ✅ Completo | Opcional: Firebase para sincronizar entre navegadores/dispositivos. |

### Módulos Eliminados

| Módulo | Motivo |
|--------|--------|
| Punto de Equilibrio | Redundante con Cierre de día y Resumen. |
| Tema | Se eliminó para simplificar la interfaz. |

---

## Funciones Especiales

1. **Memoria de precios** — La app recuerda el precio de productos extra (aguacate, ají, etc.) y lo autocompleta.

2. **Vibración y sonido** — Al registrar una venta, el celular vibra y suena para confirmar.

3. **Recordatorio de respaldo** — Si pasan 7+ días sin exportar, aparece un aviso.

4. **Recordatorio de deudas** — Si una deuda tiene 7+ días, avisa al abrir la app.

5. **Cerrar día** — Guarda el efectivo contado como punto de partida para mañana.

---

## Estructura de Archivos

```
HuevosApp/
├── MisHuevos_Movil.html      # App principal (móvil)
├── ControlHuevos_Movil.html  # Versión anterior
├── index.html                # Versión web (no usada)
├── README.md                 # Este archivo
└── Backups/
    └── MisHuevos_Movil_backup_20260815_225231.html
```

---

## Datos Guardados

La app guarda todo en `localStorage` bajo la clave `misHuevos`. Estructura:

```javascript
{
  stock: { Primera: 18, Segunda: 12 },      // bandejas
  precios: { Primera: 7090, Segunda: 5890 }, // precio por bandeja
  feriaPrecio: 6000,
  margen: 18,                                // % de ganancia
  umbral: 2,                                 // alerta stock bajo
  ventas: [],                                // historial de ventas
  compras: [],                               // historial de compras
  mermas: [],                                // historial de merma
  gastos: [],                                // historial de gastos
  deudas: [],                                // clientes que deben
  arqueoInicial: 0,                          // con cuánto empezaste hoy
  arqueoFecha: '',                           // fecha del arqueo
  arqueoInicialManana: 0,                    // punto de partida mañana
  ultimoRespaldo: null,                      // timestamp último backup
  productosExtra: {}                         // precios recordados
}
```

---

## Constantes del Negocio

```javascript
INVERSION = 141830                    // Inversión inicial
COSTO_BTX = { Primera: 6000, Segunda: 5000 }  // Costo por bandeja
CAJA = 6                              // Bandejas por caja
```

---

## Cómo Usar

### Primer uso
1. Abrir `MisHuevos_Movil.html` en el navegador del celular.
2. Ajustar stock inicial en 🔧 Stock.
3. Configurar precios en 📈 Resumen → ⚙️.

### Venta diaria
1. Tocar 📦 VENDER o 🎪 FERIA.
2. Elegir producto (Primera/Segunda), cantidad, tipo de pago.
3. Registrar.

### Cierre del día
1. Abrir 🌙 Cierre de día.
2. Revisar el resumen.
3. Escribir cuánto tienes contado y tocar 🔒 Cerrar día.

### Respaldo
1. Tocar 💾 Respaldar.
2. 📤 Exportar datos o 📊 Excel.
3. Guardar el archivo en un lugar seguro.

---

## Sincronización entre dispositivos

Para ver los mismos datos en otro navegador o celular:

1. Crear proyecto en Firebase (gratis, ~10 min).
2. En la app: ☁️ Sincronizar → pegar configuración → Guardar.
3. Repetir en cada dispositivo con la MISMA configuración.

Sin Firebase, cada navegador mantiene sus datos por separado.

---

## Pruebas Automatizadas

Archivo de pruebas: `test_app.js` (en temp)

Ejecutar:
```bash
node test_app.js
```

Resultado esperado: **40 OK, 0 FAIL**

---

## Próximas Mejoras (Sugeridas)

- [ ] Bloquear día anterior para evitar ediciones accidentales
- [ ] Exportar PDF del cierre de día
- [ ] Gráfico de ventas en la app (sin Excel)
- [ ] Múltiples precios por cliente frecuente

---

## Contacto / Soporte

Este proyecto fue desarrollado con Kiro AI. Para cambios o mejoras, abrir el archivo `MisHuevos_Movil.html` y solicitar modificaciones.
