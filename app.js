// AduanaFlow - Application Logic (Vanilla JavaScript SPA)

document.addEventListener("DOMContentLoaded", () => {
  // --- AUTHENTICATION & INITIAL LOAD ---
  const authWrapper = document.getElementById("auth-wrapper");
  const appContainer = document.getElementById("app-container");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const verifyForm = document.getElementById("verify-form");
  const btnLogout = document.getElementById("btn-logout");
  
  let tempUsernameForVerification = "";

  document.getElementById("link-to-register")?.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  });

  document.getElementById("link-to-login")?.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  });

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const u = document.getElementById("login-username").value;
    const p = document.getElementById("login-password").value;
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: u, password: p})
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', data.username);
        showApp();
      } else {
        alert(data.error || "Login fallido");
      }
    } catch(err) {
      alert("Error de conexión");
    }
  });

  registerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const u = document.getElementById("register-username").value;
    const p = document.getElementById("register-password").value;
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: u, password: p})
      });
      const data = await res.json();
      if (data.success) {
        alert("Registro exitoso. ¡Ya puedes iniciar sesión!");
        document.getElementById("register-form").style.display = "none";
        document.getElementById("login-form").style.display = "block";
      } else {
        alert(data.error || "Registro fallido");
      }
    } catch(err) {
      alert("Error de conexión");
    }
  });

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      authWrapper.style.display = "flex";
      appContainer.style.display = "none";
    });
  }

  async function authFetch(url, options = {}) {
    const token = localStorage.getItem('auth_token');
    if (!options.headers) options.headers = {};
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    
    const res = await fetch(url, options);
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('auth_token');
      authWrapper.style.display = "flex";
      appContainer.style.display = "none";
      throw new Error("Sesión expirada o no autorizada");
    }
    return res;
  }

  function showApp() {
    authWrapper.style.display = "none";
    appContainer.style.display = "flex";
    
    // Update Profile UI
    const username = localStorage.getItem('auth_user') || 'Usuario';
    const sidebarUserName = document.getElementById('sidebar-user-name');
    const sidebarAvatar = document.getElementById('sidebar-avatar');
    if (sidebarUserName) sidebarUserName.textContent = username;
    if (sidebarAvatar) sidebarAvatar.textContent = username.charAt(0).toUpperCase();

    init(); // load data
  }

  // --- APPLICATION STATE ---
  const state = {
    shipments: [],
    selectedShipmentId: null,
    selectedTariffCode: null,
    uploadedModalFile: null,
    calculos: [],
    lastCalculo: null,
    rawConverterText: "",
    converterData: null,
    converterHeaders: []
  };

  // --- SELECTORS ---
  const menuItems = document.querySelectorAll(".sidebar-menu .menu-item");
  const sections = document.querySelectorAll(".page-section");
  const pageTitle = document.getElementById("page-title");
  
  // Dashboard Selectors
  const kpiActive = document.getElementById("kpi-active-shipments");
  const kpiTariffs = document.getElementById("kpi-total-tariffs");
  const kpiApproved = document.getElementById("kpi-approved-pedimentos");
  const kpiRed = document.getElementById("kpi-red-alerts");
  const dbShipmentsBody = document.getElementById("dashboard-shipments-body");
  
  // Shipment Selectors
  const shipmentsSidebarList = document.getElementById("shipments-sidebar-list");
  const shipmentDetailPanel = document.getElementById("shipment-detail-panel");
  const shipmentDetailPlaceholder = document.getElementById("shipment-detail-placeholder");
  const shipmentDetailContent = document.getElementById("shipment-detail-content");

  // Calculator Selectors
  const searchInput = document.getElementById("tariff-search-input");
  const searchResults = document.getElementById("tariff-search-results");
  const calculatorLayout = document.getElementById("calculator-section-layout");
  const displayCode = document.getElementById("selected-tariff-code-display");
  const displayName = document.getElementById("selected-tariff-name-display");
  const inputValFactura = document.getElementById("calc-val-factura");
  const inputOrigin = document.getElementById("calc-origin");
  const inputFreight = document.getElementById("calc-freight");
  const inputInsurance = document.getElementById("calc-insurance");
  const cargoCategoryIcon = document.getElementById("cargo-category-icon");
  const cargoAdviseText = document.getElementById("cargo-advise-text");
  
  const resCommValue = document.getElementById("calc-res-commercial-value");
  const resCustomsValue = document.getElementById("calc-res-customs-value");
  const igiRateBadge = document.getElementById("calc-igi-rate");
  const resIgi = document.getElementById("calc-res-igi");
  const resDta = document.getElementById("calc-res-dta");
  const ivaRateBadge = document.getElementById("calc-iva-rate");
  const resIva = document.getElementById("calc-res-iva");
  const resTotal = document.getElementById("calc-res-total");
  const calcRrnaList = document.getElementById("calc-rrna-list");
  const calcAdviseBox = document.getElementById("calc-advise-box");

  // Documents Selectors
  const allDocsBody = document.getElementById("all-documents-body");

  // Modal Selectors
  const modal = document.getElementById("new-shipment-modal");
  const btnOpenModal = document.getElementById("btn-open-shipment-modal");
  const btnCloseModal = document.getElementById("btn-close-shipment-modal");
  const btnCancelModal = document.getElementById("btn-cancel-shipment");
  const modalUploadZone = document.getElementById("modal-upload-zone");
  const modalFileInput = document.getElementById("modal-file-input");
  const modalFileSelected = document.getElementById("modal-file-selected");
  const newShipmentForm = document.getElementById("new-shipment-form");

  // Toast Container
  const toastContainer = document.getElementById("toast-container");

  // Converter Selectors
  const converterUploadZone = document.getElementById("converter-upload-zone");
  const converterFileInput = document.getElementById("converter-file-input");
  const converterFileSelected = document.getElementById("converter-file-selected");
  const converterDelimiter = document.getElementById("converter-delimiter");
  const converterIgnoreEmpty = document.getElementById("converter-ignore-empty");
  const converterPreviewCard = document.getElementById("converter-preview-card");
  const converterPreviewHead = document.getElementById("converter-preview-head");
  const converterPreviewBody = document.getElementById("converter-preview-body");
  const btnExportExcel = document.getElementById("btn-export-excel");

  // --- INITIALIZATION ---
  async function init() {
    try {
      const resEmb = await authFetch('/api/embarques');
      state.shipments = await resEmb.json();
      
      const resCalc = await authFetch('/api/calculos');
      state.calculos = await resCalc.json();
    } catch (e) {
      console.error("Failed to load DB data", e);
      showToast("Error conectando a la base de datos.", "error");
    }

    // Set initial active views
    setupRouter();
    renderDashboard();
    renderShipmentsList();
    renderAllDocuments();
    renderCalculosHistory();
    setupEventListeners();
    setupConverter();
    
    // Initialize Lucide Icons
    lucide.createIcons();
  }

  async function saveShipmentToDB(ship) {
    try {
      await authFetch(`/api/embarques/${ship.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ship)
      });
    } catch(e) {
      console.error(e);
      showToast("Error guardando cambios en la BD", "error");
    }
  }

  async function createShipmentInDB(ship) {
    try {
      await authFetch(`/api/embarques`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ship)
      });
    } catch(e) {
      console.error(e);
      showToast("Error guardando el embarque en la BD", "error");
    }
  }

  // --- SPA ROUTER ---
  function setupRouter() {
    menuItems.forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const sectionId = item.getAttribute("data-section");
        navigateToSection(sectionId);
      });
    });

    // Check URL Hash on load
    const hash = window.location.hash.replace("#", "");
    if (hash && ["dashboard", "shipments", "calculator", "documents", "registros", "reportes", "convertidor"].includes(hash)) {
      navigateToSection(hash);
    }
  }

  function navigateToSection(sectionId) {
    // Update active class in menu
    menuItems.forEach(li => {
      if (li.getAttribute("data-section") === sectionId) {
        li.classList.add("active");
      } else {
        li.classList.remove("active");
      }
    });

    // Update visible section
    sections.forEach(sec => {
      if (sec.id === sectionId) {
        sec.classList.add("active");
      } else {
        sec.classList.remove("active");
      }
    });

    // Update Title
    let title = "Resumen de Operaciones";
    if (sectionId === "shipments") title = "Seguimiento de Embarques";
    else if (sectionId === "calculator") title = "Clasificador Arancelario";
    else if (sectionId === "documents") title = "Gestor Documental Pre-Auditoría";
    else if (sectionId === "registros") title = "Registros de Operaciones Aduanales";
    else if (sectionId === "reportes") title = "Generador de Reportes";
    else if (sectionId === "convertidor") title = "Convertidor de Texto a Excel";
    pageTitle.textContent = title;

    // Trigger section-specific updates
    if (sectionId === "dashboard") {
      renderDashboard();
    } else if (sectionId === "shipments") {
      renderShipmentsList();
    } else if (sectionId === "documents") {
      renderAllDocuments();
    } else if (sectionId === "registros") {
      renderRegistrosTable();
    } else if (sectionId === "reportes") {
      populateReporteClienteSelect();
    } else if (sectionId === "convertidor") {
      // Lazy init event listeners or rendering if needed
    }

    // Update Hash
    window.location.hash = sectionId;
    
    // Re-render Lucide Icons
    lucide.createIcons();
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let iconName = "check-circle";
    if (type === "error") iconName = "alert-circle";
    else if (type === "warning") iconName = "info";

    toast.innerHTML = `
      <i data-lucide="${iconName}"></i>
      <span class="toast-message">${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
      toast.style.animation = "toastSlideIn 0.3s ease-out reverse forwards";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  }

  // --- DASHBOARD CONTROLLER ---
  function renderDashboard() {
    // Compute KPIs
    const active = state.shipments.filter(s => s.estado !== "despachado").length;
    
    // Total simulated duties (sum of arbitrary imports + active shipments value * average taxes)
    let totalDuties = 0;
    state.shipments.forEach(s => {
      // rough 15% estimated duties paid
      if (s.estado === "despachado" || s.estado === "inspeccion") {
        totalDuties += s.valorFactura * 0.15;
      }
    });
    
    const approved = state.shipments.reduce((acc, s) => {
      return acc + s.documentos.filter(d => d.estado === "Aprobado").length;
    }, 0);
    
    const redAlerts = state.shipments.filter(s => s.semaforo === "rojo").length;

    kpiActive.textContent = active;
    kpiTariffs.textContent = `$${Math.round(totalDuties).toLocaleString()} MXN`;
    kpiApproved.textContent = approved;
    kpiRed.textContent = redAlerts;

    // Populate Recent Shipments Table
    dbShipmentsBody.innerHTML = "";
    state.shipments.forEach(ship => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--accent-primary);">${ship.id}</td>
        <td>${ship.cliente}</td>
        <td>${ship.destino}</td>
        <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${ship.mercancia}</td>
        <td><span class="badge ${getStatusClass(ship.estado)}">${translateStatus(ship.estado)}</span></td>
        <td><span class="badge ${getSemaforoClass(ship.semaforo)}">${translateSemaforo(ship.semaforo)}</span></td>
        <td>
          <button class="btn-secondary btn-view-detail" data-id="${ship.id}" style="padding: 6px 12px; font-size: 0.8rem;">
            Ver Detalle
          </button>
        </td>
      `;
      dbShipmentsBody.appendChild(tr);
    });

    // Add listeners to table buttons
    document.querySelectorAll(".btn-view-detail").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        state.selectedShipmentId = id;
        navigateToSection("shipments");
        renderShipmentDetail(id);
      });
    });
  }

  // --- SHIPMENT CONTROLLER ---
  function renderShipmentsList() {
    shipmentsSidebarList.innerHTML = "";
    
    state.shipments.forEach(ship => {
      const card = document.createElement("div");
      card.className = `glass-card result-item ${state.selectedShipmentId === ship.id ? "selected" : ""}`;
      card.style.padding = "14px";
      card.style.cursor = "pointer";
      card.setAttribute("data-id", ship.id);

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
          <span style="font-family: var(--font-title); font-weight:700; color: var(--accent-primary);">${ship.id}</span>
          <span class="badge ${getSemaforoClass(ship.semaforo)}" style="transform: scale(0.9);">${translateSemaforo(ship.semaforo)}</span>
        </div>
        <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${ship.cliente}</div>
        <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 10px;">Aduana: ${ship.destino.replace("Aduana de ", "").replace("Aduana ", "")}</div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="badge ${getStatusClass(ship.estado)}" style="font-size: 0.7rem; padding: 2px 8px;">${translateStatus(ship.estado)}</span>
          <button class="btn-preview-ship" data-id="${ship.id}" title="Ver detalle del embarque"
            style="display:inline-flex;align-items:center;gap:5px;padding:5px 10px;font-size:0.73rem;font-weight:700;
                   background:linear-gradient(135deg,#ede9fe,#f5f3ff);color:#7c3aed;
                   border:1.5px solid #c4b5fd;border-radius:8px;cursor:pointer;
                   transition:background 0.15s,transform 0.1s;white-space:nowrap;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Ver
          </button>
        </div>
      `;

      card.addEventListener("click", () => {
        // Toggle selected state
        document.querySelectorAll("#shipments-sidebar-list .result-item").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        state.selectedShipmentId = ship.id;
        renderShipmentDetail(ship.id);
      });

      // Preview button — opens detail without card-click propagation
      const previewBtn = card.querySelector('.btn-preview-ship');
      if (previewBtn) {
        previewBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          document.querySelectorAll("#shipments-sidebar-list .result-item").forEach(c => c.classList.remove("selected"));
          card.classList.add("selected");
          state.selectedShipmentId = ship.id;
          renderShipmentDetail(ship.id);
          // Scroll the detail panel into view
          shipmentDetailContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        previewBtn.addEventListener('mouseenter', () => { previewBtn.style.background = 'linear-gradient(135deg,#c4b5fd,#ede9fe)'; previewBtn.style.transform = 'scale(1.05)'; });
        previewBtn.addEventListener('mouseleave', () => { previewBtn.style.background = 'linear-gradient(135deg,#ede9fe,#f5f3ff)'; previewBtn.style.transform = 'scale(1)'; });
      }

      shipmentsSidebarList.appendChild(card);
    });

    // If a shipment was already selected, render details
    if (state.selectedShipmentId) {
      renderShipmentDetail(state.selectedShipmentId);
    }
  }

  function renderShipmentDetail(id) {
    const shipment = state.shipments.find(s => s.id === id);
    if (!shipment) return;

    shipmentDetailPlaceholder.style.display = "none";
    shipmentDetailContent.style.display = "block";

    // Setup detail content
    let docsHtml = "";
    shipment.documentos.forEach((doc, idx) => {
      docsHtml += `
        <div class="document-item">
          <div class="doc-info">
            <div class="doc-icon">
              <i data-lucide="${getDocumentIcon(doc.tipo)}"></i>
            </div>
            <div class="doc-meta">
              <h4>${doc.tipo}</h4>
              <span>${doc.nombre} (${doc.fecha})</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap: 8px;">
            <span class="badge ${getDocStatusClass(doc.estado)}">${doc.estado}</span>
            ${doc.estado === "En Revisión" ? `
              <button class="btn-secondary btn-approve-doc" data-ship-id="${id}" data-doc-idx="${idx}" style="padding: 4px 8px; font-size: 0.75rem; color: var(--color-verde)">Aprobar</button>
            ` : ""}
            ${doc.estado === "Rechazado" ? `
              <span style="font-size: 0.7rem; color: var(--color-rojo)">Corregir archivo</span>
            ` : ""}
          </div>
        </div>
      `;
    });

    let timelineHtml = "";
    shipment.historial.forEach(hist => {
      const isCompleted = shipment.estado === "despachado" || 
                          (shipment.estado === "inspeccion" && hist.titulo !== "Despachado y Salida de Puerto") ||
                          hist.titulo !== "Mecanismo de Selección Automatizado";
                          
      timelineHtml += `
        <div class="timeline-item ${isCompleted ? 'completed' : ''} ${hist.icono.includes('x-circle') || hist.icono.includes('alert') ? 'error' : ''}">
          <div class="timeline-dot"></div>
          <div class="timeline-date">${hist.fecha}</div>
          <div class="timeline-title">${hist.titulo}</div>
          <div class="timeline-desc">${hist.descripcion}</div>
        </div>
      `;
    });

    shipmentDetailContent.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--card-border); padding-bottom: 20px; margin-bottom: 20px;">
        <div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 6px;">
            <span style="font-family: var(--font-title); font-size: 1.4rem; font-weight: 800; color: var(--accent-primary);">${shipment.id}</span>
            <span class="badge ${getSemaforoClass(shipment.semaforo)}">${translateSemaforo(shipment.semaforo).toUpperCase()} FISCAL</span>
          </div>
          <div style="font-size: 0.95rem; font-weight: 500; color: var(--text-primary);">${shipment.cliente}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.8rem; color: var(--text-muted);">VALOR FACTURA</div>
          <div style="font-family: var(--font-title); font-size: 1.25rem; font-weight: 700; color: var(--accent-teal);">$${shipment.valorFactura.toLocaleString()} ${shipment.moneda}</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px;">
        <!-- Left details: Specs and documents -->
        <div>
          <h3 class="card-title" style="margin-bottom: 12px;">Especificaciones Logísticas</h3>
          <div style="background-color: rgba(10, 13, 20, 0.2); border-radius: var(--border-radius-md); padding: 16px; margin-bottom: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.85rem;">
            <div>
              <span style="color:var(--text-muted); display:block; font-size:0.75rem;">MERCANCÍA:</span>
              <strong style="color:var(--text-primary);">${shipment.mercancia}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block; font-size:0.75rem;">OPERACIÓN:</span>
              <strong>${shipment.tipoOperacion}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block; font-size:0.75rem;">ORIGEN:</span>
              <strong>${shipment.origen} (${shipment.puertoOrigen})</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block; font-size:0.75rem;">DESTINO / ADUANA:</span>
              <strong>${shipment.destino}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block; font-size:0.75rem;">AGENTE ADUANAL:</span>
              <strong>${shipment.agenteAduanal}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block; font-size:0.75rem;">PEDIMENTO:</span>
              <strong style="color: var(--accent-primary);">${shipment.pedimento}</strong>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h3 class="card-title" style="margin: 0;">Expediente de Comercio Exterior</h3>
            <span style="font-size: 0.8rem; color:var(--text-muted);">${shipment.documentos.length} archivos cargados</span>
          </div>

          <!-- Document Upload Dropzone specific for this shipment -->
          <div class="upload-zone" id="detail-upload-zone" style="padding: 20px; margin-bottom: 16px; border-radius: var(--border-radius-md);">
            <i data-lucide="upload-cloud" style="width: 24px; height: 24px; margin-bottom: 8px;"></i>
            <h4 style="font-size: 0.9rem; font-weight: 600;">Cargar Documentación Adicional</h4>
            <p style="font-size: 0.75rem;">Arrastra archivos para agregarlos a este embarque</p>
            <input type="file" id="detail-file-input" style="display: none;" accept=".pdf,.xml,.jpg,.png">
          </div>

          <div class="document-list">
            ${docsHtml}
          </div>
        </div>

        <!-- Right details: Timeline tracker -->
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
            <h3 class="card-title" style="margin: 0;">Historial de Despacho</h3>
            ${shipment.estado !== "despachado" ? `
              <button class="btn-primary" id="btn-advance-status" data-id="${shipment.id}" style="padding: 4px 10px; font-size: 0.75rem;">
                <i data-lucide="arrow-right-circle" style="width: 14px; height:14px;"></i>
                Avanzar Paso
              </button>
            ` : ""}
          </div>
          <div class="timeline">
            ${timelineHtml}
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    setupDetailUploadZone(id);
    setupDocumentActions();

    // Advance status handler
    const btnAdvance = document.getElementById("btn-advance-status");
    if (btnAdvance) {
      btnAdvance.addEventListener("click", () => {
        advanceShipmentStatus(id);
      });
    }
  }

  // --- INTERACTIVE ACTIONS IN SHIPMENT DETAIL ---
  function setupDocumentActions() {
    document.querySelectorAll(".btn-approve-doc").forEach(btn => {
      btn.addEventListener("click", () => {
        const shipId = btn.getAttribute("data-ship-id");
        const docIdx = parseInt(btn.getAttribute("data-doc-idx"));
        
        const ship = state.shipments.find(s => s.id === shipId);
        if (ship && ship.documentos[docIdx]) {
          ship.documentos[docIdx].estado = "Aprobado";
          saveShipmentToDB(ship).then(() => {
            showToast(`Documento "${ship.documentos[docIdx].tipo}" aprobado con éxito.`, "success");
            renderShipmentDetail(shipId);
          });
        }
      });
    });
  }

  function advanceShipmentStatus(id) {
    const ship = state.shipments.find(s => s.id === id);
    if (!ship) return;

    const timestamp = new Date().toISOString().slice(0, 16).replace("T", " ");

    if (ship.estado === "documentacion") {
      ship.estado = "transito";
      ship.historial.push({
        fecha: timestamp,
        titulo: "Mercancía en Tránsito",
        descripcion: "El cargamento ha salido del punto de origen hacia la aduana de destino.",
        icono: "ship"
      });
      showToast("Embarque actualizado a: En Tránsito", "success");
    } else if (ship.estado === "transito") {
      ship.estado = "arribo";
      ship.historial.push({
        fecha: timestamp,
        titulo: "Arribo a Recinto Fiscalizado",
        descripcion: "El cargamento arriba a aduana y se posiciona en el recinto fiscalizado autorizado.",
        icono: "warehouse"
      });
      showToast("Embarque actualizado a: Arribado a Aduana", "success");
    } else if (ship.estado === "arribo") {
      ship.estado = "inspeccion";
      
      // Determine random semaforo color if pending
      if (ship.semaforo === "pendiente") {
        const rand = Math.random();
        if (rand < 0.65) {
          ship.semaforo = "verde"; // Despacho libre
          ship.estado = "despachado";
          ship.historial.push({
            fecha: timestamp,
            titulo: "Cruce Fiscal Automatizado (Verde)",
            descripcion: "Mecanismo arroja Despacho Libre. Se libera la mercancía inmediatamente.",
            icono: "check-circle"
          });
          ship.historial.push({
            fecha: timestamp,
            titulo: "Despachado y Salida de Puerto",
            descripcion: "Cargamento retirado por transportista terrestre. Fin de despacho aduanal.",
            icono: "truck"
          });
          showToast("¡Despacho libre! Canal Verde asignado.", "success");
        } else if (rand < 0.85) {
          ship.semaforo = "naranja";
          ship.historial.push({
            fecha: timestamp,
            titulo: "Revisión Documental (Naranja)",
            descripcion: "Autoridad aduanera realiza auditoría electrónica del pedimento y facturas.",
            icono: "alert-triangle"
          });
          showToast("Asignado: Canal Naranja (Revisión Documental).", "warning");
        } else {
          ship.semaforo = "rojo";
          ship.historial.push({
            fecha: timestamp,
            titulo: "Reconocimiento Aduanero (Rojo)",
            descripcion: "Se requiere inspección física minuciosa de los bultos por el verificador aduanal.",
            icono: "alert-triangle"
          });
          showToast("Atención: Canal Rojo. Requiere reconocimiento físico.", "error");
        }
      }
    } else if (ship.estado === "inspeccion") {
      // If it was orange or red, now it resolves to despachado
      ship.estado = "despachado";
      ship.semaforo = "verde";
      ship.historial.push({
        fecha: timestamp,
        titulo: "Inspección Favorable y Despachado",
        descripcion: "Se completan las revisiones aduaneras sin incidencias. Se autoriza la salida del recinto.",
        icono: "check-circle"
      });
      ship.historial.push({
        fecha: timestamp,
        titulo: "Despachado y Salida de Puerto",
        descripcion: "Cargamento liberado en ruta terrestre nacional.",
        icono: "truck"
      });
      showToast("¡Embarque liberado y despachado con éxito!", "success");
    }

    saveShipmentToDB(ship).then(() => {
      renderShipmentDetail(id);
      renderShipmentsList();
    });
  }

  function setupDetailUploadZone(shipmentId) {
    const dropzone = document.getElementById("detail-upload-zone");
    const fileInput = document.getElementById("detail-file-input");

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        simulateFileUpload(shipmentId, files[0]);
      }
    });

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        simulateFileUpload(shipmentId, files[0]);
      }
    });
  }

  function simulateFileUpload(shipmentId, file) {
    const shipment = state.shipments.find(s => s.id === shipmentId);
    if (!shipment) return;

    // Toast showing audit starting
    showToast(`Analizando pre-auditoría OCR para: ${file.name}...`, "warning");

    // Mock delay for OCR scan and document insertion
    setTimeout(() => {
      // Guess type based on file name or generic
      let type = "Certificado de Origen";
      const nameLower = file.name.toLowerCase();
      if (nameLower.includes("inv") || nameLower.includes("factura")) type = "Factura Comercial";
      else if (nameLower.includes("bl") || nameLower.includes("bill") || nameLower.includes("awb")) type = "Bill of Lading / AWB";
      else if (nameLower.includes("pack") || nameLower.includes("lista")) type = "Packing List";
      else if (nameLower.includes("pedi") || nameLower.includes("ped")) type = "Pedimento Simplificado";

      const timestamp = new Date().toISOString().split("T")[0];

      // Add to shipment documents
      shipment.documentos.push({
        tipo: type,
        nombre: file.name,
        fecha: timestamp,
        estado: "En Revisión"
      });

      // Add timeline entry
      shipment.historial.push({
        fecha: new Date().toISOString().slice(0, 16).replace("T", " "),
        titulo: `Carga de ${type}`,
        descripcion: `Archivo "${file.name}" cargado y enviado al motor de validación electrónica.`,
        icono: "file-text"
      });

      saveShipmentToDB(shipment).then(() => {
        renderShipmentDetail(shipmentId);
        showToast(`Documento "${type}" cargado con éxito. Estado: En Revisión.`, "success");
      });
    }, 1500);
  }

  // --- TARIFF CALCULATOR CONTROLLER ---
  // Setup live search
  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    if (term.length < 2) {
      searchResults.innerHTML = "";
      return;
    }

    const matches = window.AduanaData.fraccionesArancelarias.filter(item => {
      return item.codigo.includes(term) || item.nombre.toLowerCase().includes(term) || item.categoria.toLowerCase().includes(term);
    });

    renderSearchResults(matches);
  });

  function renderSearchResults(results) {
    searchResults.innerHTML = "";
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div style="padding: 16px; color: var(--text-muted); text-align: center;">
          No se encontraron fracciones arancelarias coincidentes. Intenta con "teléfono", "manzana", "calzado" o "8517".
        </div>
      `;
      return;
    }

    results.forEach(res => {
      const div = document.createElement("div");
      div.className = `result-item ${state.selectedTariffCode === res.codigo ? "selected" : ""}`;
      div.innerHTML = `
        <div>
          <div class="result-code">${res.codigo}</div>
          <div class="result-name">${res.nombre}</div>
          <div class="result-meta">Categoría: ${res.categoria} | Arancel IGI General: ${res.igi}%</div>
        </div>
        <div>
          <button class="btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;">Seleccionar</button>
        </div>
      `;

      div.addEventListener("click", () => {
        selectTariffCode(res);
      });

      searchResults.appendChild(div);
    });
  }

  function selectTariffCode(tariffObj) {
    state.selectedTariffCode = tariffObj.codigo;
    
    // Highlight in results
    document.querySelectorAll("#tariff-search-results .result-item").forEach(item => {
      item.classList.remove("selected");
    });
    
    // Show calculator pane
    calculatorLayout.style.display = "grid";
    displayCode.textContent = tariffObj.codigo;
    displayName.textContent = tariffObj.nombre;

    // Visual Cargo category representation
    if (tariffObj.categoria.includes("Electrónica")) {
      cargoCategoryIcon.textContent = "📱";
    } else if (tariffObj.categoria.includes("Textil") || tariffObj.categoria.includes("Calzado")) {
      cargoCategoryIcon.textContent = "👕";
    } else if (tariffObj.categoria.includes("Alimentos") || tariffObj.categoria.includes("Perecederos")) {
      cargoCategoryIcon.textContent = "🍎";
    } else if (tariffObj.categoria.includes("Salud")) {
      cargoCategoryIcon.textContent = "💊";
    } else {
      cargoCategoryIcon.textContent = "⚙️";
    }

    cargoAdviseText.textContent = `Clasificación ${tariffObj.categoria} validada.`;

    // Populate RRNA (Regulations)
    calcRrnaList.innerHTML = "";
    tariffObj.rrna.forEach(rule => {
      const badge = document.createElement("div");
      badge.className = "rrna-badge";
      badge.innerHTML = `
        <i data-lucide="alert-octagon" style="width: 16px; height: 16px;"></i>
        <span>${rule}</span>
      `;
      calcRrnaList.appendChild(badge);
    });

    // Populate advice box
    calcAdviseBox.textContent = tariffObj.consejos;
    
    lucide.createIcons();
    calculateDuties(tariffObj);
  }

  // Bind change events to recalculate dynamically
  [inputValFactura, inputOrigin, inputFreight, inputInsurance].forEach(elem => {
    elem.addEventListener("input", () => {
      if (state.selectedTariffCode) {
        const tariff = window.AduanaData.fraccionesArancelarias.find(t => t.codigo === state.selectedTariffCode);
        if (tariff) calculateDuties(tariff);
      }
    });
    
    elem.addEventListener("change", () => {
      if (state.selectedTariffCode) {
        const tariff = window.AduanaData.fraccionesArancelarias.find(t => t.codigo === state.selectedTariffCode);
        if (tariff) calculateDuties(tariff);
      }
    });
  });

  function calculateDuties(tariff) {
    const valFactura = parseFloat(inputValFactura.value) || 0;
    const freight = parseFloat(inputFreight.value) || 0;
    const insurance = parseFloat(inputInsurance.value) || 0;
    const origin = inputOrigin.value;

    // Base Gravable (Valor Aduana) = Factura + Incrementables (Flete + Seguro)
    const baseGravable = valFactura + freight + insurance;

    // Check Trade Agreements (TLC) to apply preference
    let igiRate = tariff.igi;
    let benefits = false;
    
    if (origin === "TLCAN" || origin === "TLCUE") {
      // Simplify logic: TLC exempts general duties for mock demonstration
      igiRate = 0;
      benefits = true;
    }

    // Apply specific rates based on product type
    // Medicines and fresh food are exempted from VAT (0% instead of 16%)
    let ivaRate = tariff.iva;

    // Computations
    const igi = baseGravable * (igiRate / 100);
    const dta = baseGravable * (tariff.dta / 100);
    const iva = (baseGravable + igi + dta) * (ivaRate / 100);
    const total = igi + dta + iva;

    // Update UI elements
    resCommValue.textContent = `$${valFactura.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} MXN`;
    resCustomsValue.textContent = `$${baseGravable.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} MXN`;
    
    igiRateBadge.textContent = `${igiRate}%`;
    if (benefits) {
      igiRateBadge.textContent = `0% Pref. TLC`;
      igiRateBadge.className = "badge badge-verde";
    } else {
      igiRateBadge.className = "badge badge-gris";
    }
    
    resIgi.textContent = `$${igi.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} MXN`;
    resDta.textContent = `$${dta.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} MXN`;
    
    ivaRateBadge.textContent = `${ivaRate}%`;
    if (ivaRate === 0) {
      ivaRateBadge.className = "badge badge-verde";
      ivaRateBadge.textContent = "0% (Exento)";
    } else {
      ivaRateBadge.className = "badge badge-gris";
    }
    
    resIva.textContent = `$${iva.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} MXN`;
    resTotal.textContent = `$${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} MXN`;

    state.lastCalculo = {
      fraccion_codigo: tariff.codigo,
      fraccion_nombre: tariff.nombre,
      valor_factura: valFactura,
      flete: freight,
      seguro: insurance,
      origen: origin,
      igi: igi,
      dta: dta,
      iva: iva,
      total_impuestos: total
    };
  }

  // Handle Save Calculo Button
  const btnSaveCalculo = document.getElementById("btn-save-calculo");
  if (btnSaveCalculo) {
    btnSaveCalculo.addEventListener("click", async () => {
      if (!state.lastCalculo) return showToast("Aún no hay ningún cálculo validado para guardar.", "error");

      const payload = {
        ...state.lastCalculo,
        id: `CALC-${String(Date.now()).slice(-5)}`,
        fecha: new Date().toISOString()
      };

      try {
        await authFetch('/api/calculos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        showToast("Cálculo guardado en el historial exitosamente.", "success");
        
        // Refresh history
        const res = await authFetch('/api/calculos');
        state.calculos = await res.json();
        renderCalculosHistory();
      } catch (e) {
        console.error(e);
        showToast("Error al guardar el cálculo en la BD.", "error");
      }
    });
  }

  function renderCalculosHistory() {
    const tbody = document.getElementById("calculos-history-body");
    if (!tbody) return;
    tbody.innerHTML = "";
    
    if (!state.calculos || state.calculos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px; color: var(--text-muted);">No hay cotizaciones guardadas en el historial.</td></tr>`;
      return;
    }

    state.calculos.forEach(c => {
      const dateStr = new Date(c.fecha).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${dateStr}</td>
        <td><strong style="color:var(--text-primary)">${c.fraccion_codigo}</strong><br><span style="font-size:0.75rem; color:var(--text-muted)">${c.fraccion_nombre.substring(0,30)}...</span></td>
        <td style="text-align:right">$${(c.valor_factura + c.flete + c.seguro).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
        <td>${c.origen}</td>
        <td style="text-align:right">$${c.igi.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
        <td style="text-align:right">$${c.dta.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
        <td style="text-align:right">$${c.iva.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
        <td style="font-weight:700; color:var(--accent-primary); text-align:right">$${c.total_impuestos.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // --- GENERAL DOCUMENTS TAB CONTROLLER ---
  function renderAllDocuments() {
    allDocsBody.innerHTML = "";
    
    let docCount = 0;
    state.shipments.forEach(ship => {
      ship.documentos.forEach((doc, idx) => {
        docCount++;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td style="font-weight: 600; color: #fff;">${doc.nombre}</td>
          <td>
            <div style="display:flex; align-items:center; gap:8px;">
              <i data-lucide="${getDocumentIcon(doc.tipo)}" style="width: 16px; height: 16px; color: var(--accent-blue)"></i>
              <span>${doc.tipo}</span>
            </div>
          </td>
          <td style="font-family: var(--font-title); font-weight:700; color: var(--accent-primary); cursor: pointer;" class="doc-ship-link" data-ship-id="${ship.id}">${ship.id}</td>
          <td>${doc.fecha}</td>
          <td><span class="badge ${getDocStatusClass(doc.estado)}">${doc.estado}</span></td>
          <td>
            <button class="btn-secondary btn-quick-approve" data-ship-id="${ship.id}" data-doc-idx="${idx}" style="padding: 4px 8px; font-size: 0.75rem; display: ${doc.estado === 'En Revisión' ? 'inline-block' : 'none'};">
              Validar
            </button>
            <span style="font-size: 0.8rem; color: var(--text-muted); display: ${doc.estado !== 'En Revisión' ? 'inline' : 'none'};">Listo</span>
          </td>
        `;
        allDocsBody.appendChild(tr);
      });
    });

    if (docCount === 0) {
      allDocsBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:30px;">No hay documentos registrados en el sistema.</td></tr>`;
    }

    // Bind link clicks to redirect to shipment tracking
    document.querySelectorAll(".doc-ship-link").forEach(link => {
      link.addEventListener("click", () => {
        const id = link.getAttribute("data-ship-id");
        state.selectedShipmentId = id;
        navigateToSection("shipments");
        renderShipmentDetail(id);
      });
    });

    // Quick validate button action
    document.querySelectorAll(".btn-quick-approve").forEach(btn => {
      btn.addEventListener("click", () => {
        const shipId = btn.getAttribute("data-ship-id");
        const docIdx = parseInt(btn.getAttribute("data-doc-idx"));
        
        const ship = state.shipments.find(s => s.id === shipId);
        if (ship && ship.documentos[docIdx]) {
          ship.documentos[docIdx].estado = "Aprobado";
          saveShipmentToDB(ship).then(() => {
            showToast(`Documento "${ship.documentos[docIdx].tipo}" aprobado.`, "success");
            renderAllDocuments();
          });
        }
      });
    });

    lucide.createIcons();
  }

  // --- CONVERTIDOR CONTROLLER ---
  function setupConverter() {
    if (!converterUploadZone) return;

    // Dropzone Click
    converterUploadZone.addEventListener("click", () => converterFileInput.click());

    // File Input Change
    converterFileInput.addEventListener("change", (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        handleConverterFile(files[0]);
      }
    });

    // Drag and drop event listeners
    converterUploadZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      converterUploadZone.classList.add("dragover");
    });

    converterUploadZone.addEventListener("dragleave", () => {
      converterUploadZone.classList.remove("dragover");
    });

    converterUploadZone.addEventListener("drop", (e) => {
      e.preventDefault();
      converterUploadZone.classList.remove("dragover");
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleConverterFile(files[0]);
      }
    });

    // Config controls change listeners to re-process raw text
    converterDelimiter.addEventListener("change", () => {
      if (state.rawConverterText) {
        processAndPreviewText();
      }
    });

    converterIgnoreEmpty.addEventListener("change", () => {
      if (state.rawConverterText) {
        processAndPreviewText();
      }
    });

    // Export button listener
    btnExportExcel.addEventListener("click", exportConverterToExcel);
  }

  function handleConverterFile(file) {
    // Show selected filename
    converterFileSelected.textContent = `Archivo cargado: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    converterFileSelected.style.display = "block";
    
    showToast(`Cargando y analizando "${file.name}"...`, "warning");

    const reader = new FileReader();
    reader.onload = (e) => {
      state.rawConverterText = e.target.result;
      processAndPreviewText();
      showToast("Archivo procesado. Revisa la previsualización abajo.", "success");
    };
    reader.onerror = () => {
      showToast("Error al leer el archivo de texto.", "error");
    };
    reader.readAsText(file);
  }

  function processAndPreviewText() {
    if (!state.rawConverterText) return;

    const ignoreEmpty = converterIgnoreEmpty.checked;
    let delimiter = converterDelimiter.value;
    const lines = state.rawConverterText.split(/\r?\n/);
    
    // Filter out empty lines if checked
    const activeLines = ignoreEmpty ? lines.filter(l => l.trim() !== "") : lines;

    if (activeLines.length === 0) {
      showToast("El archivo de texto está vacío o solo contiene líneas vacías.", "warning");
      return;
    }

    let headers = [];
    let data = [];

    // Autodetect delimiter if set to auto
    if (delimiter === "auto") {
      const counts = { comma: 0, semicolon: 0, tab: 0, pipe: 0 };
      // Sample first 20 lines to count delimiters
      const sampleLines = activeLines.slice(0, 20);
      sampleLines.forEach(line => {
        counts.comma += (line.match(/,/g) || []).length;
        counts.semicolon += (line.match(/;/g) || []).length;
        counts.tab += (line.match(/\t/g) || []).length;
        counts.pipe += (line.match(/\|/g) || []).length;
      });

      // Find max occurrence
      let maxCount = 0;
      let detected = "comma";
      for (const [key, count] of Object.entries(counts)) {
        if (count > maxCount) {
          maxCount = count;
          detected = key;
        }
      }
      
      // If we didn't find any delimiter, check if it looks like key-value
      if (maxCount === 0) {
        let keyValueMatches = 0;
        sampleLines.forEach(line => {
          if (line.includes(":") || line.includes("=")) keyValueMatches++;
        });
        if (keyValueMatches > sampleLines.length * 0.4) {
          detected = "keyvalue";
        } else {
          detected = "lines";
        }
      }
      
      delimiter = detected;
      console.log("Autodetected delimiter/format:", delimiter);
    }

    // Parse according to the determined delimiter
    if (delimiter === "keyvalue") {
      // Key-Value parsing mode
      let currentRecord = {};
      const uniqueKeys = new Set();
      const records = [];

      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed === "") {
          // Empty line marks end of a record
          if (Object.keys(currentRecord).length > 0) {
            records.push(currentRecord);
            currentRecord = {};
          }
        } else {
          // Parse key-value: look for ':' or '='
          const separatorIdx = trimmed.indexOf(":") !== -1 ? trimmed.indexOf(":") : trimmed.indexOf("=");
          if (separatorIdx !== -1) {
            const key = trimmed.substring(0, separatorIdx).trim();
            const val = trimmed.substring(separatorIdx + 1).trim();
            if (key) {
              currentRecord[key] = val;
              uniqueKeys.add(key);
            }
          }
        }
      });
      // Push last record
      if (Object.keys(currentRecord).length > 0) {
        records.push(currentRecord);
      }

      // Convert Set of keys to headers
      headers = Array.from(uniqueKeys).map(k => ({ original: k, current: k }));
      data = records;
      
      if (data.length === 0 && activeLines.length > 0) {
        // Fallback if keyvalue format failed to extract records
        showToast("No se detectó formato Clave-Valor estructurado. Probando con modo Línea por Fila.", "warning");
        delimiter = "lines";
      }
    }

    if (delimiter === "lines") {
      // Each line is a row with 1 column
      headers = [{ original: "Contenido", current: "Contenido" }];
      data = activeLines.map(line => [line]);
    } else if (delimiter !== "keyvalue") {
      // Tabular delimiters: comma, semicolon, tab, pipe
      let sep = ",";
      if (delimiter === "semicolon") sep = ";";
      else if (delimiter === "tab") sep = "\t";
      else if (delimiter === "pipe") sep = "|";

      // First line as header
      const headerLine = activeLines[0];
      const headerCells = headerLine.split(sep).map(h => h.trim());
      
      headers = headerCells.map((h, idx) => {
        const name = h || `Columna ${idx + 1}`;
        return { original: name, current: name };
      });

      // Data rows
      data = activeLines.slice(1).map(line => {
        return line.split(sep).map(c => c.trim());
      });
    }

    state.converterHeaders = headers;
    state.converterData = data;
    state.converterFormat = delimiter; // Save format used

    renderConverterPreview();
  }

  function renderConverterPreview() {
    if (!state.converterHeaders || state.converterHeaders.length === 0) {
      converterPreviewCard.style.display = "none";
      return;
    }

    converterPreviewCard.style.display = "block";
    
    // Clear head and body
    converterPreviewHead.innerHTML = "";
    converterPreviewBody.innerHTML = "";

    // Render Headers
    const headerTr = document.createElement("tr");
    state.converterHeaders.forEach((hdr, idx) => {
      const th = document.createElement("th");
      th.style.padding = "8px";
      th.innerHTML = `
        <input type="text" class="editable-header-input" value="${hdr.current}" data-idx="${idx}" title="Haz clic para renombrar la columna">
      `;
      headerTr.appendChild(th);
    });
    converterPreviewHead.appendChild(headerTr);

    // Bind event listeners to headers to update state.converterHeaders.current
    const inputs = headerTr.querySelectorAll(".editable-header-input");
    inputs.forEach(input => {
      input.addEventListener("input", (e) => {
        const idx = parseInt(e.target.getAttribute("data-idx"));
        state.converterHeaders[idx].current = e.target.value;
      });
    });

    // Render Rows (Preview up to 15 rows)
    const previewRows = state.converterData.slice(0, 15);
    
    if (previewRows.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = state.converterHeaders.length;
      td.style.textAlign = "center";
      td.style.padding = "20px";
      td.style.color = "var(--text-muted)";
      td.textContent = "No hay datos de filas para mostrar.";
      tr.appendChild(td);
      converterPreviewBody.appendChild(tr);
      return;
    }

    previewRows.forEach(row => {
      const tr = document.createElement("tr");
      state.converterHeaders.forEach((hdr) => {
        const td = document.createElement("td");
        td.style.padding = "10px 12px";
        
        let cellVal = "";
        if (state.converterFormat === "keyvalue") {
          // Data is object
          cellVal = row[hdr.original] !== undefined ? row[hdr.original] : "";
        } else {
          // Data is array
          const idx = state.converterHeaders.findIndex(h => h.original === hdr.original);
          cellVal = row[idx] !== undefined ? row[idx] : "";
        }
        
        td.textContent = cellVal;
        tr.appendChild(td);
      });
      converterPreviewBody.appendChild(tr);
    });
    
    // Add info note about total rows parsed
    const footerInfo = document.createElement("tr");
    const footerTd = document.createElement("td");
    footerTd.colSpan = state.converterHeaders.length;
    footerTd.style.padding = "12px";
    footerTd.style.fontSize = "0.8rem";
    footerTd.style.color = "var(--text-muted)";
    footerTd.style.backgroundColor = "var(--bg-primary)";
    footerTd.style.borderTop = "1px solid var(--card-border)";
    footerTd.innerHTML = `Mostrando previsualización de <strong>${previewRows.length}</strong> de <strong>${state.converterData.length}</strong> filas detectadas. Formato detectado: <strong>${translateDelimiterName(state.converterFormat)}</strong>.`;
    footerInfo.appendChild(footerTd);
    converterPreviewBody.appendChild(footerInfo);

    lucide.createIcons();
  }

  function translateDelimiterName(fmt) {
    switch(fmt) {
      case "comma": return "Coma (,)";
      case "semicolon": return "Punto y coma (;)";
      case "tab": return "Tabulación";
      case "pipe": return "Barra vertical (|)";
      case "keyvalue": return "Clave-Valor inteligente";
      case "lines": return "Línea por Fila";
      default: return fmt;
    }
  }

  function exportConverterToExcel() {
    if (!state.converterData || state.converterData.length === 0) {
      showToast("No hay datos cargados para exportar.", "error");
      return;
    }

    try {
      // Map data to the updated column titles (headers)
      const exportRows = state.converterData.map(row => {
        const item = {};
        state.converterHeaders.forEach((hdr) => {
          let cellVal = "";
          if (state.converterFormat === "keyvalue") {
            cellVal = row[hdr.original] !== undefined ? row[hdr.original] : "";
          } else {
            const idx = state.converterHeaders.findIndex(h => h.original === hdr.original);
            cellVal = row[idx] !== undefined ? row[idx] : "";
          }
          item[hdr.current || hdr.original] = cellVal;
        });
        return item;
      });

      const filename = `datos_convertidos_${new Date().toISOString().slice(0, 10)}`;

      // Check if SheetJS is available
      if (typeof XLSX !== 'undefined') {
        // Use SheetJS to write to Excel
        const worksheet = XLSX.utils.json_to_sheet(exportRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Datos Convertidos");
        
        // Auto-fit column widths
        const maxColWidths = [];
        state.converterHeaders.forEach(hdr => {
          const title = hdr.current || hdr.original;
          maxColWidths.push({ wch: Math.max(title.length + 3, 10) });
        });
        worksheet['!cols'] = maxColWidths;

        XLSX.writeFile(workbook, `${filename}.xlsx`);
        showToast(`¡Archivo Excel "${filename}.xlsx" descargado con éxito!`, "success");
      } else {
        // Fallback: Generate Excel-compatible CSV (Semicolon delimited, UTF-8 BOM)
        console.warn("SheetJS (XLSX) library not loaded. Falling back to CSV.");
        
        const headerNames = state.converterHeaders.map(hdr => hdr.current || hdr.original);
        
        // Escape helper for CSV cells
        const escapeCSVField = (val) => {
          if (val === null || val === undefined) return '';
          let text = String(val);
          if (text.includes(';') || text.includes('"') || text.includes('\n') || text.includes('\r')) {
            return `"${text.replace(/"/g, '""')}"`;
          }
          return text;
        };

        let csvContent = headerNames.map(escapeCSVField).join(';') + '\r\n';
        
        exportRows.forEach(row => {
          const line = headerNames.map(name => escapeCSVField(row[name])).join(';');
          csvContent += line + '\r\n';
        });

        // Add UTF-8 BOM to make Excel open it directly with accents/special characters
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", `${filename}.csv`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showToast(`¡Excel no disponible, descargado como CSV compatible: "${filename}.csv"!`, "warning");
        } else {
          showToast("No se pudo iniciar la descarga del archivo CSV.", "error");
        }
      }
    } catch (e) {
      console.error("Export error", e);
      showToast("Error al exportar los datos.", "error");
    }
  }

  // --- NEW SHIPMENT MODAL HANDLERS ---
  function setupEventListeners() {
    // Open Modal
    btnOpenModal.addEventListener("click", () => {
      modal.classList.add("active");
      state.uploadedModalFile = null;
      modalFileSelected.style.display = "none";
      modalFileSelected.textContent = "";
      newShipmentForm.reset();
    });

    // Close Modal
    const closeModal = () => {
      modal.classList.remove("active");
    };

    btnCloseModal.addEventListener("click", closeModal);
    btnCancelModal.addEventListener("click", closeModal);
    
    // Modal Drag and Drop zone
    modalUploadZone.addEventListener("click", () => modalFileInput.click());
    
    modalFileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        handleModalFileSelect(e.target.files[0]);
      }
    });

    modalUploadZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      modalUploadZone.classList.add("dragover");
    });

    modalUploadZone.addEventListener("dragleave", () => {
      modalUploadZone.classList.remove("dragover");
    });

    modalUploadZone.addEventListener("drop", (e) => {
      e.preventDefault();
      modalUploadZone.classList.remove("dragover");
      if (e.dataTransfer.files.length > 0) {
        handleModalFileSelect(e.dataTransfer.files[0]);
      }
    });

    // Submit New Shipment Form
    newShipmentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      submitNewShipment();
    });
  }

  function handleModalFileSelect(file) {
    state.uploadedModalFile = file;
    modalFileSelected.textContent = `Archivo seleccionado: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    modalFileSelected.style.display = "block";
    showToast("Archivo comercial adjuntado correctamente.", "warning");
  }

  function submitNewShipment() {
    const client = document.getElementById("ship-client").value;
    const desc = document.getElementById("ship-desc").value;
    const value = parseFloat(document.getElementById("ship-value").value) || 0;
    const origin = document.getElementById("ship-origin").value;
    const portOrigin = document.getElementById("ship-port-origin").value;
    const dest = document.getElementById("ship-dest").value;
    const patent = document.getElementById("ship-patent").value;

    const shipmentId = `MX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateToday = new Date().toISOString().split("T")[0];
    const timeToday = new Date().toISOString().slice(0, 16).replace("T", " ");

    // Setup documents array
    const documents = [];
    if (state.uploadedModalFile) {
      documents.push({
        tipo: "Factura Comercial",
        nombre: state.uploadedModalFile.name,
        fecha: dateToday,
        estado: "En Revisión"
      });
    } else {
      // Mock automatic invoice generation if they didn't upload any
      documents.push({
        tipo: "Factura Comercial",
        nombre: `INV-MOCK-${shipmentId.split("-")[2]}.pdf`,
        fecha: dateToday,
        estado: "Pendiente"
      });
    }

    // Create New Shipment Object
    const newShip = {
      id: shipmentId,
      cliente: client,
      mercancia: desc,
      origen: origin,
      puertoOrigen: portOrigin,
      destino: dest,
      valorFactura: value,
      moneda: "MXN",
      tipoOperacion: "Importación Definitiva",
      estado: "documentacion",
      semaforo: "pendiente",
      agenteAduanal: patent,
      pedimento: "Pendiente",
      documentos: documents,
      historial: [
        {
          fecha: timeToday,
          titulo: "Operación Iniciada en Portal",
          descripcion: `Embarque registrado por ${client} con destino a ${dest}. Expediente creado.`,
          icono: "file-text"
        }
      ]
    };

    // Add to state and save
    state.shipments.unshift(newShip);
    createShipmentInDB(newShip).then(() => {
      // Close Modal and notify
      modal.classList.remove("active");
      showToast(`¡Embarque ${shipmentId} creado con éxito en BD!`, "success");

      // Redirect to newly created shipment details
      navigateToSection("shipments");
      renderShipmentsList();
      renderShipmentDetail(shipmentId);
      
      // Update other views
      renderDashboard();
      renderAllDocuments();
      
      // Clear form
      newShipmentForm.reset();
      state.uploadedModalFile = null;
      modalFileSelected.style.display = "none";
    });
  }

  // --- HELPERS ---
  function getStatusClass(status) {
    switch(status) {
      case "documentacion": return "badge-gris";
      case "transito": return "badge-naranja";
      case "arribo": return "badge-naranja";
      case "inspeccion": return "badge-rojo";
      case "despachado": return "badge-verde";
      default: return "badge-gris";
    }
  }

  function translateStatus(status) {
    switch(status) {
      case "documentacion": return "En Documentación";
      case "transito": return "En Tránsito";
      case "arribo": return "Arribado Aduana";
      case "inspeccion": return "Inspección Fiscal";
      case "despachado": return "Despachado";
      default: return status;
    }
  }

  function getSemaforoClass(semaforo) {
    switch(semaforo) {
      case "verde": return "badge-verde";
      case "naranja": return "badge-naranja";
      case "rojo": return "badge-rojo";
      case "pendiente": return "badge-gris";
      default: return "badge-gris";
    }
  }

  function translateSemaforo(semaforo) {
    switch(semaforo) {
      case "verde": return "Verde (Libre)";
      case "naranja": return "Naranja (Doc)";
      case "rojo": return "Rojo (Inspección)";
      case "pendiente": return "Pendiente";
      default: return semaforo;
    }
  }

  function getDocStatusClass(estado) {
    switch(estado) {
      case "Aprobado": return "badge-verde";
      case "En Revisión": return "badge-naranja";
      case "Rechazado": return "badge-rojo";
      case "Pendiente": return "badge-gris";
      default: return "badge-gris";
    }
  }

  function getDocumentIcon(tipo) {
    const t = tipo.toLowerCase();
    if (t.includes("factura") || t.includes("invoice")) return "file-text";
    if (t.includes("lading") || t.includes("bl") || t.includes("awb")) return "anchor";
    if (t.includes("packing") || t.includes("lista")) return "list";
    if (t.includes("certificado") || t.includes("origen")) return "globe";
    if (t.includes("pedimento")) return "file-check";
    if (t.includes("fitosanitario")) return "shield-alert";
    return "file";
  }

  // Run initial function
  init();

  // ─────────────────────────────────────────────────────────────
  // MÓDULO DE REGISTROS (CRUD)
  // ─────────────────────────────────────────────────────────────

  let registros = [];
  let deleteTargetId = null;

  async function initRegistros() {
    try {
      const res = await authFetch('/api/registros');
      registros = await res.json();
    } catch (e) {
      console.error("Failed to load registros", e);
      showToast("Error conectando a la base de datos.", "error");
    }
    renderRegistrosTable();
    populateReporteClienteSelect();
  }

  // ─── Render table with filters ───
  // ─── Aging helpers ──────────────────────────────────────────────────────────
  function getDaysElapsed(fecha) {
    if (!fecha) return 0;
    const d = new Date(fecha + 'T00:00:00');
    const now = new Date();
    now.setHours(0,0,0,0);
    return Math.max(0, Math.floor((now - d) / 86400000));
  }

  function getAgingStyle(days) {
    // Returns { bg, leftColor, badgeHtml } — VIVID colors, clearly visible
    if (days === 0) return {
      bg: '#86efac',  /* green-300 */
      leftColor: '#16a34a',
      badgeHtml: '<span class="age-badge age-fresh">HOY</span>'
    };
    if (days <= 2) return {
      bg: '#bef264',  /* lime-300 */
      leftColor: '#65a30d',
      badgeHtml: `<span class="age-badge age-ok">${days}d</span>`
    };
    if (days <= 4) return {
      bg: '#fde047',  /* yellow-300 */
      leftColor: '#ca8a04',
      badgeHtml: `<span class="age-badge age-warn">${days}d</span>`
    };
    if (days <= 6) return {
      bg: '#fb923c',  /* orange-400 */
      leftColor: '#c2410c',
      badgeHtml: `<span class="age-badge age-orange">${days}d ⚠️</span>`
    };
    if (days <= 10) return {
      bg: '#f87171',  /* red-400 */
      leftColor: '#b91c1c',
      badgeHtml: `<span class="age-badge age-alert">${days}d 🚨</span>`
    };
    if (days <= 20) return {
      bg: '#ef4444',  /* red-500 */
      leftColor: '#7f1d1d',
      badgeHtml: `<span class="age-badge age-critical">${days}d 🔴</span>`
    };
    return {
      bg: '#b91c1c',  /* red-700 */
      leftColor: '#450a0a',
      badgeHtml: `<span class="age-badge age-extreme">${days}d ‼️</span>`
    };
  }

  function renderRegistrosTable() {
    const body    = document.getElementById('registros-body');
    const countEl = document.getElementById('registros-count');
    if (!body) return;

    const txt = (document.getElementById('reg-filter-text')?.value || '').toLowerCase();
    const op  = document.getElementById('reg-filter-op')?.value || '';
    const adu = document.getElementById('reg-filter-aduana')?.value || '';
    const fec = document.getElementById('reg-filter-fecha')?.value || '';
    const pri = document.getElementById('reg-filter-prioridad')?.value || '';

    const filtered = registros.filter(r => {
      const matchTxt = !txt || (r.refNo||'').toLowerCase().includes(txt) || (r.cliente||'').toLowerCase().includes(txt) || (r.mercancia||'').toLowerCase().includes(txt) || (r.importadorExportador||'').toLowerCase().includes(txt) || (r.observaciones||'').toLowerCase().includes(txt) || (r.contacto||'').toLowerCase().includes(txt);
      const matchOp  = !op  || r.operacion === op;
      const matchAdu = !adu || r.aduana === adu;
      const matchFec = !fec || r.fecha >= fec;
      const matchPri = !pri || String(r.prioridad) === pri;
      return matchTxt && matchOp && matchAdu && matchFec && matchPri;
    });

    // ─ Aging alert strip ────────────────────────────────
    const a7  = filtered.filter(r => getDaysElapsed(r.fecha) >  6).length;
    const a14 = filtered.filter(r => getDaysElapsed(r.fecha) > 13).length;
    const a21 = filtered.filter(r => getDaysElapsed(r.fecha) > 20).length;
    const alertEl = document.getElementById('aging-alert-strip');
    if (alertEl) {
      if (a7 === 0) {
        alertEl.style.display = 'none';
      } else {
        alertEl.style.display = 'flex';
        alertEl.innerHTML = `
          <span class="age-strip-icon">📅</span>
          <strong>Antigüedad:</strong>
          ${a7  ? `<span class="age-strip-badge age-alert">+7 días: ${a7} reg.</span>` : ''}
          ${a14 ? `<span class="age-strip-badge age-critical">+14 días: ${a14} reg.</span>` : ''}
          ${a21 ? `<span class="age-strip-badge age-extreme">+21 días: ${a21} reg. ‼️</span>` : ''}
        `;
      }
    }

    // Priority left-border (secondary indicator)
    const priBorder = { 1:'#22c55e', 2:'#eab308', 3:'#f97316', 4:'#e53e3e' };

    body.innerHTML = '';
    filtered.forEach(r => {
      const p   = r.prioridad || 4;
      const days = getDaysElapsed(r.fecha);
      const aging = getAgingStyle(days);
      // Determine age category for data attribute
      const ageCat = days === 0 ? 'fresh' : days <= 2 ? 'ok' : days <= 4 ? 'warn' : days <= 6 ? 'orange' : days <= 10 ? 'alert' : days <= 20 ? 'critical' : 'extreme';
      const ageTextColor = ['orange','alert','critical','extreme'].includes(ageCat) ? '#fff' : '#1a1a1a';

      const opBadge  = r.operacion === 'I' ? '<span class="badge badge-naranja">I</span>' : r.operacion === 'E' ? '<span class="badge badge-verde">E</span>' : '<span class="badge badge-gris">T</span>';
      const edoBadge = r.estado === 'T'    ? '<span class="badge badge-verde">T</span>'    : r.estado === 'P'   ? '<span class="badge badge-naranja">P</span>'  : '<span class="badge badge-rojo">C</span>';
      const priLabel = p === 4 ? '<span class="badge badge-rojo" style="font-weight:800;">4</span>' : p === 3 ? '<span class="badge badge-naranja" style="font-weight:800;">3</span>' : p === 2 ? '<span class="badge badge-amarillo" style="font-weight:800;">2</span>' : '<span class="badge badge-verde">1</span>';

      const tr = document.createElement('tr');
      tr.setAttribute('data-age', ageCat);
      // Row background from aging scale; left border from priority; row text contrast
      tr.style.background  = aging.bg;
      tr.style.borderLeft  = `3px solid ${priBorder[p]}`;
      tr.style.transition  = 'background 0.2s';
      tr.style.color       = ageTextColor;

      tr.innerHTML = `
        <td style="font-weight:800; color:${ageTextColor === '#fff' ? '#fef2f2' : 'var(--accent-primary)'}; font-family:var(--font-title); font-size:0.8rem;">${r.refNo}</td>
        <td style="text-align:center;">${edoBadge}</td>
        <td style="text-align:center;">${opBadge}</td>
        <td style="white-space:nowrap; font-size:0.75rem;">${r.fecha}<br>${aging.badgeHtml}</td>
        <td style="text-align:center;">${priLabel}</td>
        <td style="font-size:0.78rem; font-weight:600;">${r.aduana}</td>
        <td style="font-size:0.78rem;">${r.cliente}</td>
        <td style="text-align:center;">
          <div style="display:flex; gap:6px; justify-content:center;">
            <button class="btn-secondary btn-view-reg" data-id="${r.id}" title="Ver todo el detalle" style="padding:4px 10px; font-size:0.7rem; min-width:0; color:#7c3aed; border-color:#c4b5fd; display:flex; align-items:center; gap:4px; font-weight:700;">
              <i data-lucide="eye" style="width:12px;height:12px;"></i> Ver
            </button>
            <button class="btn-secondary btn-edit-reg" data-id="${r.id}" title="Editar" style="padding:4px 8px; font-size:0.7rem; min-width:0;">
              <i data-lucide="pencil" style="width:12px;height:12px;"></i>
            </button>
            <button class="btn-secondary btn-del-reg" data-id="${r.id}" title="Eliminar" style="padding:4px 8px; font-size:0.7rem; min-width:0; color:var(--color-rojo); border-color:var(--color-rojo-border);">
              <i data-lucide="trash-2" style="width:12px;height:12px;"></i>
            </button>
          </div>
        </td>
      `;
      body.appendChild(tr);
    });

    countEl.textContent = `${filtered.length} / ${registros.length}`;

    // Bind action buttons
    document.querySelectorAll('.btn-view-reg').forEach(btn => {
      btn.addEventListener('click', () => openPreviewRegistro(+btn.dataset.id));
    });
    document.querySelectorAll('.btn-edit-reg').forEach(btn => {
      btn.addEventListener('click', () => openEditRegistro(btn.getAttribute('data-id')));
    });
    document.querySelectorAll('.btn-del-reg').forEach(btn => {
      btn.addEventListener('click', () => openDeleteConfirm(btn.getAttribute('data-id')));
    });
    lucide.createIcons();
  }


  // ─── Open modal for new registro ───
  function openNewRegistro() {
    document.getElementById('registro-modal-title').textContent = 'Nuevo Registro de Operación';
    document.getElementById('registro-form').reset();
    document.getElementById('reg-id').value = '';
    document.getElementById('reg-fecha').value = new Date().toISOString().split('T')[0];
    document.getElementById('registro-modal').classList.add('active');
    lucide.createIcons();
  }

  // ─── Open modal pre-filled for editing ───
  // ─── Preview Modal ─────────────────────────────────────────────────────────
  let previewCurrentId = null;

  function openPreviewRegistro(id) {
    const r = registros.find(x => x.id === id);
    if (!r) return;
    previewCurrentId = id;

    const p = r.prioridad || 4;
    const priNames  = { 1: '🟢 NORMAL', 2: '🟡 MEDIA', 3: '🟠 ALTA', 4: '🔴 URGENTE' };
    const priClass  = { 1: 'badge-verde', 2: 'badge-amarillo', 3: 'badge-naranja', 4: 'badge-rojo' };
    const priStyle  = { 1: '', 2: '', 3: '', 4: '' };
    const opText    = r.operacion === 'I' ? 'Importación' : r.operacion === 'E' ? 'Exportación' : r.operacion;
    const edoText   = r.estado === 'T' ? '✅ Terminada' : r.estado === 'P' ? '⏳ En Proceso' : r.estado;

    // Header
    const header = document.getElementById('preview-header');
    header.className = `modal-header pri-${p}`;

    const badge = document.getElementById('preview-pri-badge');
    badge.className = `badge ${priClass[p]}`;
    badge.setAttribute('style', `font-size:0.78rem; padding:4px 12px; ${priStyle[p]}`);
    badge.textContent = priNames[p];

    document.getElementById('preview-refno').textContent = r.refNo;
    document.getElementById('preview-subtitle').textContent = `${r.cliente}  •  ${r.aduana}  •  ${r.fecha}`;

    // Populate fields
    document.getElementById('prev-estado').textContent    = edoText;
    document.getElementById('prev-fecha').textContent     = r.fecha;
    document.getElementById('prev-op').textContent        = opText;
    document.getElementById('prev-doc').textContent       = r.doc;
    document.getElementById('prev-aduana').textContent    = r.aduana;
    document.getElementById('prev-patente').textContent   = r.patente || '—';
    document.getElementById('prev-cliente').textContent   = r.cliente;
    document.getElementById('prev-impexp').textContent    = r.importadorExportador || '—';
    document.getElementById('prev-clase').textContent     = r.clase || '—';
    document.getElementById('prev-c20').textContent       = r.c20 ?? '—';
    document.getElementById('prev-c40').textContent       = r.c40 ?? '—';
    document.getElementById('prev-bultos').textContent    = r.bultos ?? '—';
    document.getElementById('prev-mercancia').textContent = r.mercancia || '—';
    document.getElementById('prev-obs').textContent       = r.observaciones || '(sin observaciones)';
    document.getElementById('prev-contacto').textContent  = r.contacto || '—';

    document.getElementById('preview-modal').classList.add('active');
    lucide.createIcons();
  }

  function openEditRegistro(id) {

    const r = registros.find(x => x.id === id);
    if (!r) return;

    document.getElementById('registro-modal-title').textContent = `Editar Registro: ${r.refNo}`;
    document.getElementById('reg-id').value = r.id;
    document.getElementById('reg-refno').value = r.refNo;
    document.getElementById('reg-fecha').value = r.fecha;
    document.getElementById('reg-estado').value = r.estado;
    document.getElementById('reg-operacion').value = r.operacion;
    document.getElementById('reg-doc').value = r.doc;
    document.getElementById('reg-aduana').value = r.aduana;
    document.getElementById('reg-cliente').value = r.cliente;
    document.getElementById('reg-imp-exp').value = r.importadorExportador;
    document.getElementById('reg-c20').value = r.c20;
    document.getElementById('reg-c40').value = r.c40;
    document.getElementById('reg-bultos').value = r.bultos;
    document.getElementById('reg-clase').value = r.clase;
    document.getElementById('reg-patente').value = r.patente;
    document.getElementById('reg-mercancia').value = r.mercancia;
    // New fields
    const obsEl = document.getElementById('reg-observaciones'); if(obsEl) obsEl.value = r.observaciones || '';
    const priEl = document.getElementById('reg-prioridad');    if(priEl) priEl.value = String(r.prioridad || 4);
    const cntEl = document.getElementById('reg-contacto');     if(cntEl) cntEl.value = r.contacto || '';

    document.getElementById('registro-modal').classList.add('active');
    lucide.createIcons();
  }

  // ─── Save (create or update) ───
  async function saveRegistroForm(e) {
    e.preventDefault();
    const id = document.getElementById('reg-id').value;
    const data = {
      id:                    id || `REG-${String(Date.now()).slice(-5)}`,
      refNo:                 document.getElementById('reg-refno').value.toUpperCase(),
      fecha:                 document.getElementById('reg-fecha').value,
      estado:                document.getElementById('reg-estado').value,
      operacion:             document.getElementById('reg-operacion').value,
      doc:                   document.getElementById('reg-doc').value,
      aduana:                document.getElementById('reg-aduana').value,
      cliente:               document.getElementById('reg-cliente').value.toUpperCase(),
      importadorExportador:  document.getElementById('reg-imp-exp').value.toUpperCase(),
      c20:                   parseInt(document.getElementById('reg-c20').value) || 0,
      c40:                   parseInt(document.getElementById('reg-c40').value) || 0,
      bultos:                parseInt(document.getElementById('reg-bultos').value) || 0,
      clase:                 document.getElementById('reg-clase').value,
      patente:               document.getElementById('reg-patente').value,
      mercancia:             document.getElementById('reg-mercancia').value.toUpperCase(),
      observaciones:         (document.getElementById('reg-observaciones')?.value || '').toUpperCase(),
      prioridad:             parseInt(document.getElementById('reg-prioridad')?.value || '4') || 4,
      contacto:              (document.getElementById('reg-contacto')?.value || '').toUpperCase()
    };

    try {
      if (id) {
        await authFetch(`/api/registros/${id}`, {
          method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)
        });
        const idx = registros.findIndex(x => x.id === id);
        if (idx > -1) registros[idx] = data;
        showToast(`Registro ${data.refNo} actualizado en la BD.`, 'success');
      } else {
        await authFetch(`/api/registros`, {
          method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)
        });
        registros.unshift(data);
        showToast(`Registro ${data.refNo} creado en la BD.`, 'success');
      }
    } catch(e) {
      console.error(e);
      showToast("Error al guardar en la BD.", "error");
    }

    document.getElementById('registro-modal').classList.remove('active');
    renderRegistrosTable();
    populateReporteClienteSelect();
  }

  // ─── Delete confirm ───
  function openDeleteConfirm(id) {
    const r = registros.find(x => x.id === id);
    if (!r) return;
    deleteTargetId = id;
    document.getElementById('confirm-delete-msg').textContent = `Referencia: ${r.refNo} — ${r.mercancia}`;
    document.getElementById('confirm-delete-modal').classList.add('active');
    lucide.createIcons();
  }

  async function confirmDelete() {
    if (!deleteTargetId) return;
    try {
      await fetch(`/api/registros/${deleteTargetId}`, { method: 'DELETE' });
      registros = registros.filter(x => x.id !== deleteTargetId);
      deleteTargetId = null;
      document.getElementById('confirm-delete-modal').classList.remove('active');
      showToast(`Registro eliminado de la BD.`, 'error');
      renderRegistrosTable();
      populateReporteClienteSelect();
    } catch(e) {
      console.error(e);
      showToast("Error al eliminar.", "error");
    }
  }

  // ─── Table scroll with arrow buttons + keyboard ─────────────────────────────
  function initTableScroll(containerId, wrapperId, btnLeftId, btnRightId, progressId) {
    const el      = document.getElementById(containerId);
    const wrapper = document.getElementById(wrapperId);
    const btnL    = document.getElementById(btnLeftId);
    const btnR    = document.getElementById(btnRightId);
    const prog    = document.getElementById(progressId);
    if (!el) return;

    const STEP = 280; // px per click / key press

    function updateUI() {
      const maxScroll = el.scrollWidth - el.clientWidth;
      const pct = maxScroll > 0 ? el.scrollLeft / maxScroll : 0;

      // Progress bar
      if (prog) {
        const thumbW   = Math.max(8, (el.clientWidth / el.scrollWidth) * 100);
        const thumbLeft = pct * (100 - thumbW);
        prog.style.width = thumbW + '%';
        prog.style.left  = thumbLeft + '%';
      }

      // Right-fade indicator
      if (wrapper) wrapper.classList.toggle('at-end', el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);

      // Disable buttons at boundaries
      if (btnL) btnL.disabled = el.scrollLeft <= 0;
      if (btnR) btnR.disabled = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    }

    function smoothScroll(amount) {
      el.scrollBy({ left: amount, behavior: 'smooth' });
      setTimeout(updateUI, 350);
    }

    // Arrow buttons
    btnL?.addEventListener('click', () => smoothScroll(-STEP));
    btnR?.addEventListener('click', () => smoothScroll(STEP));

    // Keyboard arrows (global, only active when #registros section is visible)
    document.addEventListener('keydown', (e) => {
      const section = document.getElementById('registros');
      if (!section || !section.classList.contains('active')) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); smoothScroll(STEP); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); smoothScroll(-STEP); }
    });

    // Sync on native scroll / touch
    el.addEventListener('scroll', updateUI, { passive: true });

    // Initial state
    updateUI();
  }

  function setupRegistrosEvents() {

    document.getElementById('btn-close-preview')?.addEventListener('click',  () => document.getElementById('preview-modal').classList.remove('active'));
    document.getElementById('btn-preview-close2')?.addEventListener('click', () => document.getElementById('preview-modal').classList.remove('active'));
    document.getElementById('btn-preview-edit')?.addEventListener('click',   () => {
      document.getElementById('preview-modal').classList.remove('active');
      if (previewCurrentId !== null) openEditRegistro(previewCurrentId);
    });
    document.getElementById('preview-modal')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) e.currentTarget.classList.remove('active');
    });

    document.getElementById('btn-new-registro')?.addEventListener('click', openNewRegistro);
    document.getElementById('btn-close-registro-modal')?.addEventListener('click', () => document.getElementById('registro-modal').classList.remove('active'));
    document.getElementById('btn-cancel-registro')?.addEventListener('click', () => document.getElementById('registro-modal').classList.remove('active'));
    document.getElementById('registro-form')?.addEventListener('submit', saveRegistroForm);

    document.getElementById('btn-close-confirm')?.addEventListener('click', () => document.getElementById('confirm-delete-modal').classList.remove('active'));
    document.getElementById('btn-cancel-delete')?.addEventListener('click', () => document.getElementById('confirm-delete-modal').classList.remove('active'));
    document.getElementById('btn-confirm-delete')?.addEventListener('click', confirmDelete);

    // Filters — all 5 inputs trigger re-render
    ['reg-filter-text', 'reg-filter-op', 'reg-filter-aduana', 'reg-filter-fecha', 'reg-filter-prioridad'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', renderRegistrosTable);
      document.getElementById(id)?.addEventListener('change', renderRegistrosTable);
    });
    document.getElementById('btn-reg-clear-filters')?.addEventListener('click', () => {
      ['reg-filter-text'].forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
      ['reg-filter-op', 'reg-filter-aduana', 'reg-filter-prioridad'].forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
      const fd = document.getElementById('reg-filter-fecha'); if(fd) fd.value = '';
      renderRegistrosTable();
    });
  }


  // ─────────────────────────────────────────────────────────────
  // MÓDULO DE REPORTES
  // ─────────────────────────────────────────────────────────────

  function populateReporteClienteSelect() {
    const sel = document.getElementById('rep-filter-cliente');
    if (!sel) return;
    const clientes = [...new Set(registros.map(r => r.cliente))].sort();
    sel.innerHTML = '<option value="">Todos los Clientes</option>';
    clientes.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      sel.appendChild(opt);
    });
  }

  function generateReport() {
    const tipo    = document.getElementById('rep-tipo')?.value || 'general';
    const op      = document.getElementById('rep-filter-op')?.value || '';
    const aduana  = document.getElementById('rep-filter-aduana')?.value || '';
    const cliente = document.getElementById('rep-filter-cliente')?.value || '';
    const patente = document.getElementById('rep-filter-patente')?.value || '';
    const fechaIni= document.getElementById('rep-fecha-inicio')?.value || '';
    const fechaFin= document.getElementById('rep-fecha-fin')?.value || '';

    let filtered = registros.filter(r => {
      if (op      && r.operacion !== op)    return false;
      if (aduana  && r.aduana   !== aduana) return false;
      if (cliente && r.cliente  !== cliente)return false;
      if (patente && r.patente  !== patente)return false;
      if (fechaIni && r.fecha   <  fechaIni)return false;
      if (fechaFin && r.fecha   >  fechaFin)return false;
      return true;
    });

    const now      = new Date();
    const dateStr  = now.toLocaleDateString('es-MX');
    const timeStr  = now.toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit' });
    const aduanaLabel  = aduana  || 'TODAS LAS ADUANAS';
    const patenteLabel = patente ? `PATENTE ${patente}` : 'TODAS LAS PATENTES';
    const clienteLabel = cliente || 'TODOS LOS CLIENTES';
    const opLabel      = op === 'I' ? 'IMPORTACIONES' : op === 'E' ? 'EXPORTACIONES' : 'IMPORTACIONES Y EXPORTACIONES';

    let html = '';

    if (tipo === 'urgencias') {
      // ── REPORTE POR PRIORIDAD (URGENCIAS) ──────────────────────────────────
      filtered.sort((a, b) => (a.prioridad || 4) - (b.prioridad || 4));

      const priLabelMap = { 1:'🟢 1 — NORMAL', 2:'🟡 2 — MEDIA', 3:'🟠 3 — ALTA', 4:'🔴 4 — URGENTE' };
      const priBorderMap = { 1:'#22c55e', 2:'#eab308', 3:'#f97316', 4:'#e53e3e' };

      const rows = filtered.map((r, i) => {
        const p      = r.prioridad || 4;
        const days   = getDaysElapsed(r.fecha);
        const aging  = getAgingStyle(days);
        const ageCat = days === 0 ? 'fresh' : days <= 2 ? 'ok' : days <= 4 ? 'warn' : days <= 6 ? 'orange' : days <= 10 ? 'alert' : days <= 20 ? 'critical' : 'extreme';
        const txtColor = ['orange','alert','critical','extreme'].includes(ageCat) ? '#fff' : '#111';
        const refColor = ['orange','alert','critical','extreme'].includes(ageCat) ? '#fef2f2' : '#1e3a5f';
        const leftColor = priBorderMap[p];
        const dayLabel = days === 0 ? 'HOY' : `${days}d`;
        return `
          <tr style="background:${aging.bg}; border-left: 5px solid ${leftColor}; color:${txtColor};">
            <td style="text-align:center; font-weight:700; padding:6px 4px;">${i+1}</td>
            <td style="white-space:nowrap; padding:6px 6px;">${r.fecha}</td>
            <td style="text-align:center; font-weight:800; padding:6px 4px; background:${aging.bg}; color:${txtColor};">${dayLabel}</td>
            <td style="white-space:nowrap; font-weight:600; padding:6px 6px;">${r.aduana}</td>
            <td style="font-weight:800; padding:6px 6px; color:${refColor};">${r.refNo}</td>
            <td style="max-width:110px; word-break:break-word; font-weight:600; padding:6px 6px;">${r.cliente}</td>
            <td style="max-width:150px; word-break:break-word; padding:6px 6px;">${r.mercancia}</td>
            <td style="max-width:240px; word-break:break-word; font-size:0.77rem; padding:6px 6px;">${r.observaciones || ''}</td>
            <td style="text-align:center; font-weight:800; color:${leftColor}; font-size:0.9rem; padding:6px 4px; ${txtColor==='#fff' ? 'background:rgba(255,255,255,0.15);' : ''}">${priLabelMap[p].split('—')[0].trim()}</td>
            <td style="font-weight:600; white-space:nowrap; padding:6px 6px;">${r.contacto || ''}</td>
          </tr>
        `;
      }).join('');

      html = `
        <div style="font-family: Arial, sans-serif; font-size: 0.82rem; color: #111;">
          <!-- HEADER URGENCIAS -->
          <div style="background:#1e3a5f; color:#fff; text-align:center; padding:10px 16px; margin-bottom:4px;">
            <div style="font-size:1rem; font-weight:800; letter-spacing:0.5px;">REPORTE DE REFERENCIAS GENERAL POR ORDEN DE PRIORIDAD (URGENCIAS)</div>
            <div style="font-size:0.78rem; margin-top:4px; opacity:0.85;">${opLabel} &bull; ${aduanaLabel} &bull; PARA ${clienteLabel}</div>
          </div>
          <div style="display:flex; justify-content:space-between; background:#f0f4ff; padding:6px 12px; margin-bottom:8px; font-size:0.75rem; border-bottom:1px solid #c7d2fe;">
            <span>Fecha: <strong>${dateStr}</strong> &nbsp;|&nbsp; Hora: <strong>${timeStr}</strong></span>
            <span>Registros: <strong>${filtered.length}</strong></span>
          </div>
          <!-- LEYENDA ANTIGÜEDAD -->
          <div style="display:flex; gap:8px; margin-bottom:6px; font-size:0.72rem; flex-wrap:wrap; align-items:center;">
            <strong>Antigüedad:</strong>
            <span style="background:#86efac; padding:2px 8px; border-radius:10px;">HOY</span>
            <span style="background:#bef264; padding:2px 8px; border-radius:10px;">1-2d</span>
            <span style="background:#fde047; padding:2px 8px; border-radius:10px;">3-4d</span>
            <span style="background:#fb923c; color:#fff; padding:2px 8px; border-radius:10px;">5-6d ⚠️</span>
            <span style="background:#f87171; color:#fff; padding:2px 8px; border-radius:10px;">7-10d 🚨</span>
            <span style="background:#ef4444; color:#fff; padding:2px 8px; border-radius:10px;">11-20d 🔴</span>
            <span style="background:#b91c1c; color:#fff; padding:2px 8px; border-radius:10px;">21d+ ‼️</span>
          </div>
          <!-- LEYENDA PRIORIDAD -->
          <div style="display:flex; gap:12px; margin-bottom:10px; font-size:0.72rem;">
            <span style="border-left:4px solid #e53e3e; padding:2px 8px; background:#ffe4e1;">&#9632; Pri. 4 &mdash; Urgente</span>
            <span style="border-left:4px solid #f97316; padding:2px 8px; background:#ffedd5;">&#9632; Pri. 3 &mdash; Alta</span>
            <span style="border-left:4px solid #eab308; padding:2px 8px; background:#fef9c3;">&#9632; Pri. 2 &mdash; Media</span>
            <span style="border-left:4px solid #22c55e; padding:2px 8px; background:#dcfce7;">&#9632; Pri. 1 &mdash; Normal</span>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:0.78rem;">
            <thead>
              <tr style="background:#1e3a5f; color:#fff;">
                <th style="padding:7px 4px; text-align:center; width:30px;">#</th>
                <th style="padding:7px 6px; width:75px;">FECHA</th>
                <th style="padding:7px 4px; text-align:center; width:42px;">DÍAS</th>
                <th style="padding:7px 6px; width:85px;">ADUANA</th>
                <th style="padding:7px 6px;">REF</th>
                <th style="padding:7px 6px;">CLIENTE</th>
                <th style="padding:7px 6px;">MERCANCÍA</th>
                <th style="padding:7px 6px;">OBSERVACIONES</th>
                <th style="padding:7px 4px; text-align:center; width:45px;">PRI.</th>
                <th style="padding:7px 6px;">CONTACTO</th>
              </tr>
            </thead>
            <tbody>${rows || '<tr><td colspan="10" style="text-align:center;padding:20px;color:#888;">Sin registros para los filtros seleccionados.</td></tr>'}</tbody>
            <tfoot>
              <tr style="background:#e8eeff; font-weight:700; border-top:2px solid #1e3a5f;">
                <td colspan="10" style="padding:8px;">Cantidad de Referencias: <strong>${filtered.length}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      `;
    } else {
      // ── REPORTE GENERAL ────────────────────────────────────────────────────
      const rows = filtered.map((r, i) => {
        const days   = getDaysElapsed(r.fecha);
        const aging  = getAgingStyle(days);
        const ageCat = days === 0 ? 'fresh' : days <= 2 ? 'ok' : days <= 4 ? 'warn' : days <= 6 ? 'orange' : days <= 10 ? 'alert' : days <= 20 ? 'critical' : 'extreme';
        const txtColor = ['orange','alert','critical','extreme'].includes(ageCat) ? '#fff' : '#111';
        const refColor = ['orange','alert','critical','extreme'].includes(ageCat) ? '#fef2f2' : '#1e3a5f';
        const dayLabel = days === 0 ? 'HOY' : `${days}d`;
        return `
        <tr style="background:${aging.bg}; color:${txtColor};">
          <td style="font-weight:800; padding:5px 6px; color:${refColor};">${r.refNo}</td>
          <td style="text-align:center; padding:5px 4px;">${r.estado}</td>
          <td style="padding:5px 6px; white-space:nowrap;">${r.fecha}</td>
          <td style="text-align:center; font-weight:700; padding:5px 4px;">${dayLabel}</td>
          <td style="text-align:center; padding:5px 4px;">${r.operacion}</td>
          <td style="text-align:center; padding:5px 4px;">${r.doc}</td>
          <td style="max-width:130px; word-break:break-word; padding:5px 6px;">${r.cliente}</td>
          <td style="max-width:150px; word-break:break-word; font-size:0.76rem; padding:5px 6px;">${r.importadorExportador}</td>
          <td style="text-align:center; padding:5px 4px;">${r.c20}</td>
          <td style="text-align:center; padding:5px 4px;">${r.c40}</td>
          <td style="text-align:center; padding:5px 4px;">${r.bultos}</td>
          <td style="padding:5px 6px;">${r.clase}</td>
          <td style="max-width:140px; word-break:break-word; padding:5px 6px;">${r.mercancia}</td>
        </tr>
      `}).join('');

      const totalBultos = filtered.reduce((s, r) => s + r.bultos, 0);
      const totalC20    = filtered.reduce((s, r) => s + r.c20, 0);
      const totalC40    = filtered.reduce((s, r) => s + r.c40, 0);

      html = `
        <div style="font-family: Arial, sans-serif; font-size: 0.82rem; color: #111;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom: 2px solid #1e3a5f; padding-bottom: 12px; margin-bottom: 10px;">
            <div style="flex:1;">
              <div style="font-size: 1rem; font-weight: 800; text-align:center; text-transform:uppercase; letter-spacing:0.5px; color:#1e3a5f;">REPORTE GENERAL DE REFERENCIAS</div>
              <div style="text-align:center; color:#444; margin-top:4px; font-size:0.78rem;">
                ${opLabel} &bull; ${aduanaLabel} &bull; ${patenteLabel}<br>
                PARA ${clienteLabel}
                ${fechaIni || fechaFin ? `<br>Per&iacute;odo: ${fechaIni || '&mdash;'} a ${fechaFin || '&mdash;'}` : '<br>TODOS LOS A&Ntilde;OS'}
              </div>
            </div>
            <div style="text-align:right; font-size:0.78rem; color:#555; min-width:140px; padding-left:16px; border-left:1px solid #ddd;">
              <div style="font-weight:700; font-size:0.9rem; color:#1e3a5f;">AduanaFlow</div>
              <div>Fecha: ${dateStr}</div>
              <div>Hora: ${timeStr}</div>
              <div>P&aacute;gina: 1</div>
            </div>
          </div>
          <!-- LEYENDA ANTIGÜEDAD -->
          <div style="display:flex; gap:8px; margin-bottom:10px; font-size:0.72rem; flex-wrap:wrap; align-items:center;">
            <strong>Antigüedad:</strong>
            <span style="background:#86efac; padding:2px 8px; border-radius:10px;">HOY</span>
            <span style="background:#bef264; padding:2px 8px; border-radius:10px;">1-2d</span>
            <span style="background:#fde047; padding:2px 8px; border-radius:10px;">3-4d</span>
            <span style="background:#fb923c; color:#fff; padding:2px 8px; border-radius:10px;">5-6d ⚠️</span>
            <span style="background:#f87171; color:#fff; padding:2px 8px; border-radius:10px;">7-10d 🚨</span>
            <span style="background:#ef4444; color:#fff; padding:2px 8px; border-radius:10px;">11-20d 🔴</span>
            <span style="background:#b91c1c; color:#fff; padding:2px 8px; border-radius:10px;">21d+ ‼️</span>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:0.78rem;">
            <thead>
              <tr style="background:#1e3a5f; color:#fff;">
                <th style="padding:7px 6px; text-align:left;">Ref.No.</th>
                <th style="padding:7px 4px; text-align:center;">Edo.</th>
                <th style="padding:7px 6px;">Fecha</th>
                <th style="padding:7px 4px; text-align:center;">Días</th>
                <th style="padding:7px 4px; text-align:center;">Op.</th>
                <th style="padding:7px 4px; text-align:center;">Doc.</th>
                <th style="padding:7px 6px;">Cliente</th>
                <th style="padding:7px 6px;">Importador/Exportador</th>
                <th style="padding:7px 4px; text-align:center;">C20</th>
                <th style="padding:7px 4px; text-align:center;">C40</th>
                <th style="padding:7px 4px; text-align:center;">Bultos</th>
                <th style="padding:7px 6px;">Clase</th>
                <th style="padding:7px 6px;">Mercanc&iacute;a</th>
              </tr>
            </thead>
            <tbody>${rows || '<tr><td colspan="13" style="text-align:center;padding:20px;color:#888;">Sin registros para los filtros seleccionados.</td></tr>'}</tbody>
            <tfoot>
              <tr style="background:#e8eeff; font-weight:700; border-top:2px solid #1e3a5f;">
                <td colspan="8" style="padding:8px;">Cantidad de Referencias: <strong>${filtered.length}</strong></td>
                <td style="text-align:center; padding:8px;">${totalC20}</td>
                <td style="text-align:center; padding:8px;">${totalC40}</td>
                <td style="text-align:center; padding:8px;">${totalBultos}</td>
                <td colspan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      `;
    }

    const container = document.getElementById('report-preview-container');
    const printable  = document.getElementById('report-printable');
    printable.innerHTML = html;
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth' });
    showToast(`Reporte generado: ${filtered.length} registros.`, 'success');
  }



  function printReport() {
    const content = document.getElementById('report-printable')?.innerHTML;
    if (!content) { generateReport(); return; }
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html><html><head>
      <meta charset="UTF-8">
      <title>Reporte Aduanal — AduanaFlow</title>
      <style>
        @page { size: A4 landscape; margin: 12mm; }
        body { font-family: Arial, sans-serif; font-size: 9pt; color: #111; margin:0; }
        table { width:100%; border-collapse:collapse; }
        th { background:#1e3a5f; color:#fff; padding:5px 6px; text-align:left; font-size:8pt; }
        td { padding:4px 6px; border-bottom:1px solid #e5e7eb; font-size:8pt; word-break:break-word; }
        tfoot tr { background:#e8eeff; font-weight:bold; border-top:2px solid #1e3a5f; }
        tr:nth-child(even) { background:#fafafe; }
        .rep-row td { max-width:140px; }
      </style>
      </head><body>${content}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  }

  function escapeCSV(str) {
    if (str === null || str === undefined) return '""';
    const s = String(str);
    return '"' + s.replace(/"/g, '""') + '"';
  }

  function exportToExcel() {
    const tipo    = document.getElementById('rep-tipo')?.value || 'general';
    const op      = document.getElementById('rep-filter-op')?.value || '';
    const aduana  = document.getElementById('rep-filter-aduana')?.value || '';
    const cliente = document.getElementById('rep-filter-cliente')?.value || '';
    const patente = document.getElementById('rep-filter-patente')?.value || '';
    const fechaIni= document.getElementById('rep-fecha-inicio')?.value || '';
    const fechaFin= document.getElementById('rep-fecha-fin')?.value || '';

    let filtered = registros.filter(r => {
      if (op      && r.operacion !== op)    return false;
      if (aduana  && r.aduana   !== aduana) return false;
      if (cliente && r.cliente  !== cliente)return false;
      if (patente && r.patente  !== patente)return false;
      if (fechaIni && r.fecha   <  fechaIni)return false;
      if (fechaFin && r.fecha   >  fechaFin)return false;
      return true;
    });

    if (filtered.length === 0) {
      alert("No hay datos para exportar con los filtros seleccionados.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // BOM for UTF-8 Excel support
    
    if (tipo === 'urgencias') {
      csvContent += "REFERENCIA,ESTADO,FECHA,DÍAS,PRIORIDAD,ADUANA,CLIENTE,MERCANCÍA,OBSERVACIONES,CONTACTO\n";
      
      filtered.sort((a, b) => {
        if (a.prioridad !== b.prioridad) return a.prioridad - b.prioridad;
        const daysA = getDaysElapsed(a.fecha);
        const daysB = getDaysElapsed(b.fecha);
        return daysB - daysA;
      });

      filtered.forEach(r => {
        const days = getDaysElapsed(r.fecha);
        let row = [
          escapeCSV(r.refNo), escapeCSV(r.estado), escapeCSV(r.fecha), days, r.prioridad, escapeCSV(r.aduana), 
          escapeCSV(r.cliente), escapeCSV(r.mercancia), escapeCSV(r.observaciones), escapeCSV(r.contacto)
        ];
        csvContent += row.join(",") + "\n";
      });
    } else {
      csvContent += "REFERENCIA,ESTADO,FECHA,DÍAS,OPERACIÓN,DOCUMENTO,CLIENTE,IMPORTADOR_EXPORTADOR,C20,C40,BULTOS,CLASE,MERCANCÍA\n";
      
      filtered.forEach(r => {
        const days = getDaysElapsed(r.fecha);
        let row = [
          escapeCSV(r.refNo), escapeCSV(r.estado), escapeCSV(r.fecha), days, escapeCSV(r.operacion), escapeCSV(r.doc), 
          escapeCSV(r.cliente), escapeCSV(r.importadorExportador), r.c20, r.c40, r.bultos, escapeCSV(r.clase), escapeCSV(r.mercancia)
        ];
        csvContent += row.join(",") + "\n";
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Reporte_Aduanas_${tipo}_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function setupReportesEvents() {
    document.getElementById('btn-gen-report')?.addEventListener('click', generateReport);
    document.getElementById('btn-print-report')?.addEventListener('click', printReport);
    document.getElementById('btn-excel-report')?.addEventListener('click', exportToExcel);
  }

  // init new modules
  initRegistros();
  setupRegistrosEvents();
  setupReportesEvents();

});
