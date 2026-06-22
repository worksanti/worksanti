// AduanaFlow - Base de datos simulada y utilidades
// Almacena datos estáticos de aranceles y embarques iniciales

window.AduanaData = {
  // Base de datos de Fracciones Arancelarias (HS Codes)
  fraccionesArancelarias: [
    {
      codigo: "8517.13.01",
      nombre: "Teléfonos inteligentes (Smartphones) y teléfonos móviles de redes inalámbricas",
      categoria: "Electrónica",
      igi: 0, // Impuesto General de Importación (%)
      iva: 16, // Impuesto al Valor Agregado (%)
      dta: 0.8, // Derecho de Trámite Aduanero (% o tasa fija, representaremos 0.8% del valor aduana)
      rrna: [
        "NOM-024-SCFI (Información comercial para empaques)",
        "NOM-208-SCFI (Homologación de frecuencias de telecomunicaciones / IFT)"
      ],
      consejos: "Asegúrate de contar con el certificado de homologación IFT emitido a nombre del importador para evitar retención en aduana."
    },
    {
      codigo: "8471.30.01",
      nombre: "Máquinas portátiles de procesamiento de datos (Laptops, Tablets)",
      categoria: "Electrónica",
      igi: 0,
      iva: 16,
      dta: 0.8,
      rrna: [
        "NOM-019-SCFI (Seguridad de equipos de procesamiento de datos)",
        "NOM-024-SCFI (Garantías y empaques)"
      ],
      consejos: "Los adaptadores de corriente incluidos deben cumplir por separado con la NOM-001-SCFI."
    },
    {
      codigo: "6204.42.01",
      nombre: "Vestidos de algodón para mujeres o niñas",
      categoria: "Textil",
      igi: 25, // Los textiles suelen tener aranceles elevados para proteger la industria local
      iva: 16,
      dta: 0.8,
      rrna: [
        "NOM-004-SCFI (Etiquetado de información comercial en prendas de vestir)",
        "Inscripción en el Padrón de Importadores de Sectores Específicos (Sector 11: Textil y Confección)"
      ],
      consejos: "El etiquetado físico debe estar cosido a la prenda antes del cruce fronterizo. El Certificado de Origen es crucial para exentar el arancel del 25% si proviene de un país con tratado de libre comercio."
    },
    {
      codigo: "6403.99.99",
      nombre: "Calzado con suela de caucho o plástico y parte superior de cuero natural",
      categoria: "Calzado",
      igi: 30,
      iva: 16,
      dta: 0.8,
      rrna: [
        "NOM-020-SCFI (Etiquetado de cuero y materiales de calzado)",
        "Padrón Sectorial de Importadores (Sector 10: Calzado)",
        "Precios Estimados de la SHCP (Garantía mediante cuenta aduanera de garantía si el precio unitario es menor al estimado)"
      ],
      consejos: "Cuidado con los precios estimados de calzado de importación asiática; declarar por debajo del precio de referencia requiere garantía bancaria."
    },
    {
      codigo: "3004.90.99",
      nombre: "Medicamentos para uso humano acondicionados para la venta al por menor",
      categoria: "Salud / Farmacéutica",
      igi: 0,
      iva: 0, // Tasa 0% de IVA para medicinas patentes
      dta: 0.8,
      rrna: [
        "Autorización Sanitaria de Importación previa por parte de COFEPRIS",
        "Registro Sanitario vigente del producto",
        "Revisión en aduana por inspector sanitario calificado"
      ],
      consejos: "Requiere cadena de frío en aduana si el medicamento es termosensible. El agente aduanal debe coordinar la inspección sanitaria prioritaria."
    },
    {
      codigo: "0808.10.01",
      nombre: "Manzanas frescas",
      categoria: "Alimentos / Perecederos",
      igi: 20,
      iva: 0, // Alimentos frescos tasa 0%
      dta: 0.8,
      rrna: [
        "Certificado Fitosanitario de Importación emitido por SENASICA",
        "Inspección física fitosanitaria en el punto de ingreso",
        "Cumplimiento de medidas de cuarentena en caso de plagas reguladas"
      ],
      consejos: "El transporte debe ser refrigerado. Toda la documentación fitosanitaria del país de origen debe estar visada y coincidir perfectamente en peso y lotes."
    },
    {
      codigo: "8708.29.99",
      nombre: "Partes y accesorios de carrocerías para vehículos automóviles",
      categoria: "Automotriz",
      igi: 10,
      iva: 16,
      dta: 0.8,
      rrna: [
        "Certificación de seguridad de componentes para repuestos (en algunos casos)",
        "Trazabilidad de números de serie para evitar autopartes robadas o reconstruidas sin declarar"
      ],
      consejos: "Asegurar que las piezas no clasifiquen como componentes de seguridad activa si no cuentan con certificaciones internacionales equivalentes."
    }
  ],

  // Embarques iniciales de prueba
  embarquesIniciales: [
    {
      id: "MX-2026-9041",
      cliente: "TechSolutions S.A. de C.V.",
      mercancia: "Lote de 150 Laptops y Accesorios de Computación",
      origen: "China",
      puertoOrigen: "Puerto de Shenzhen",
      destino: "Aduana Aeropuerto AICM (CDMX)",
      valorFactura: 2187500,
      moneda: "MXN",
      tipoOperacion: "Importación Definitiva",
      estado: "inspeccion", // documentacion, transito, arribo, inspeccion, despachado
      semaforo: "rojo", // verde (despacho libre), naranja (revisión doc), rojo (reconocimiento aduanero), pendiente
      agenteAduanal: "Patente 3942 - Corporativo Aduanero del Valle",
      pedimento: "26  47  3942  6018243",
      documentos: [
        { tipo: "Factura Comercial", nombre: "INV-2026-88392.pdf", fecha: "2026-06-10", estado: "Aprobado" },
        { tipo: "Bill of Lading / AWB", nombre: "AWB-902839281.pdf", fecha: "2026-06-11", estado: "Aprobado" },
        { tipo: "Packing List", nombre: "PACKING-LIST-V2.xlsx", fecha: "2026-06-10", estado: "Aprobado" },
        { tipo: "Certificado de Origen", nombre: "CERT-ORIGIN-CHINA.pdf", fecha: "2026-06-12", estado: "Aprobado" },
        { tipo: "Pedimento Simplificado", nombre: "PED-264739426018243.pdf", fecha: "2026-06-15", estado: "En Revisión" }
      ],
      historial: [
        { fecha: "2026-06-10 09:30", titulo: "Documentación Inicial Recibida", descripcion: "Factura comercial y lista de empaque cargadas y validadas por el importador.", icono: "file-text" },
        { fecha: "2026-06-11 14:15", titulo: "Salida de Origen (Tránsito Aéreo)", descripcion: "Embarque despega del aeropuerto de Shenzhen. Vuelo CX086.", icono: "plane-takeoff" },
        { fecha: "2026-06-14 23:40", titulo: "Arribo a Recinto Fiscalizado", descripcion: "Cargamento ingresa al almacén fiscalizado número 24 en la aduana del AICM, México.", icono: "warehouse" },
        { fecha: "2026-06-15 11:00", titulo: "Validación y Pago de Pedimento", descripcion: "Pedimento validado por el SAAI y pagado mediante transferencia electrónica centralizada.", icono: "credit-card" },
        { fecha: "2026-06-16 09:00", titulo: "Mecanismo de Selección Automatizado", descripcion: "Se activa el semáforo fiscal dando como resultado Reconocimiento Aduanero (Rojo). Iniciando inspección física por la autoridad.", icono: "alert-triangle" }
      ]
    },
    {
      id: "MX-2026-8952",
      cliente: "Distribuidora de Alimentos del Norte",
      mercancia: "Contenedor Refrigerado de Manzanas Frescas (22 Toneladas)",
      origen: "Estados Unidos",
      puertoOrigen: "Puerto de Seattle",
      destino: "Aduana de Manzanillo, Colima",
      valorFactura: 840000,
      moneda: "MXN",
      tipoOperacion: "Importación Definitiva",
      estado: "despachado",
      semaforo: "verde",
      agenteAduanal: "Patente 1620 - Aduanas Intercontinentales",
      pedimento: "26  16  1620  6017992",
      documentos: [
        { tipo: "Factura Comercial", nombre: "INV-FRUIT-882.pdf", fecha: "2026-06-02", estado: "Aprobado" },
        { tipo: "Bill of Lading / AWB", nombre: "BL-SEAMANZ-00293.pdf", fecha: "2026-06-03", estado: "Aprobado" },
        { tipo: "Packing List", nombre: "PL-APPLES.pdf", fecha: "2026-06-02", estado: "Aprobado" },
        { tipo: "Certificado Fitosanitario", nombre: "USDA-PHYTOSANITARY.pdf", fecha: "2026-06-04", estado: "Aprobado" },
        { tipo: "Pedimento Simplificado", nombre: "PED-261616206017992.pdf", fecha: "2026-06-07", estado: "Aprobado" }
      ],
      historial: [
        { fecha: "2026-06-02 10:00", titulo: "Recepción de Documentos y Fito", descripcion: "Carga de documentos comerciales y del certificado fitosanitario del USDA.", icono: "file-text" },
        { fecha: "2026-06-03 16:00", titulo: "Tránsito Marítimo Iniciado", descripcion: "Zarpa buque portacontenedores 'Polar Star' desde Seattle con rumbo a Manzanillo.", icono: "ship" },
        { fecha: "2026-06-06 08:30", titulo: "Inspección Fitosanitaria en Aduana", descripcion: "Personal de SENASICA realiza la inspección física de las manzanas en el andén refrigerado. Sin incidencias de plagas.", icono: "shield-check" },
        { fecha: "2026-06-07 13:00", titulo: "Modo Selección Automatizado", descripcion: "Cruce por semáforo fiscal resultando en Despacho Libre (Verde).", icono: "check-circle" },
        { fecha: "2026-06-07 15:45", titulo: "Despachado y Salida de Puerto", descripcion: "Cargamento liberado. El tractocamión inicia ruta terrestre de entrega al Cedis.", icono: "truck" }
      ]
    },
    {
      id: "MX-2026-9120",
      cliente: "Modas y Tendencias de México",
      mercancia: "Cargamento de Prendas de Vestir de Algodón (Damas)",
      origen: "España",
      puertoOrigen: "Puerto de Valencia",
      destino: "Aduana de Veracruz, Ver.",
      valorFactura: 1487500,
      moneda: "MXN",
      tipoOperacion: "Importación Definitiva",
      estado: "transito",
      semaforo: "pendiente",
      agenteAduanal: "Patente 3855 - Logística Aduanera del Golfo",
      pedimento: "Pendiente",
      documentos: [
        { tipo: "Factura Comercial", nombre: "FAC-MADRID-3920.pdf", fecha: "2026-06-12", estado: "Aprobado" },
        { tipo: "Bill of Lading / AWB", nombre: "BL-VALVER-88329.pdf", fecha: "2026-06-14", estado: "Aprobado" },
        { tipo: "Packing List", nombre: "PK-MADRID-3920.pdf", fecha: "2026-06-12", estado: "Aprobado" },
        { tipo: "Certificado de Origen EUR.1", nombre: "EUR1-ESP-992.pdf", fecha: "2026-06-13", estado: "Rechazado" }
      ],
      historial: [
        { fecha: "2026-06-12 11:30", titulo: "Carga de Documentación Comercial", descripcion: "Factura y Packing List ingresados en el portal.", icono: "file-text" },
        { fecha: "2026-06-14 09:00", titulo: "Rechazo de Certificado de Origen", descripcion: "El Certificado EUR.1 no cuenta con la firma autógrafa digitalizada requerida. Se solicita corrección urgente para exentar arancel del 25%.", icono: "x-circle" },
        { fecha: "2026-06-14 18:00", titulo: "Salida del Puerto de Valencia", descripcion: "El cargamento aborda el navío 'MSC Alejandra' en tránsito transatlántico.", icono: "ship" }
      ]
    }
  ],

  // ─── Registros de Operaciones Aduanales ───
  // Schema: id, refNo, fecha, estado, operacion, doc, aduana, patente,
  //         cliente, importadorExportador, c20, c40, bultos, clase, mercancia,
  //         observaciones, prioridad (1=rojo,2=amarillo,3=azul,4=blanco), contacto
  registrosIniciales: [
    // ── PRIORIDAD 1 (ROJO) ──────────────────────────────────────────────────
    { id:"U-001",  refNo:"RAB26-000158", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"NATURY",          importadorExportador:"NATURY S.A. DE C.V.",                         c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"PAPEL",                     observaciones:"SUBDIVISION 3 PED",                                                      prioridad:1, contacto:"SR CIPRIANO" },
    { id:"U-002",  refNo:"RAB26-000157", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"EUROEMERGENCIAS", importadorExportador:"EUROEMERGENCIAS S.A. DE C.V.",               c20:0,  c40:0, bultos:1,  clase:"BULTO",            mercancia:"MEZCLAS",                   observaciones:"1/2 FRACCIONES",                                                         prioridad:1, contacto:"DICASA" },
    { id:"U-003",  refNo:"MZO26-000226", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"MZO (160)", patente:"1620", cliente:"ARGINOX",         importadorExportador:"ARGINOX S.A. DE C.V.",                       c20:0,  c40:0, bultos:1,  clase:"CONTENEDOR",       mercancia:"TUBOS",                     observaciones:"GLOSA FINAL",                                                            prioridad:1, contacto:"CACEMEX" },
    { id:"U-004",  refNo:"MZO26-000618", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"MZO (160)", patente:"1620", cliente:"AMEX",            importadorExportador:"AMEX IMPORTACIONES S.A.",                    c20:0,  c40:0, bultos:1,  clase:"CONTENEDOR",       mercancia:"AUTOPARTES",                observaciones:"FALTA CARTA 318",                                                        prioridad:1, contacto:"LAURA HDZ" },
    { id:"U-005",  refNo:"RAB26-000150", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"EFC",             importadorExportador:"EFC IMPORTACIONES S.A. DE C.V.",             c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"CLIPS AUTOMOTRIZ",          observaciones:"YA TIENE PREVIO 10/06",                                                  prioridad:1, contacto:"ALEYOIS" },
    { id:"U-006",  refNo:"MZO26-000228", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"MZO (160)", patente:"1620", cliente:"EFC",             importadorExportador:"EFC IMPORTACIONES S.A. DE C.V.",             c20:0,  c40:0, bultos:1,  clase:"CONTENEDOR",       mercancia:"TORNILLOS",                 observaciones:"LLEGO EL 8/PREV 17",                                                     prioridad:1, contacto:"ALEYOIS" },
    { id:"U-007",  refNo:"MZO26-000224", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"MZO (160)", patente:"1620", cliente:"EFC",             importadorExportador:"EFC IMPORTACIONES S.A. DE C.V.",             c20:0,  c40:0, bultos:1,  clase:"CONTENEDOR",       mercancia:"CLIP PLASTICO",             observaciones:"PREV 17/ 2 FACT",                                                        prioridad:1, contacto:"ALEYOIS" },
    { id:"U-008",  refNo:"SVZ26-000490", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"AIRE Y PROC",     importadorExportador:"AIRE Y PROCESO INDUSTRIAL S.A. DE C.V.",     c20:1,  c40:0, bultos:1,  clase:"CONTENEDOR 20' DC",mercancia:"COMPRESORES DE AIRE",       observaciones:"EN CLASIFICACION URGENTE/GLOSA",                                         prioridad:1, contacto:"DARIO ESTEVES" },
    { id:"U-009",  refNo:"SFA26-000459", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"AIFA (850)",patente:"3942", cliente:"INYECTORES",      importadorExportador:"INYECTORES Y ACCESORIOS S.A.",               c20:0,  c40:0, bultos:5,  clase:"BULTOS",           mercancia:"INYECTORES DIESEL",         observaciones:"ETA 19/04 SE SUBE A GLOSA AUT",                                          prioridad:1, contacto:"LAURA HDZ" },
    { id:"U-010",  refNo:"SVZ26-000490", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"AHUMADOS",        importadorExportador:"AHUMADOS Y EMBUTIDOS S.A. DE C.V.",          c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"MAQUINA DESOLLADORA",       observaciones:"GLOSA EXPRÉS PARA DARLE SALIDA",                                         prioridad:1, contacto:"CACEMEX" },
    { id:"U-011",  refNo:"SVZ26-000692", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"MZO (160)", patente:"1620", cliente:"CARCAL",          importadorExportador:"CARCAL COMERCIALIZADORA S.A.",               c20:0,  c40:0, bultos:10, clase:"BULTOS",           mercancia:"BASTONES METALICOS",        observaciones:"ETA 03/06 10/JUN GLOSA EXPRES",                                          prioridad:1, contacto:"GL CARGO" },
    { id:"U-012",  refNo:"SVZ26-000591", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"ACEROS EN BARRAS",importadorExportador:"ACEROS EN BARRAS S.A. DE C.V.",              c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR 40' DC",mercancia:"PLETINAS",                  observaciones:"REVISION CLASIFICACION CONCLUIDA/BAJA A EJECUTIVO",                     prioridad:1, contacto:"YURI" },
    { id:"U-013",  refNo:"SVZ26-000589", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"ACEROS EN BARRAS",importadorExportador:"ACEROS EN BARRAS S.A. DE C.V.",              c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR 40' DC",mercancia:"PLETINAS",                  observaciones:"REVISION CLASIFICACION CONCLUIDA/BAJA A EJECUTIVO",                     prioridad:1, contacto:"YURI" },
    { id:"U-014",  refNo:"SVZ26-000590", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"ACEROS EN BARRAS",importadorExportador:"ACEROS EN BARRAS S.A. DE C.V.",              c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR 40' DC",mercancia:"PLETINAS",                  observaciones:"CHECANDO CLASIF SE BAJA MEDIO DÍA",                                     prioridad:1, contacto:"YURI" },
    { id:"U-015",  refNo:"SVZ26-000588", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"ACEROS EN BARRAS",importadorExportador:"ACEROS EN BARRAS S.A. DE C.V.",              c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR 40' DC",mercancia:"PLETINAS",                  observaciones:"CHECANDO CLASIF SE BAJA MEDIO DÍA",                                     prioridad:1, contacto:"YURI" },

    // ── PRIORIDAD 2 (AMARILLO) ───────────────────────────────────────────────
    { id:"U-016",  refNo:"SVZ26-000484", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"EVOLUCIÓN",        importadorExportador:"EVOLUCIÓN COMERCIAL S.A.",                  c20:0,  c40:0, bultos:2,  clase:"BULTOS",           mercancia:"POLLOS PARTES",             observaciones:"CONSULTA CON EL LIC SASTRE",                                             prioridad:2, contacto:"SASTRE" },
    { id:"U-017",  refNo:"SVZ26-000404", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"BERSALAH",         importadorExportador:"BERSALAH S.L.",                             c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"TEXTILES",                  observaciones:"ESTA EN REVISION CON EL LIC SASTRE",                                    prioridad:2, contacto:"SASTRE" },
    { id:"U-018",  refNo:"SVZ26-000466", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"MALACATES",        importadorExportador:"MALACATES Y POLIPASTOS S.A.",               c20:0,  c40:0, bultos:3,  clase:"BULTOS",           mercancia:"MOTORES",                   observaciones:"SE PASA A REV DE FRACCION C/PREV",                                       prioridad:2, contacto:"SR CIPRIANO" },
    { id:"U-019",  refNo:"SVZ26-000490", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"ASEAL",            importadorExportador:"ASEAL ALIMENTOS S.A. DE C.V.",              c20:0,  c40:0, bultos:5,  clase:"BULTOS",           mercancia:"CASEINATO",                 observaciones:"CASEINATO/SADER INGRESADO",                                              prioridad:2, contacto:"ANGELICA" },
    { id:"U-020",  refNo:"MZO26-000231", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"MZO (160)", patente:"1620", cliente:"ING ELEVADORES",   importadorExportador:"ING ELEVADORES S.A. DE C.V.",               c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"ELEVADOR COMPLETO",         observaciones:"CONF. ETA PASA A GLOSA ANT.",                                            prioridad:2, contacto:"SR CIPRIANO" },
    { id:"U-021",  refNo:"MZO26-000229", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"MZO (160)", patente:"1620", cliente:"ZSCHMMER",         importadorExportador:"ZSCHMMER QUIMICA S.A.",                     c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"SODIO NAFTALINO",           observaciones:"EN CONSULTA CON AAAFUMAC/ETA 18--PREVIO",                               prioridad:2, contacto:"KORA MARINE" },
    { id:"U-022",  refNo:"SVZ26-000506", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"CATALINA GRACIELA",importadorExportador:"CATALINA GRACIELA IMPORTACIONES",           c20:0,  c40:0, bultos:8,  clase:"CAJAS",            mercancia:"LIBROS EN INGLES",          observaciones:"ETA 13/06/2026-PREVIO SE PASA A GLOSA",                                  prioridad:2, contacto:"JML" },
    { id:"U-023",  refNo:"SVZ26-000488", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"GUALA",            importadorExportador:"GUALA CLOSURES DE MEXICO S.A.",             c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR 40' DC",mercancia:"LAMINAS DE ALUMINIO",        observaciones:"ETA 06/06 FALTA BL REV AVISO AUTOMATICO",                               prioridad:2, contacto:"SADIMEX" },
    { id:"U-024",  refNo:"SVZ26-000514", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"GUALA",            importadorExportador:"GUALA CLOSURES DE MEXICO S.A.",             c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"BARNICES",                  observaciones:"NOM-003-SSA/ETIQUETAR ETA 13/06 REV REVALIDAC",                         prioridad:2, contacto:"SADIMEX" },
    { id:"U-025",  refNo:"SVZ26-000586", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"ARKIVIA",          importadorExportador:"ARKIVIA MATERIALES S.A.",                   c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"MORTEROS NO REFRACTARIOS",  observaciones:"EN REVISION DE LA FRACC/ ETA 12/06 EN PREVIO MARTES/23 (EN AREA EJECUTIVA)", prioridad:2, contacto:"ANCA LOG" },
    { id:"U-026",  refNo:"SVZ26-000581", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"BERSALAH",         importadorExportador:"BERSALAH S.L.",                             c20:0,  c40:0, bultos:4,  clase:"BULTOS",           mercancia:"CAMISAS DE MOTOR",          observaciones:"SE PROGRAMA POREVIO 20/06 ETA 15/06",                                   prioridad:2, contacto:"JADE-TRADE" },
    { id:"U-027",  refNo:"MZO26-000581", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"MZO (160)", patente:"1620", cliente:"201 OFICIAL",      importadorExportador:"201 OFICIAL S.A. DE C.V.",                  c20:1,  c40:0, bultos:1,  clase:"CONTENEDOR 20' DC",mercancia:"MAQUINA PARA TRAB CAUCHO",  observaciones:"SE REALIZO PREVIO 15/06 PASA A GLOSA",                                  prioridad:2, contacto:"JADE-TRADE" },
    { id:"U-028",  refNo:"SVZ26-000027", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"ARQ Y DISEÑO",     importadorExportador:"ARQ Y DISEÑO INTERIORES S.A.",              c20:0,  c40:0, bultos:6,  clase:"BULTOS",           mercancia:"PARTES MUEBLES MADERA",     observaciones:"PARTES DE MADERA PARA COCINA PROFEPA 22/06 GLOSA",                      prioridad:2, contacto:"SILSA" },
    { id:"U-029",  refNo:"SVZ26-000028", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"ARQ Y DISEÑO",     importadorExportador:"ARQ Y DISEÑO INTERIORES S.A.",              c20:0,  c40:0, bultos:3,  clase:"BULTOS",           mercancia:"PARTES MUEBLES MADERA",     observaciones:"MARCOS DE ALUMINIO",                                                    prioridad:2, contacto:"SILSA" },
    { id:"U-030",  refNo:"SFA26-000045", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A4", aduana:"AIFA (850)",patente:"3942", cliente:"DANIEL RAMIREZ",   importadorExportador:"DANIEL RAMIREZ IMPORTACIONES",              c20:0,  c40:0, bultos:1,  clase:"BULTO",            mercancia:"YATE",                      observaciones:"A3 VIRTUAL/SE SOLICITAN SELLOS//",                                       prioridad:2, contacto:"ACEX/CASARRUBIAS" },
    { id:"U-031",  refNo:"SVZ26-000500", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"GUANPY",           importadorExportador:"GUANPY TEXTILES S.A. DE C.V.",              c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"DESPERDICIOS TEXTILES",     observaciones:"FALTA EUR/CHECAR CON CAAAREM CRITERIO// ETA 13/06",                     prioridad:2, contacto:"GUANPY" },
    { id:"U-032",  refNo:"SVZ26-000305", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"GUANPY",           importadorExportador:"GUANPY TEXTILES S.A. DE C.V.",              c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"FIBRAS TEXTILES",           observaciones:"FALTA REV POR EL FWD/NP ETA 04/06 GLOSA EXPRÉS PERM AUT",              prioridad:2, contacto:"GUANPY" },
    { id:"U-033",  refNo:"SVZ26-000439", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"GUANPY",           importadorExportador:"GUANPY TEXTILES S.A. DE C.V.",              c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"FIBRAS TEXTILES",           observaciones:"FALTA REV POR EL FWD/ETA YA 13/07 GLOSA EXPRÉS PERM AUT",             prioridad:2, contacto:"GUANPY" },
    { id:"U-034",  refNo:"SVZ26-000574", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"GUANPY",           importadorExportador:"GUANPY TEXTILES S.A. DE C.V.",              c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"MONOFILAMENTO",             observaciones:"ETA 19/06 SE PASA GLOSA EXPRES",                                        prioridad:2, contacto:"GUANPY" },
    { id:"U-035",  refNo:"SMZ26-000683", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"SMZ (206)", patente:"1620", cliente:"GUANPY",           importadorExportador:"GUANPY TEXTILES S.A. DE C.V.",              c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"FIBRAS TEXTILES",           observaciones:"ETA 20/06 SE PASA GLOSA EXPRES",                                        prioridad:2, contacto:"GUANPY" },
    { id:"U-036",  refNo:"MZO26-000230", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"MZO (160)", patente:"1620", cliente:"SUPPORTS",         importadorExportador:"SUPPORTS COMERCIAL S.A.",                   c20:0,  c40:0, bultos:12, clase:"CAJAS",            mercancia:"CLIPS METALICOS",           observaciones:"SE BAJA A LA EJECUTIVA",                                                 prioridad:2, contacto:"CIDESA" },

    // ── PRIORIDAD 3 (AZUL) ────────────────────────────────────────────────────
    { id:"U-037",  refNo:"SMZ26-000689", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"SMZ (206)", patente:"1620", cliente:"FILTROS Y TELAS",  importadorExportador:"FILTROS Y TELAS INDUSTRIALES S.A.",         c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"TELAS NAILON",              observaciones:"ESTA EN REVALIDACION PERO HACER GLOSA",                                  prioridad:3, contacto:"DAIBRY" },
    { id:"U-038",  refNo:"MZO26-000689", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"MZO (160)", patente:"1620", cliente:"ASEAL",            importadorExportador:"ASEAL ALIMENTOS S.A. DE C.V.",              c20:0,  c40:0, bultos:8,  clase:"BULTOS",           mercancia:"COMPLEMENTOS ALIMENTICIO",  observaciones:"SE PASA A GLOSA EN REVALIDACION",                                       prioridad:3, contacto:"ANGELICA" },
    { id:"U-039",  refNo:"RAB26-000573", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"BC", aduana:"VER (430)", patente:"3942", cliente:"TEXO DISTRIB",     importadorExportador:"TEXO DISTRIBUCIONES S.A.",                  c20:0,  c40:0, bultos:2,  clase:"BULTOS",           mercancia:"AMPLIFICADORES",            observaciones:"REV PREVIO YA LLEGO A 1RA GLOSA",                                       prioridad:3, contacto:"ROSTÉ" },
    { id:"U-040",  refNo:"SVZ26-000481", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"ORTOPEDIA ORTIZ",  importadorExportador:"ORTOPEDIA ORTIZ S.A. DE C.V.",              c20:0,  c40:0, bultos:5,  clase:"BULTOS",           mercancia:"PLASTICOS PVC",             observaciones:"POR LLEGAR PASA A GLOSA ANT",                                            prioridad:3, contacto:"JULIO SALINAS" },
    { id:"U-041",  refNo:"MZO26-000740", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"MZO (160)", patente:"1620", cliente:"UNION TEPATITLAN", importadorExportador:"UNION TEPATITLAN S.A. DE C.V.",             c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"MAQUINA PARA CONO",         observaciones:"SOL DIAGRAMA EN PROCESO REV/ETA CLASF",                                  prioridad:3, contacto:"RENE CARPINTEYRO" },
    { id:"U-042",  refNo:"SVZ26-000579", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"KRAUTZBERGER",     importadorExportador:"KRAUTZBERGER MEXICO S.A.",                  c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"REGULADOR Y OTRAS",         observaciones:"ETA 15/06 GLOSA ANTICIPADA (CONF. FRACCIONES) BAJO AREA EJECUTIVO",    prioridad:3, contacto:"XPD" },
    { id:"U-043",  refNo:"SMZ26-000737", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"SMZ (206)", patente:"1620", cliente:"MARISELA CARRERA", importadorExportador:"MARISELA CARRERA IMPORTACIONES",            c20:0,  c40:0, bultos:1,  clase:"BULTO",            mercancia:"MOLDE DE INYECCION",        observaciones:"FALTA DIAGRAMA//ETA 25/05 PROG PREVIO X CONF (AREA EJECUTIVA)",          prioridad:3, contacto:"BRANDON" },
    { id:"U-044",  refNo:"SVZ26-000517", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"BRALO",            importadorExportador:"BRALO DE MEXICO S.A.",                      c20:0,  c40:0, bultos:20, clase:"CAJAS",            mercancia:"REMACHES",                  observaciones:"POR REV SE SUBE A GLOSA ANTICIPADA ETA 13/06",                          prioridad:3, contacto:"ELIZABETH" },
    { id:"U-045",  refNo:"RAB26-000159", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"BC", aduana:"VER (430)", patente:"3942", cliente:"CS CONCRETOS",     importadorExportador:"CS CONCRETOS S.A. DE C.V.",                 c20:0,  c40:0, bultos:3,  clase:"BULTOS",           mercancia:"SONDAS Y APARATOS",         observaciones:"INVALIDADO PROG PREVIO/RETENIDO X AUT PREV 22/06 SE PASA A GLOSA",      prioridad:3, contacto:"TRAFFICTOR" },
    { id:"U-046",  refNo:"SVZ26-000398", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"ING ASESORIA",     importadorExportador:"ING ASESORIA Y CONSULTORIA S.A.",           c20:0,  c40:0, bultos:1,  clase:"BULTO",            mercancia:"MAQUINA DE HIDROROL",       observaciones:"GLOSA ANTICIPADA PREVIO 19",                                             prioridad:3, contacto:"CLAUDIA VALERO" },
    { id:"U-047",  refNo:"SMZ26-000691", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"SMZ (206)", patente:"1620", cliente:"CLEMDE",           importadorExportador:"CLEMDE QUIMICA S.A. DE C.V.",               c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"RESINAS Y OTROS",           observaciones:"SE SOLICITO INF. PROVEEDOR/INC. SE QUEDA EN EJECUTIVO",                  prioridad:3, contacto:"GELASIO" },
    { id:"U-048",  refNo:"MZO26-000145", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"MZO (160)", patente:"1620", cliente:"MANUFACTURERA",    importadorExportador:"MANUFACTURERA TEXTIL S.A.",                 c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"TELAS FUROR",               observaciones:"POR LLEGAR PASA A GLOSA ANT",                                            prioridad:3, contacto:"DICASA" },
    { id:"U-049",  refNo:"RAB26-000156", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"RABANALES",        importadorExportador:"RABANALES CONSTRUCCION S.A.",               c20:0,  c40:0, bultos:4,  clase:"BULTOS",           mercancia:"PISO FALSO METALICO",       observaciones:"POR LLEGO FALSO METALICO PASA A GLOSA ANT",                             prioridad:3, contacto:"TRAFFICTOR" },
    { id:"U-050",  refNo:"SVZ26-000148", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"JOSE MA HDZ",      importadorExportador:"JOSE MARIA HERNANDEZ IMPORTACIONES",        c20:0,  c40:0, bultos:6,  clase:"BULTOS",           mercancia:"TAPAS Y ARTEFACTOS",        observaciones:"LLEVA AVISO AUT/ 19/06 FALTA AVISO",                                    prioridad:3, contacto:"ROSY HDZ" },
    { id:"U-051",  refNo:"SVZ26-000507", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"ORFA",             importadorExportador:"ORFA DISTRIBUCIONES S.A.",                  c20:0,  c40:0, bultos:3,  clase:"BULTOS",           mercancia:"TAPETES DE PLASTICO",       observaciones:"LLEGA 26/06 PASA GLOSA ANT",                                             prioridad:3, contacto:"GL CARGO" },
    { id:"U-052",  refNo:"MZO26-000693", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"MZO (160)", patente:"1620", cliente:"GREEN BATERY",     importadorExportador:"GREEN BATERY S.A. DE C.V.",                 c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"ACUMULADORES",              observaciones:"FALTA BL/REV ETA Y VER CERT CHL GLOSA ANT",                             prioridad:3, contacto:"IRLANDA" },
    { id:"U-053",  refNo:"SMZ26-000694", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"SMZ (206)", patente:"1620", cliente:"RW PLAST",         importadorExportador:"RW PLAST SOLUCIONES S.A.",                  c20:0,  c40:0, bultos:8,  clase:"BULTOS",           mercancia:"APARATOS DE SEÑALIZACION",  observaciones:"POR LLEGAR PASA A GLOSA ANT",                                            prioridad:3, contacto:"IRLANDA" },
    { id:"U-054",  refNo:"MZO26-000578", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"MZO (160)", patente:"1620", cliente:"GREEN BATERY",     importadorExportador:"GREEN BATERY S.A. DE C.V.",                 c20:0,  c40:0, bultos:5,  clase:"BULTOS",           mercancia:"CONECTORES ELECT",          observaciones:"POR LLEGAR PASA A GLOSA ANT",                                            prioridad:3, contacto:"IRLANDA" },

    // ── PRIORIDAD 4 (NORMAL) ─────────────────────────────────────────────────
    { id:"U-055",  refNo:"RAB26-000434", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"CP LOG",           importadorExportador:"CP LOG IMPORTACIONES S.A.",                 c20:0,  c40:0, bultos:1,  clase:"BULTO",            mercancia:"MINI ROJO",                 observaciones:"MANDO PAPELES A REVISION/AREA EJECUTIVA",                               prioridad:4, contacto:"AGUSTIN" },
    { id:"U-056",  refNo:"SVZ26-000463", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"CP LOG",           importadorExportador:"CP LOG IMPORTACIONES S.A.",                 c20:0,  c40:0, bultos:1,  clase:"BULTO",            mercancia:"MINI VERDE",                observaciones:"MANDO PAPELES A REVISION/AREA EJECUTIVA",                               prioridad:4, contacto:"AGUSTIN" },
    { id:"U-057",  refNo:"SVZ26-000432", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"CP LOG",           importadorExportador:"CP LOG IMPORTACIONES S.A.",                 c20:0,  c40:0, bultos:1,  clase:"BULTO",            mercancia:"MINI PICK UP",              observaciones:"MANDO PAPELES A REVISION/AREA EJECUTIVA",                               prioridad:4, contacto:"AGUSTIN" },
    { id:"U-058",  refNo:"SVZ26-000464", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"JORGE SOTO",       importadorExportador:"JORGE SOTO IMPORTACIONES",                  c20:0,  c40:0, bultos:1,  clase:"BULTO",            mercancia:"MINI AZUL",                 observaciones:"MANDO PAPELES A REVISION/AREA EJECUTIVA",                               prioridad:4, contacto:"AGUSTIN" },
    { id:"U-059",  refNo:"MZO26-000739", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"MZO (160)", patente:"1620", cliente:"FILTROS Y TELAS",  importadorExportador:"FILTROS Y TELAS INDUSTRIALES S.A.",         c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"MEMBRANAS FILTRANTES",      observaciones:"ETA 26 PASA A GLOSA ANT",                                               prioridad:4, contacto:"DAIBRY" },
    { id:"U-060",  refNo:"SVZ26-000598", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"PESQUERA SIGLO",   importadorExportador:"PESQUERA SIGLO XXI S.A.",                   c20:0,  c40:0, bultos:1,  clase:"BULTO",            mercancia:"HELICE",                    observaciones:"ETA PEND PASA A GLOSA ANTICIPADA",                                      prioridad:4, contacto:"ALBERTO VILLARREAL" },
    { id:"U-061",  refNo:"SVZ26-000416", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"ORFA",             importadorExportador:"ORFA DISTRIBUCIONES S.A.",                  c20:0,  c40:0, bultos:6,  clase:"BULTOS",           mercancia:"COMIDA PARA ANIMALES",      observaciones:"ETA 10 JUL PASA A GLOSA ANTICIPADA/SADER",                              prioridad:4, contacto:"GL CARGO" },
    { id:"U-062",  refNo:"RAB26-000165", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"A SAFE",           importadorExportador:"A SAFE PROTECCIONES S.A.",                  c20:0,  c40:0, bultos:4,  clase:"BULTOS",           mercancia:"BARANDILLAS",               observaciones:"ETA 20 SE PASA A GLOSA ANTICIPADA",                                     prioridad:4, contacto:"CESAR ALV" },
    { id:"U-063",  refNo:"SVZ26-000592", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"GUALA",            importadorExportador:"GUALA CLOSURES DE MEXICO S.A.",             c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"LINERS PARA TAPAS",         observaciones:"REV CARTA 20/06/2026 GLOSA ANT",                                        prioridad:4, contacto:"SADIMEX" },
    { id:"U-064",  refNo:"SVZ26-000593", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"GUALA",            importadorExportador:"GUALA CLOSURES DE MEXICO S.A.",             c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"LINERS PARA TAPAS",         observaciones:"REV CARTA 20/06/2026 GLOSA ANT",                                        prioridad:4, contacto:"SADIMEX" },
    { id:"U-065",  refNo:"SVZ26-000515", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"GUALA",            importadorExportador:"GUALA CLOSURES DE MEXICO S.A.",             c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"TAPONES DE ALUMINIO",       observaciones:"ETA 16/06 FALTA BL SE PASA A GLOSA ANTICIPADA",                         prioridad:1, contacto:"SADIMEX" },
    { id:"U-066",  refNo:"SVZ26-000516", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"GUALA",            importadorExportador:"GUALA CLOSURES DE MEXICO S.A.",             c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"TAPONES Y TAPAS",           observaciones:"ETA 16/06 FALTA BL SE PASA A GLOSA ANTICIPADA",                         prioridad:4, contacto:"SADIMEX" },
    { id:"U-067",  refNo:"SVZ26-000488", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"GUALA",            importadorExportador:"GUALA CLOSURES DE MEXICO S.A.",             c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"TAPON DE ALUMINIO",         observaciones:"ETA 16/06 FALTA BL SE PASA A GLOSA ANTICIPADA",                         prioridad:4, contacto:"SADIMEX" },
    { id:"U-068",  refNo:"MZO26-000814", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"MZO (160)", patente:"1620", cliente:"BERSALAH",         importadorExportador:"BERSALAH S.L.",                             c20:0,  c40:1, bultos:1,  clase:"CONTENEDOR",       mercancia:"LINEA DE PRODUCCION",       observaciones:"LLEGA A GLOSA ANT.",                                                    prioridad:4, contacto:"JADE-TRADE" },
    { id:"U-069",  refNo:"SVZ26-000575", fecha:"2026-06-18", estado:"T", operacion:"I", doc:"A1", aduana:"VER (430)", patente:"3942", cliente:"WEISS",            importadorExportador:"WEISS INSTRUMENTS S.A.",                    c20:0,  c40:0, bultos:1,  clase:"BULTO",            mercancia:"CAMARA DE PRUEBA DE LAB",   observaciones:"SE SOLICITO INF CLASIFICACION/ETA X CONF (EN AREA EJECT)",              prioridad:4, contacto:"CESAR LECHUGA" }
  ]
};

