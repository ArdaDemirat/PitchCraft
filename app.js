/* ==========================================================================
   PitchCraft Studio — Application Controller, State & Export Engine
   ========================================================================== */

(function () {
  const STORAGE_KEY = "pitchcraft_studio_v1";
  const UI_THEME_KEY = "pitchcraft_ui_theme";

  let state = loadState();
  let activeView = "charts";
  let activeChart = "coreLoop";

  // DOM References
  const htmlEl = document.documentElement;
  const projectTitleInput = document.getElementById("projectTitleInput");
  const saveIndicator = document.getElementById("saveIndicator");
  const presetSelector = document.getElementById("presetSelector");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const themeToggleIcon = document.getElementById("themeToggleIcon");

  const pitchCanvas = document.getElementById("pitchCanvas");
  const canvasStage = document.getElementById("canvasStage");
  const canvasModeHint = document.getElementById("canvasModeHint");
  const chartThemeSelect = document.getElementById("chartThemeSelect");
  const transparentBgToggle = document.getElementById("transparentBgToggle");
  const chartEditorContainer = document.getElementById("chartEditorContainer");
  const editorPanelTitle = document.getElementById("editorPanelTitle");

  const gddTocList = document.getElementById("gddTocList");
  const gddSectionsContainer = document.getElementById("gddSectionsContainer");
  const genreTemplateSelect = document.getElementById("genreTemplateSelect");
  const applyGenreTemplateBtn = document.getElementById("applyGenreTemplateBtn");

  const onePageSheet = document.getElementById("onePageSheet");
  const checklistContainer = document.getElementById("checklistContainer");
  const checklistScoreBadge = document.getElementById("checklistScoreBadge");

  const sidebarGddPct = document.getElementById("sidebarGddPct");
  const sidebarGddLabel = document.getElementById("sidebarGddLabel");
  const sidebarGddBar = document.getElementById("sidebarGddBar");
  const sidebarCheckPct = document.getElementById("sidebarCheckPct");
  const sidebarCheckLabel = document.getElementById("sidebarCheckLabel");
  const sidebarCheckBar = document.getElementById("sidebarCheckBar");

  /* ------------------------------------------------------------------------
     Utilities & Persistence
     ------------------------------------------------------------------------ */
  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function slugify(str) {
    return (str || "proje")
      .toLowerCase()
      .replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ\s-]/gi, "")
      .trim()
      .replace(/\s+/g, "-") || "proje";
  }

  function showToast(msg) {
    const container = document.getElementById("toastContainer");
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 2800);
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.charts && parsed.gdd) {
          if (!parsed.charts.coreAnalysis) {
            parsed.charts.coreAnalysis = createDefaultState().charts.coreAnalysis;
          }
          if (!parsed.charts.gameLoopFlow) {
            parsed.charts.gameLoopFlow = createDefaultState().charts.gameLoopFlow;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn("LocalStorage okunamadı, varsayılan yükleniyor:", e);
    }
    return createDefaultState();
  }

  let saveTimer = null;
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      saveIndicator.textContent = "● Kaydediliyor...";
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        saveIndicator.textContent = "● Otomatik kaydedildi";
      }, 450);
    } catch (e) {
      console.warn("Kaydetme hatası:", e);
    }
    updateProgressIndicators();
  }

  function applyUiTheme(mode) {
    const clean = mode === "dark" ? "dark" : "light";
    htmlEl.setAttribute("data-theme", clean);
    themeToggleIcon.textContent = clean === "dark" ? "☀️" : "🌙";
    try {
      localStorage.setItem(UI_THEME_KEY, clean);
    } catch (_) {}
  }

  function initUiTheme() {
    let saved = "light";
    try {
      saved = localStorage.getItem(UI_THEME_KEY) || "light";
    } catch (_) {}
    applyUiTheme(saved);
  }

  /* ------------------------------------------------------------------------
     Navigation & View Management
     ------------------------------------------------------------------------ */
  function switchView(viewName) {
    activeView = viewName;
    document.querySelectorAll(".nav-item").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === viewName);
    });
    document.querySelectorAll(".view-section").forEach((sec) => {
      sec.classList.toggle("active", sec.id === `view-${viewName}`);
    });

    if (viewName === "charts") {
      renderCanvas();
    } else if (viewName === "gdd") {
      renderGddEditor();
    } else if (viewName === "onepage") {
      renderOnePageSummary();
    } else if (viewName === "checklist") {
      renderChecklist();
    }
  }

  function switchChart(chartKey) {
    activeChart = chartKey;
    document.querySelectorAll(".chart-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.chart === chartKey);
    });
    renderChartEditor();
    renderCanvas();
  }

  /* ------------------------------------------------------------------------
     Canvas Rendering & PNG Export
     ------------------------------------------------------------------------ */
  function renderCanvas() {
    chartThemeSelect.value = state.chartTheme || "notion-light";
    transparentBgToggle.checked = Boolean(state.transparentBg);
    canvasStage.classList.toggle("transparent-checker", Boolean(state.transparentBg));
    canvasModeHint.textContent = state.transparentBg
      ? "Mod: Şeffaf Arka Plan (Sunuma yapıştırmaya hazır)"
      : `Mod: ${CHART_THEMES[state.chartTheme]?.name || "Temalı"} Arka Plan`;

    PitchCharts.renderChartToCanvas(pitchCanvas, state, activeChart);
  }

  function downloadPNG(forceTransparent) {
    const offscreen = document.createElement("canvas");
    offscreen.width = 1600;
    offscreen.height = 900;
    PitchCharts.renderChartToCanvas(offscreen, state, activeChart, forceTransparent);

    offscreen.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const modeTag = forceTransparent ? "seffaf" : state.chartTheme;
      a.href = url;
      a.download = `${slugify(state.projectTitle)}-${activeChart}-${modeTag}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast(forceTransparent ? "Şeffaf PNG (1600×900) indirildi!" : "Temalı PNG (1600×900) indirildi!");
    }, "image/png");
  }

  /* ------------------------------------------------------------------------
     Dynamic Chart Data Editors
     ------------------------------------------------------------------------ */
  const CHART_LABELS = {
    coreLoop: "🔄 Core Loop Verileri",
    gameLoopFlow: "🔀 Detaylı Game Loop (Dallanan Akış)",
    roadmap: "🗺️ Yol Haritası (Roadmap)",
    matrix: "🎯 2x2 Rakip Matrisi",
    coreAnalysis: "🧅 Rakip Çekirdek & Katman Analizi",
    radar: "🕸️ Oyuncu / Özellik Radarı",
    budget: "💰 Bütçe & Başa Baş Analizi",
    moscow: "📦 MoSCoW Kapsam Matrisi"
  };

  function renderChartEditor() {
    editorPanelTitle.textContent = CHART_LABELS[activeChart] || "Grafik Verileri";
    const data = state.charts[activeChart];
    if (!data) return;

    let html = `
      <div class="field-group">
        <label class="field-label">Grafik Başlığı</label>
        <input class="input" data-chart-field="title" value="${escapeHtml(data.title)}" />
      </div>
      <div class="field-group">
        <label class="field-label">Alt Başlık / Açıklama</label>
        <input class="input" data-chart-field="subtitle" value="${escapeHtml(data.subtitle)}" />
      </div>
    `;

    if (activeChart === "coreLoop") {
      html += `
        <div class="field-row">
          <div class="field-group">
            <label class="field-label">Merkez Rozet Başlığı</label>
            <input class="input" data-chart-field="centerTitle" value="${escapeHtml(data.centerTitle)}" />
          </div>
          <div class="field-group">
            <label class="field-label">Merkez Alt Bilgi</label>
            <input class="input" data-chart-field="centerSub" value="${escapeHtml(data.centerSub)}" />
          </div>
        </div>
        <div class="editor-section-title">Döngü Adımları (${data.nodes.length}/8)</div>
      `;

      data.nodes.forEach((node, idx) => {
        html += `
          <div class="item-card">
            <div class="item-card-head">
              <span>Adım ${idx + 1}</span>
              ${
                data.nodes.length > 3
                  ? `<button class="btn btn-danger-ghost" data-remove-item="nodes" data-index="${idx}">Sil</button>`
                  : ""
              }
            </div>
            <div class="field-row" style="grid-template-columns: 74px 1fr;">
              <input class="input" placeholder="İkon" data-arr="nodes" data-index="${idx}" data-prop="icon" value="${escapeHtml(node.icon)}" />
              <input class="input" placeholder="Adım Başlığı" data-arr="nodes" data-index="${idx}" data-prop="title" value="${escapeHtml(node.title)}" />
            </div>
            <input class="input" placeholder="Kısa açıklama..." data-arr="nodes" data-index="${idx}" data-prop="desc" value="${escapeHtml(node.desc)}" />
          </div>
        `;
      });

      if (data.nodes.length < 8) {
        html += `<button class="btn btn-secondary btn-sm" id="addChartItemBtn">+ Yeni Döngü Adımı Ekle</button>`;
      }
    } else if (activeChart === "gameLoopFlow") {
      html += `
        <button class="btn btn-secondary btn-sm" id="loadClassicGameLoopBtn">
          🎲 Klasik Diyagramı Yükle (Player Turn / Roll Dice)
        </button>
        <label class="switch-label">
          <input type="checkbox" data-chart-field="classicWireframe" ${data.classicWireframe !== false ? "checked" : ""} />
          <span class="switch-slider"></span>
          <span>Klasik Gri Akış Diyagramı Stili</span>
        </label>
        <div class="field-row">
          <div class="field-group">
            <label class="field-label">Döngü Sonu Kutusu (Sağ)</label>
            <input class="input" data-chart-field="endLabel" value="${escapeHtml(data.endLabel || "Next player")}" />
          </div>
          <div class="field-group">
            <label class="field-label">Alt Sonuç Kutusu (Opsiyonel)</label>
            <input class="input" data-chart-field="resultLabel" value="${escapeHtml(data.resultLabel || "")}" />
          </div>
        </div>
        <div class="field-group">
          <label class="field-label">Sağ Alt İmza / Etiket</label>
          <input class="input" data-chart-field="footerTag" value="${escapeHtml(data.footerTag || "")}" />
        </div>
        <div class="editor-section-title">Ana Akış Adımları (${(data.steps || []).length}/5)</div>
      `;

      (data.steps || []).forEach((st, idx) => {
        html += `
          <div class="item-card">
            <div class="item-card-head">
              <span>Adım ${idx + 1}</span>
              ${
                data.steps.length > 1
                  ? `<button class="btn btn-danger-ghost" data-remove-item="steps" data-index="${idx}">Sil</button>`
                  : ""
              }
            </div>
            <input class="input" placeholder="Adım Başlığı" data-arr="steps" data-index="${idx}" data-prop="title" value="${escapeHtml(st.title)}" />
            <div class="field-group">
              <label class="field-label">Alt Seçenekler / Eylemler (Her satıra 1 madde, en fazla 4)</label>
              <textarea class="textarea" style="min-height: 58px;" placeholder="Örn:\nTrade\nAuction\nDeposit etc." data-arr="steps" data-index="${idx}" data-prop="subItemsText">${escapeHtml((st.subItems || []).join("\n"))}</textarea>
            </div>
          </div>
        `;
      });

      if ((data.steps || []).length < 5) {
        html += `<button class="btn btn-secondary btn-sm" id="addStepBtn">+ Yeni Ana Adım Ekle</button>`;
      }

      html += `<div class="editor-section-title">Koşul & Eylem Dallanmaları (${(data.branches || []).length}/4)</div>`;
      (data.branches || []).forEach((br, idx) => {
        html += `
          <div class="item-card">
            <div class="item-card-head">
              <span>Dal ${idx + 1}</span>
              ${
                data.branches.length > 0
                  ? `<button class="btn btn-danger-ghost" data-remove-item="branches" data-index="${idx}">Sil</button>`
                  : ""
              }
            </div>
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">Koşul / Durum</label>
                <input class="input" placeholder="Örn: Empty" data-arr="branches" data-index="${idx}" data-prop="condition" value="${escapeHtml(br.condition)}" />
              </div>
              <div class="field-group">
                <label class="field-label">Eylem / Sonuç</label>
                <input class="input" placeholder="Örn: Buy / Pass" data-arr="branches" data-index="${idx}" data-prop="action" value="${escapeHtml(br.action)}" />
              </div>
            </div>
          </div>
        `;
      });

      if ((data.branches || []).length < 4) {
        html += `<button class="btn btn-secondary btn-sm" id="addBranchBtn">+ Yeni Koşul Dalı Ekle</button>`;
      }
    } else if (activeChart === "roadmap") {
      html += `<div class="editor-section-title">Aşamalar / Kilometre Taşları (${data.phases.length}/6)</div>`;
      data.phases.forEach((ph, idx) => {
        html += `
          <div class="item-card">
            <div class="item-card-head">
              <span>Aşama ${idx + 1}</span>
              ${
                data.phases.length > 2
                  ? `<button class="btn btn-danger-ghost" data-remove-item="phases" data-index="${idx}">Sil</button>`
                  : ""
              }
            </div>
            <div class="field-row">
              <input class="input" placeholder="Aşama Adı" data-arr="phases" data-index="${idx}" data-prop="name" value="${escapeHtml(ph.name)}" />
              <input class="input" placeholder="Tarih (Q2 2027)" data-arr="phases" data-index="${idx}" data-prop="date" value="${escapeHtml(ph.date)}" />
            </div>
            <div class="field-row">
              <select class="select-compact" data-arr="phases" data-index="${idx}" data-prop="status">
                <option value="Tamamlandı" ${ph.status === "Tamamlandı" ? "selected" : ""}>Tamamlandı</option>
                <option value="Devam Ediyor" ${ph.status === "Devam Ediyor" ? "selected" : ""}>Devam Ediyor</option>
                <option value="Planlandı" ${ph.status === "Planlandı" ? "selected" : ""}>Planlandı</option>
              </select>
              <input type="number" min="0" max="100" class="input" placeholder="İlerleme %" data-arr="phases" data-index="${idx}" data-prop="progress" value="${Number(ph.progress || 0)}" />
            </div>
            <div class="field-group">
              <label class="field-label">Hedefler (Her satıra 1 madde)</label>
              <textarea class="textarea" style="min-height: 68px;" data-arr="phases" data-index="${idx}" data-prop="itemsText">${escapeHtml((ph.items || []).join("\n"))}</textarea>
            </div>
          </div>
        `;
      });

      if (data.phases.length < 6) {
        html += `<button class="btn btn-secondary btn-sm" id="addChartItemBtn">+ Yeni Aşama Ekle</button>`;
      }
    } else if (activeChart === "matrix") {
      html += `
        <div class="editor-section-title">Eksen Etiketleri</div>
        <div class="field-row">
          <div class="field-group">
            <label class="field-label">Üst Eksen (+Y)</label>
            <input class="input" data-chart-field="axisTop" value="${escapeHtml(data.axisTop)}" />
          </div>
          <div class="field-group">
            <label class="field-label">Alt Eksen (-Y)</label>
            <input class="input" data-chart-field="axisBottom" value="${escapeHtml(data.axisBottom)}" />
          </div>
        </div>
        <div class="field-row">
          <div class="field-group">
            <label class="field-label">Sol Eksen (-X)</label>
            <input class="input" data-chart-field="axisLeft" value="${escapeHtml(data.axisLeft)}" />
          </div>
          <div class="field-group">
            <label class="field-label">Sağ Eksen (+X)</label>
            <input class="input" data-chart-field="axisRight" value="${escapeHtml(data.axisRight)}" />
          </div>
        </div>
        <div class="field-group">
          <label class="field-label">Sağ Üst Hedef Alan Etiketi</label>
          <input class="input" data-chart-field="targetLabel" value="${escapeHtml(data.targetLabel)}" />
        </div>
        <div class="editor-section-title">Rakipler & Konumlar (0–100)</div>
      `;

      data.competitors.forEach((comp, idx) => {
        html += `
          <div class="item-card">
            <div class="item-card-head">
              <span>${comp.isOurs ? "★ Bizim Projemiz" : `Rakip ${idx + 1}`}</span>
              ${
                data.competitors.length > 2
                  ? `<button class="btn btn-danger-ghost" data-remove-item="competitors" data-index="${idx}">Sil</button>`
                  : ""
              }
            </div>
            <input class="input" placeholder="İsim" data-arr="competitors" data-index="${idx}" data-prop="name" value="${escapeHtml(comp.name)}" />
            <div class="field-row-3">
              <div class="field-group">
                <label class="field-label">X (0-100)</label>
                <input type="number" min="0" max="100" class="input" data-arr="competitors" data-index="${idx}" data-prop="x" value="${Number(comp.x)}" />
              </div>
              <div class="field-group">
                <label class="field-label">Y (0-100)</label>
                <input type="number" min="0" max="100" class="input" data-arr="competitors" data-index="${idx}" data-prop="y" value="${Number(comp.y)}" />
              </div>
              <div class="field-group" style="justify-content: flex-end;">
                <label class="switch-label" style="padding-bottom: 6px;">
                  <input type="checkbox" data-arr="competitors" data-index="${idx}" data-prop="isOurs" ${comp.isOurs ? "checked" : ""} />
                  <span class="switch-slider"></span>
                  <span>Biz</span>
                </label>
              </div>
            </div>
          </div>
        `;
      });

      if (data.competitors.length < 8) {
        html += `<button class="btn btn-secondary btn-sm" id="addChartItemBtn">+ Rakip / Proje Ekle</button>`;
      }
    } else if (activeChart === "coreAnalysis") {
      const labels = data.layerLabels || {};
      html += `
        <label class="switch-label">
          <input type="checkbox" data-chart-field="useClassicColors" ${data.useClassicColors !== false ? "checked" : ""} />
          <span class="switch-slider"></span>
          <span>Klasik Diyagram Renkleri (Mavi / Turuncu / Sarı / Mor)</span>
        </label>
        <div class="editor-section-title">Katman İsimleri (Dıştan İçe)</div>
        <div class="field-row">
          <div class="field-group">
            <label class="field-label">En Dış Katman</label>
            <input class="input" data-layer-label="progression" value="${escapeHtml(labels.progression || "PROGRESSION")}" />
          </div>
          <div class="field-group">
            <label class="field-label">3. Katman</label>
            <input class="input" data-layer-label="collectibles" value="${escapeHtml(labels.collectibles || "COLLECTIBLES")}" />
          </div>
        </div>
        <div class="field-row">
          <div class="field-group">
            <label class="field-label">2. Katman</label>
            <input class="input" data-layer-label="side" value="${escapeHtml(labels.side || "SIDE MECHANICS")}" />
          </div>
          <div class="field-group">
            <label class="field-label">Çekirdek (İç)</label>
            <input class="input" data-layer-label="core" value="${escapeHtml(labels.core || "CORE MECHANIC")}" />
          </div>
        </div>
        <div class="field-group">
          <label class="field-label">Alt Rehber Sorular Notu</label>
          <textarea class="textarea" style="min-height: 60px;" data-chart-field="footerNote">${escapeHtml(data.footerNote || "")}</textarea>
        </div>
        <div class="editor-section-title">Karşılaştırılan Oyunlar / Projeler (3 Sütun)</div>
      `;

      (data.games || []).forEach((g, idx) => {
        html += `
          <div class="item-card">
            <div class="item-card-head">
              <span>${g.isOurs ? "★ Bizim Oyun / Proje" : `Rakip ${idx}`}</span>
              <label class="switch-label">
                <input type="checkbox" data-arr="games" data-index="${idx}" data-prop="isOurs" ${g.isOurs ? "checked" : ""} />
                <span class="switch-slider"></span>
                <span>Biz</span>
              </label>
            </div>
            <input class="input" placeholder="Oyun / Proje Adı" data-arr="games" data-index="${idx}" data-prop="name" value="${escapeHtml(g.name)}" />
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">Core Mechanic (İç)</label>
                <input class="input" data-arr="games" data-index="${idx}" data-prop="core" value="${escapeHtml(g.core)}" />
              </div>
              <div class="field-group">
                <label class="field-label">Side Mechanics (2.)</label>
                <input class="input" data-arr="games" data-index="${idx}" data-prop="side" value="${escapeHtml(g.side)}" />
              </div>
            </div>
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">Collectibles (3.)</label>
                <input class="input" data-arr="games" data-index="${idx}" data-prop="collectibles" value="${escapeHtml(g.collectibles)}" />
              </div>
              <div class="field-group">
                <label class="field-label">Progression (Dış)</label>
                <input class="input" data-arr="games" data-index="${idx}" data-prop="progression" value="${escapeHtml(g.progression)}" />
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Hedef Kitle & Oyuncu Tipi</label>
              <input class="input" data-arr="games" data-index="${idx}" data-prop="audience" value="${escapeHtml(g.audience)}" />
            </div>
            <div class="field-group">
              <label class="field-label">Neden Oynuyorlar? (Destek İlişkisi)</label>
              <textarea class="textarea" style="min-height: 54px;" data-arr="games" data-index="${idx}" data-prop="whyPlay">${escapeHtml(g.whyPlay)}</textarea>
            </div>
          </div>
        `;
      });
    } else if (activeChart === "radar") {
      html += `
        <div class="field-row">
          <div class="field-group">
            <label class="field-label">Ana Seri Etiketi</label>
            <input class="input" data-chart-field="primaryLabel" value="${escapeHtml(data.primaryLabel)}" />
          </div>
          <div class="field-group">
            <label class="field-label">Kıyas (Benchmark) Etiketi</label>
            <input class="input" data-chart-field="benchmarkLabel" value="${escapeHtml(data.benchmarkLabel)}" />
          </div>
        </div>
        <label class="switch-label">
          <input type="checkbox" data-chart-field="showBenchmark" ${data.showBenchmark ? "checked" : ""} />
          <span class="switch-slider"></span>
          <span>Tür Ortalaması / Kıyas Alanını Göster</span>
        </label>
        <div class="field-group">
          <label class="field-label">Sağ Panel Özet Notu</label>
          <textarea class="textarea" style="min-height: 64px;" data-chart-field="insightText">${escapeHtml(data.insightText)}</textarea>
        </div>
        <div class="editor-section-title">Radar Eksenleri (${data.axes.length}/8)</div>
      `;

      data.axes.forEach((ax, idx) => {
        html += `
          <div class="item-card">
            <div class="item-card-head">
              <span>Eksen ${idx + 1}</span>
              ${
                data.axes.length > 3
                  ? `<button class="btn btn-danger-ghost" data-remove-item="axes" data-index="${idx}">Sil</button>`
                  : ""
              }
            </div>
            <input class="input" placeholder="Eksen Adı" data-arr="axes" data-index="${idx}" data-prop="label" value="${escapeHtml(ax.label)}" />
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">Bizim Puan (0-100)</label>
                <input type="number" min="0" max="100" class="input" data-arr="axes" data-index="${idx}" data-prop="value" value="${Number(ax.value)}" />
              </div>
              <div class="field-group">
                <label class="field-label">Ortalama (0-100)</label>
                <input type="number" min="0" max="100" class="input" data-arr="axes" data-index="${idx}" data-prop="benchmark" value="${Number(ax.benchmark)}" />
              </div>
            </div>
          </div>
        `;
      });

      if (data.axes.length < 8) {
        html += `<button class="btn btn-secondary btn-sm" id="addChartItemBtn">+ Yeni Eksen Ekle</button>`;
      }
    } else if (activeChart === "budget") {
      const total = (data.slices || []).reduce((a, s) => a + Math.max(0, Number(s.amount || 0)), 0);
      const netUnit = Math.max(0, Number(data.unitPrice || 0)) * (1 - Math.max(0, Math.min(99, Number(data.platformFeePct || 0))) / 100);
      const beUnits = netUnit > 0 ? Math.ceil(total / netUnit) : 0;

      html += `
        <div class="kpi-inline-preview">
          <div class="kpi-mini">
            <span>Toplam Bütçe</span>
            <strong id="budgetKpiTotal">${escapeHtml(data.currency || "$")}${Math.round(total).toLocaleString("tr-TR")}</strong>
          </div>
          <div class="kpi-mini">
            <span>Başa Baş Hedefi</span>
            <strong id="budgetKpiUnits">${beUnits > 0 ? beUnits.toLocaleString("tr-TR") + " Adet" : "—"}</strong>
          </div>
        </div>
        <div class="field-row-3">
          <div class="field-group">
            <label class="field-label">Para Birimi</label>
            <select class="select-compact" data-chart-field="currency">
              <option value="$" ${data.currency === "$" ? "selected" : ""}>$ (USD)</option>
              <option value="₺" ${data.currency === "₺" ? "selected" : ""}>₺ (TRY)</option>
              <option value="€" ${data.currency === "€" ? "selected" : ""}>€ (EUR)</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Satış Fiyatı</label>
            <input type="number" step="0.5" min="0" class="input" data-chart-field="unitPrice" value="${Number(data.unitPrice)}" />
          </div>
          <div class="field-group">
            <label class="field-label">Mağaza/Vergi %</label>
            <input type="number" min="0" max="90" class="input" data-chart-field="platformFeePct" value="${Number(data.platformFeePct)}" />
          </div>
        </div>
        <div class="editor-section-title">Bütçe Kalemleri (${data.slices.length}/7)</div>
      `;

      data.slices.forEach((sl, idx) => {
        html += `
          <div class="item-card">
            <div class="item-card-head">
              <span>Kalem ${idx + 1}</span>
              ${
                data.slices.length > 2
                  ? `<button class="btn btn-danger-ghost" data-remove-item="slices" data-index="${idx}">Sil</button>`
                  : ""
              }
            </div>
            <div class="field-row" style="grid-template-columns: 1.4fr 1fr;">
              <input class="input" placeholder="Bütçe Kalemi" data-arr="slices" data-index="${idx}" data-prop="label" value="${escapeHtml(sl.label)}" />
              <input type="number" min="0" step="500" class="input" placeholder="Tutar" data-arr="slices" data-index="${idx}" data-prop="amount" value="${Number(sl.amount)}" />
            </div>
          </div>
        `;
      });

      if (data.slices.length < 7) {
        html += `<button class="btn btn-secondary btn-sm" id="addChartItemBtn">+ Bütçe Kalemi Ekle</button>`;
      }
    } else if (activeChart === "moscow") {
      const mFields = [
        { key: "must", label: "M — Must Have (Olmazsa Olmaz — her satıra 1 madde)" },
        { key: "should", label: "S — Should Have (Olması Önemli — her satıra 1 madde)" },
        { key: "could", label: "C — Could Have (Zaman Kalırsa — her satıra 1 madde)" },
        { key: "wont", label: "W — Won't Have (İlk Sürümde Yok — her satıra 1 madde)" }
      ];
      mFields.forEach((mf) => {
        html += `
          <div class="field-group">
            <label class="field-label">${mf.label}</label>
            <textarea class="textarea" data-moscow-key="${mf.key}">${escapeHtml((data[mf.key] || []).join("\n"))}</textarea>
          </div>
        `;
      });
    }

    chartEditorContainer.innerHTML = html;
    bindChartEditorEvents();
  }

  function bindChartEditorEvents() {
    const data = state.charts[activeChart];

    // Scalar fields
    chartEditorContainer.querySelectorAll("[data-chart-field]").forEach((el) => {
      const ev = el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(ev, () => {
        const key = el.dataset.chartField;
        if (el.type === "checkbox") {
          data[key] = el.checked;
        } else if (el.type === "number") {
          data[key] = Number(el.value || 0);
        } else {
          data[key] = el.value;
        }
        if (activeChart === "budget") updateBudgetInlineKpi();
        saveState();
        renderCanvas();
      });
    });

    // CoreAnalysis layer labels
    chartEditorContainer.querySelectorAll("[data-layer-label]").forEach((el) => {
      el.addEventListener("input", () => {
        if (!data.layerLabels) data.layerLabels = {};
        data.layerLabels[el.dataset.layerLabel] = el.value;
        saveState();
        renderCanvas();
      });
    });

    // Array item properties
    chartEditorContainer.querySelectorAll("[data-arr]").forEach((el) => {
      const ev = el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(ev, () => {
        const arrKey = el.dataset.arr;
        const idx = Number(el.dataset.index);
        const prop = el.dataset.prop;
        const item = data[arrKey][idx];
        if (!item) return;

        if (prop === "itemsText") {
          item.items = el.value
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
        } else if (prop === "subItemsText") {
          item.subItems = el.value
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
            .slice(0, 4);
        } else if (el.type === "checkbox") {
          item[prop] = el.checked;
        } else if (el.type === "number") {
          item[prop] = Number(el.value || 0);
        } else {
          item[prop] = el.value;
        }

        if (activeChart === "budget") updateBudgetInlineKpi();
        saveState();
        renderCanvas();
      });
    });

    // MoSCoW textareas
    chartEditorContainer.querySelectorAll("[data-moscow-key]").forEach((el) => {
      el.addEventListener("input", () => {
        const key = el.dataset.moscowKey;
        data[key] = el.value
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        saveState();
        renderCanvas();
      });
    });

    // Remove array item
    chartEditorContainer.querySelectorAll("[data-remove-item]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const arrKey = btn.dataset.removeItem;
        const idx = Number(btn.dataset.index);
        data[arrKey].splice(idx, 1);
        saveState();
        renderChartEditor();
        renderCanvas();
      });
    });

    // Add array item
    const addBtn = document.getElementById("addChartItemBtn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        if (activeChart === "coreLoop") {
          data.nodes.push({ icon: "⭐", title: "Yeni Adım", desc: "Oyuncunun yaptığı yeni eylem" });
        } else if (activeChart === "roadmap") {
          data.phases.push({
            name: "Yeni Faz",
            date: "Q1 2028",
            status: "Planlandı",
            progress: 0,
            items: ["Kilometre taşı hedefi 1", "Kilometre taşı hedefi 2"]
          });
        } else if (activeChart === "matrix") {
          data.competitors.push({ name: "Yeni Rakip", x: 50, y: 50, isOurs: false });
        } else if (activeChart === "radar") {
          data.axes.push({ label: "Yeni Özellik", value: 75, benchmark: 60 });
        } else if (activeChart === "budget") {
          data.slices.push({ label: "Yeni Kalem", amount: 5000 });
        }
        saveState();
        renderChartEditor();
        renderCanvas();
      });
    }

    // GameLoopFlow custom buttons
    const loadClassicBtn = document.getElementById("loadClassicGameLoopBtn");
    if (loadClassicBtn) {
      loadClassicBtn.addEventListener("click", () => {
        state.charts.gameLoopFlow = JSON.parse(JSON.stringify(CLASSIC_GAME_LOOP_TEMPLATE));
        saveState();
        renderChartEditor();
        renderCanvas();
        showToast("Klasik Game Loop şablonu yüklendi!");
      });
    }

    const addStepBtn = document.getElementById("addStepBtn");
    if (addStepBtn) {
      addStepBtn.addEventListener("click", () => {
        data.steps.push({ title: "Yeni Adım", subItems: [] });
        saveState();
        renderChartEditor();
        renderCanvas();
      });
    }

    const addBranchBtn = document.getElementById("addBranchBtn");
    if (addBranchBtn) {
      addBranchBtn.addEventListener("click", () => {
        data.branches.push({ condition: "Yeni Koşul", action: "Yeni Eylem" });
        saveState();
        renderChartEditor();
        renderCanvas();
      });
    }
  }

  function updateBudgetInlineKpi() {
    const data = state.charts.budget;
    const totalEl = document.getElementById("budgetKpiTotal");
    const unitsEl = document.getElementById("budgetKpiUnits");
    if (!totalEl || !unitsEl) return;

    const total = (data.slices || []).reduce((a, s) => a + Math.max(0, Number(s.amount || 0)), 0);
    const netUnit = Math.max(0, Number(data.unitPrice || 0)) * (1 - Math.max(0, Math.min(99, Number(data.platformFeePct || 0))) / 100);
    const beUnits = netUnit > 0 ? Math.ceil(total / netUnit) : 0;

    totalEl.textContent = `${data.currency || "$"}${Math.round(total).toLocaleString("tr-TR")}`;
    unitsEl.textContent = beUnits > 0 ? `${beUnits.toLocaleString("tr-TR")} Adet` : "—";
  }

  /* ------------------------------------------------------------------------
     Guided GDD Editor
     ------------------------------------------------------------------------ */
  function isSectionCompleted(secId) {
    const txt = (state.gdd.sections[secId] || "").trim();
    if (secId === "overview") {
      return txt.length > 20 || (state.gdd.meta.elevatorPitch || "").trim().length > 20;
    }
    return txt.length > 20;
  }

  function renderGddEditor() {
    genreTemplateSelect.value = state.gdd.genreKey || "roguelike";

    // Render TOC
    gddTocList.innerHTML = GDD_SECTIONS_META.map((sec) => {
      const done = isSectionCompleted(sec.id);
      return `
        <a href="#gdd-sec-${sec.id}" class="toc-link">
          <span>${escapeHtml(sec.title)}</span>
          <span class="toc-status ${done ? "done" : ""}" title="${done ? "Dolduruldu" : "Henüz kısa"}"></span>
        </a>
      `;
    }).join("");

    // Render Section Cards
    gddSectionsContainer.innerHTML = GDD_SECTIONS_META.map((sec) => {
      const val = state.gdd.sections[sec.id] || "";
      const meta = state.gdd.meta;

      const structuredHtml = sec.hasStructuredMeta
        ? `
          <div class="gdd-structured-grid">
            <div class="field-group">
              <label class="field-label">Tür (Genre)</label>
              <input class="input" data-gdd-meta="genre" value="${escapeHtml(meta.genre)}" placeholder="Örn: Aksiyon Roguelike" />
            </div>
            <div class="field-group">
              <label class="field-label">Hedef Platformlar</label>
              <input class="input" data-gdd-meta="platform" value="${escapeHtml(meta.platform)}" placeholder="Örn: PC (Steam), Switch" />
            </div>
            <div class="field-group">
              <label class="field-label">Hedef Kitle</label>
              <input class="input" data-gdd-meta="targetAudience" value="${escapeHtml(meta.targetAudience)}" placeholder="Örn: Hades & Dead Cells oyuncuları" />
            </div>
            <div class="field-group">
              <label class="field-label">Benzersiz Fark (USP)</label>
              <input class="input" data-gdd-meta="usp" value="${escapeHtml(meta.usp)}" placeholder="Örn: Zamanı bükme kombosu" />
            </div>
          </div>
          <div class="field-group" style="margin-bottom: 12px;">
            <label class="field-label">Asansör Konuşması (Elevator Pitch — 2-3 Cümle)</label>
            <textarea class="textarea" style="min-height: 70px;" data-gdd-meta="elevatorPitch" placeholder="Projenizi 20 saniyede özetleyin...">${escapeHtml(meta.elevatorPitch)}</textarea>
          </div>
        `
        : "";

      return `
        <article class="card gdd-section-card" id="gdd-sec-${sec.id}">
          <div class="gdd-section-head">
            <div>
              <h3>${escapeHtml(sec.title)}</h3>
              <p>${escapeHtml(sec.subtitle)}</p>
            </div>
            <button class="btn btn-secondary btn-sm" data-insert-snippet="${sec.id}">
              ✨ Şablon Cümlesi Ekle
            </button>
          </div>

          <div class="gdd-coach-grid">
            <div class="coach-box">
              <div class="coach-box-title">💡 Buraya Ne Yazmalıyım?</div>
              <ul>
                ${sec.guide.map((g) => `<li>${escapeHtml(g)}</li>`).join("")}
              </ul>
            </div>
            <div class="coach-box">
              <div class="coach-box-title">🎮 Gerçek Oyun Örnekleri</div>
              ${sec.examples
                .map(
                  (ex) => `
                <span class="example-pill"><strong>${escapeHtml(ex.game)}:</strong> ${escapeHtml(ex.text)}</span>
              `
                )
                .join("")}
            </div>
          </div>

          ${structuredHtml}

          <div class="field-group">
            <label class="field-label">Bölüm Notları & Tasarım Detayları</label>
            <textarea class="textarea" style="min-height: 118px;" data-gdd-section="${sec.id}" placeholder="Buraya yazın veya yukarıdan 'Şablon Cümlesi Ekle' butonunu kullanın...">${escapeHtml(val)}</textarea>
          </div>
        </article>
      `;
    }).join("");

    // Bind GDD meta inputs
    gddSectionsContainer.querySelectorAll("[data-gdd-meta]").forEach((el) => {
      el.addEventListener("input", () => {
        state.gdd.meta[el.dataset.gddMeta] = el.value;
        saveState();
        updateGddTocDots();
      });
    });

    // Bind GDD section textareas
    gddSectionsContainer.querySelectorAll("[data-gdd-section]").forEach((el) => {
      el.addEventListener("input", () => {
        state.gdd.sections[el.dataset.gddSection] = el.value;
        saveState();
        updateGddTocDots();
      });
    });

    // Bind Insert Snippet buttons
    gddSectionsContainer.querySelectorAll("[data-insert-snippet]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const secId = btn.dataset.insertSnippet;
        const metaSec = GDD_SECTIONS_META.find((s) => s.id === secId);
        if (!metaSec) return;
        const current = (state.gdd.sections[secId] || "").trim();
        const nextVal = current ? `${current}\n\n${metaSec.templateSnippet}` : metaSec.templateSnippet;
        state.gdd.sections[secId] = nextVal;
        const textarea = gddSectionsContainer.querySelector(`[data-gdd-section="${secId}"]`);
        if (textarea) textarea.value = nextVal;
        saveState();
        updateGddTocDots();
        showToast("Rehber şablon cümlesi eklendi! Köşeli parantezleri doldurabilirsiniz.");
      });
    });
  }

  function updateGddTocDots() {
    const links = gddTocList.querySelectorAll(".toc-status");
    GDD_SECTIONS_META.forEach((sec, idx) => {
      if (links[idx]) {
        links[idx].classList.toggle("done", isSectionCompleted(sec.id));
      }
    });
  }

  function applyGenreTemplate() {
    const key = genreTemplateSelect.value;
    const tpl = GENRE_TEMPLATES[key];
    if (!tpl) return;

    state.gdd.genreKey = key;
    state.gdd.meta.genre = tpl.genre;
    state.gdd.meta.platform = tpl.platform;
    state.gdd.meta.targetAudience = tpl.targetAudience;
    state.gdd.meta.elevatorPitch = tpl.elevatorPitch;
    state.gdd.meta.usp = tpl.usp;
    state.gdd.sections.pillars = tpl.pillars.map((p, i) => `Sütun ${i + 1} — ${p}`).join("\n");

    saveState();
    renderGddEditor();
    showToast(`"${tpl.label}" GDD rehber şablonu uygulandı!`);
  }

  /* ------------------------------------------------------------------------
     One-Page GDD Executive Summary
     ------------------------------------------------------------------------ */
  function renderOnePageSummary() {
    const meta = state.gdd.meta || {};
    const secs = state.gdd.sections || {};
    const loopNodes = state.charts.coreLoop?.nodes || [];
    const phases = state.charts.roadmap?.phases || [];
    const moscow = state.charts.moscow || {};
    const budget = state.charts.budget || {};

    const totalBudget = (budget.slices || []).reduce((a, s) => a + Math.max(0, Number(s.amount || 0)), 0);
    const cur = budget.currency || "$";
    const netUnit = Math.max(0, Number(budget.unitPrice || 0)) * (1 - Math.max(0, Math.min(99, Number(budget.platformFeePct || 0))) / 100);
    const beUnits = netUnit > 0 ? Math.ceil(totalBudget / netUnit) : 0;

    onePageSheet.innerHTML = `
      <div class="op-header">
        <div>
          <h2 class="op-title">${escapeHtml(state.projectTitle)} — One-Page Tasarım Özeti</h2>
          <div class="op-meta-pills">
            <span class="op-pill">🎮 Tür: ${escapeHtml(meta.genre || "Belirtilmedi")}</span>
            <span class="op-pill">🖥️ Platform: ${escapeHtml(meta.platform || "Belirtilmedi")}</span>
            <span class="op-pill">🎯 Kitle: ${escapeHtml(meta.targetAudience || "Belirtilmedi")}</span>
          </div>
        </div>
        <div class="op-meta-pills">
          <span class="op-pill">💰 Bütçe: ${escapeHtml(cur)}${Math.round(totalBudget).toLocaleString("tr-TR")}</span>
          <span class="op-pill">📈 Başa Baş: ${beUnits > 0 ? beUnits.toLocaleString("tr-TR") + " Adet" : "—"}</span>
        </div>
      </div>

      <div class="op-pitch-box">
        <strong>Asansör Konuşması (Elevator Pitch):</strong><br />
        ${escapeHtml(meta.elevatorPitch || "Henüz girilmedi.")}
        ${meta.usp ? `<br /><br /><strong>Benzersiz Fark (USP):</strong> ${escapeHtml(meta.usp)}` : ""}
      </div>

      <div class="op-grid-2">
        <div class="op-block">
          <h4>🏛️ Tasarım Sütunları (Design Pillars)</h4>
          <p>${escapeHtml(secs.pillars || "Belirtilmedi.")}</p>
        </div>
        <div class="op-block">
          <h4>⚙️ Temel Mekanikler & Hissiyat</h4>
          <p>${escapeHtml(secs.mechanics || "Belirtilmedi.")}</p>
        </div>
      </div>

      <div class="op-block" style="margin-bottom: 16px;">
        <h4>🔄 Core Loop (Temel Oynanış Döngüsü)</h4>
        <div class="op-loop-strip">
          ${loopNodes
            .map(
              (n, i) => `
              <span class="op-loop-node">${escapeHtml(n.icon || "")} ${i + 1}. ${escapeHtml(n.title)}</span>
              ${i < loopNodes.length - 1 ? `<span class="op-loop-arrow">→</span>` : `<span class="op-loop-arrow">↻</span>`}
            `
            )
            .join("")}
        </div>
      </div>

      <div class="op-grid-2">
        <div class="op-block">
          <h4>🗺️ Yol Haritası & Kilometre Taşları</h4>
          <ul>
            ${phases
              .map(
                (p) => `<li><strong>${escapeHtml(p.date)} — ${escapeHtml(p.name)}</strong> (${escapeHtml(p.status)}): ${escapeHtml((p.items || []).slice(0, 2).join(", "))}</li>`
              )
              .join("")}
          </ul>
        </div>
        <div class="op-block">
          <h4>📦 Kapsam Özeti (Must vs. Won't)</h4>
          <p><strong>Olmazsa Olmaz (1.0):</strong></p>
          <ul>
            ${(moscow.must || []).slice(0, 4).map((m) => `<li>${escapeHtml(m)}</li>`).join("")}
          </ul>
          <p style="margin-top: 8px;"><strong>İlk Sürümde Yok (Scope Control):</strong></p>
          <ul>
            ${(moscow.wont || []).slice(0, 3).map((w) => `<li>${escapeHtml(w)}</li>`).join("")}
          </ul>
        </div>
      </div>

      <div class="op-grid-2">
        <div class="op-block">
          <h4>🎨 Dünya, Sanat & Ses</h4>
          <p>${escapeHtml([secs.world, secs.artAudio].filter(Boolean).join("\n\n") || "Belirtilmedi.")}</p>
        </div>
        <div class="op-block">
          <h4>💼 Teknik Mimari & Gelir Planı</h4>
          <p>${escapeHtml([secs.tech, secs.monetization].filter(Boolean).join("\n\n") || "Belirtilmedi.")}</p>
        </div>
      </div>
    `;
  }

  /* ------------------------------------------------------------------------
     Checklist View
     ------------------------------------------------------------------------ */
  function renderChecklist() {
    const checks = state.checklist || {};
    let total = 0;
    let done = 0;

    checklistContainer.innerHTML = CHECKLIST_CATEGORIES.map((cat) => {
      const catDone = cat.items.filter((it) => Boolean(checks[it.id])).length;
      total += cat.items.length;
      done += catDone;

      return `
        <div class="card checklist-cat-card">
          <div class="checklist-cat-head">
            <h3>${escapeHtml(cat.title)}</h3>
            <span class="badge badge-subtle">${catDone}/${cat.items.length}</span>
          </div>
          ${cat.items
            .map((it) => {
              const checked = Boolean(checks[it.id]);
              const actionLabel =
                it.linkType === "chart"
                  ? "Grafiği Düzenle →"
                  : it.linkType === "gdd"
                  ? "GDD Bölümüne Git →"
                  : "Özeti Aç →";
              return `
                <div class="check-item ${checked ? "checked" : ""}">
                  <input type="checkbox" id="${it.id}" data-check-id="${it.id}" ${checked ? "checked" : ""} />
                  <div class="check-item-body">
                    <label for="${it.id}" class="check-item-title">${escapeHtml(it.title)}</label>
                    <div class="check-item-why">${escapeHtml(it.why)}</div>
                    <button class="btn btn-secondary btn-sm check-action-btn" data-link-type="${it.linkType}" data-link-target="${it.linkTarget}">
                      ${actionLabel}
                    </button>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      `;
    }).join("");

    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    checklistScoreBadge.textContent = `Hazırlık Puanı: %${pct} (${done}/${total})`;

    // Bind checkboxes
    checklistContainer.querySelectorAll("[data-check-id]").forEach((cb) => {
      cb.addEventListener("change", () => {
        state.checklist[cb.dataset.checkId] = cb.checked;
        saveState();
        renderChecklist();
      });
    });

    // Bind deep links
    checklistContainer.querySelectorAll("[data-link-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.linkType;
        const target = btn.dataset.linkTarget;
        if (type === "chart") {
          switchView("charts");
          switchChart(target);
        } else if (type === "gdd") {
          switchView("gdd");
          setTimeout(() => {
            const el = document.getElementById(`gdd-sec-${target}`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 50);
        } else if (type === "view") {
          switchView(target);
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     Sidebar Progress Counters
     ------------------------------------------------------------------------ */
  function updateProgressIndicators() {
    const gddDone = GDD_SECTIONS_META.filter((s) => isSectionCompleted(s.id)).length;
    const gddTotal = GDD_SECTIONS_META.length;
    const gddPct = Math.round((gddDone / gddTotal) * 100);

    sidebarGddPct.textContent = `%${gddPct}`;
    sidebarGddLabel.textContent = `${gddDone}/${gddTotal}`;
    sidebarGddBar.style.width = `${gddPct}%`;

    const allCheckItems = CHECKLIST_CATEGORIES.flatMap((c) => c.items);
    const chkDone = allCheckItems.filter((it) => Boolean(state.checklist[it.id])).length;
    const chkTotal = allCheckItems.length;
    const chkPct = Math.round((chkDone / chkTotal) * 100);

    sidebarCheckPct.textContent = `%${chkPct}`;
    sidebarCheckLabel.textContent = `${chkDone}/${chkTotal}`;
    sidebarCheckBar.style.width = `${chkPct}%`;
  }

  /* ------------------------------------------------------------------------
     Markdown, JSON & PDF Export
     ------------------------------------------------------------------------ */
  function generateMarkdown() {
    const meta = state.gdd.meta || {};
    const secs = state.gdd.sections || {};
    const loop = state.charts.coreLoop || {};
    const roadmap = state.charts.roadmap || {};
    const moscow = state.charts.moscow || {};
    const budget = state.charts.budget || {};

    const totalBudget = (budget.slices || []).reduce((a, s) => a + Math.max(0, Number(s.amount || 0)), 0);
    const cur = budget.currency || "$";

    const lines = [
      `# ${state.projectTitle} — Tasarım & Sunum Dokümanı (GDD)`,
      ``,
      `- **Tür:** ${meta.genre || "-"}`,
      `- **Platform:** ${meta.platform || "-"}`,
      `- **Hedef Kitle:** ${meta.targetAudience || "-"}`,
      `- **Benzersiz Fark (USP):** ${meta.usp || "-"}`,
      ``,
      `> **Asansör Konuşması:** ${meta.elevatorPitch || "-"}`,
      ``,
      `---`,
      ``
    ];

    GDD_SECTIONS_META.forEach((s) => {
      lines.push(`## ${s.title}`);
      lines.push(secs[s.id] || "_Henüz doldurulmadı._");
      lines.push(``);
    });

    lines.push(`## 🔄 Core Loop (Temel Döngü)`);
    (loop.nodes || []).forEach((n, i) => {
      lines.push(`${i + 1}. **${n.icon || ""} ${n.title}**: ${n.desc}`);
    });
    lines.push(``);

    lines.push(`## 🗺️ Yol Haritası (Roadmap)`);
    (roadmap.phases || []).forEach((p) => {
      lines.push(`- **${p.date} — ${p.name}** (${p.status}, %${p.progress}): ${(p.items || []).join(", ")}`);
    });
    lines.push(``);

    lines.push(`## 📦 MoSCoW Kapsam Planı`);
    lines.push(`- **Must Have:** ${(moscow.must || []).join(" | ")}`);
    lines.push(`- **Should Have:** ${(moscow.should || []).join(" | ")}`);
    lines.push(`- **Could Have:** ${(moscow.could || []).join(" | ")}`);
    lines.push(`- **Won't Have:** ${(moscow.wont || []).join(" | ")}`);
    lines.push(``);

    lines.push(`## 💰 Bütçe Özeti (Toplam: ${cur}${Math.round(totalBudget).toLocaleString("tr-TR")})`);
    (budget.slices || []).forEach((sl) => {
      lines.push(`- ${sl.label}: ${cur}${Math.round(sl.amount || 0).toLocaleString("tr-TR")}`);
    });

    return lines.join("\n");
  }

  function downloadMarkdown() {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(state.projectTitle)}-GDD.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("Markdown (.md) dosyası indirildi!");
  }

  async function copyMarkdown() {
    const md = generateMarkdown();
    try {
      await navigator.clipboard.writeText(md);
      showToast("Markdown içeriği panoya kopyalandı!");
    } catch (_) {
      showToast("Kopyalama başarısız; .md İndir butonunu kullanabilirsiniz.");
    }
  }

  function exportJsonBackup() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(state.projectTitle)}-yedek.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("Proje yedeği (.json) indirildi!");
  }

  function handleJsonImport(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed.charts || !parsed.gdd) {
          showToast("Geçersiz proje dosyası!");
          return;
        }
        if (!parsed.charts.coreAnalysis) {
          parsed.charts.coreAnalysis = createDefaultState().charts.coreAnalysis;
        }
        if (!parsed.charts.gameLoopFlow) {
          parsed.charts.gameLoopFlow = createDefaultState().charts.gameLoopFlow;
        }
        state = parsed;
        projectTitleInput.value = state.projectTitle || "Projem";
        saveState();
        refreshAllViews();
        showToast("Proje yedeği başarıyla yüklendi!");
      } catch (_) {
        showToast("JSON dosyası okunamadı!");
      }
    };
    reader.readAsText(file);
  }

  function printPdfView() {
    renderOnePageSummary();
    window.print();
  }

  function refreshAllViews() {
    projectTitleInput.value = state.projectTitle || "Projem";
    renderChartEditor();
    renderCanvas();
    if (activeView === "gdd") renderGddEditor();
    if (activeView === "onepage") renderOnePageSummary();
    if (activeView === "checklist") renderChecklist();
    updateProgressIndicators();
  }

  /* ------------------------------------------------------------------------
     Event Bindings & Initialization
     ------------------------------------------------------------------------ */
  function init() {
    initUiTheme();
    projectTitleInput.value = state.projectTitle || "Projem";

    // Sidebar view switches
    document.querySelectorAll(".nav-item").forEach((btn) => {
      btn.addEventListener("click", () => switchView(btn.dataset.view));
    });

    // Chart tabs
    document.querySelectorAll(".chart-tab").forEach((tab) => {
      tab.addEventListener("click", () => switchChart(tab.dataset.chart));
    });

    // Project Title inline edit
    projectTitleInput.addEventListener("input", () => {
      state.projectTitle = projectTitleInput.value;
      saveState();
      renderCanvas();
    });

    // Preset Loader
    presetSelector.addEventListener("change", () => {
      const key = presetSelector.value;
      if (!key || !SAMPLE_PRESETS[key]) return;
      state = JSON.parse(JSON.stringify(SAMPLE_PRESETS[key]));
      presetSelector.value = "";
      saveState();
      refreshAllViews();
      showToast(`"${state.projectTitle}" örnek projesi yüklendi!`);
    });

    // UI Light/Dark Toggle
    themeToggleBtn.addEventListener("click", () => {
      const cur = htmlEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyUiTheme(cur);
    });

    // Canvas Theme & Transparency
    chartThemeSelect.addEventListener("change", () => {
      state.chartTheme = chartThemeSelect.value;
      saveState();
      renderCanvas();
    });

    transparentBgToggle.addEventListener("change", () => {
      state.transparentBg = transparentBgToggle.checked;
      saveState();
      renderCanvas();
    });

    // PNG Exports
    document.getElementById("downloadTransparentPngBtn").addEventListener("click", () => downloadPNG(true));
    document.getElementById("downloadThemedPngBtn").addEventListener("click", () => downloadPNG(false));

    // GDD Genre Template
    applyGenreTemplateBtn.addEventListener("click", applyGenreTemplate);

    // Header & One-Page Exports
    document.getElementById("exportJsonBtn").addEventListener("click", exportJsonBackup);
    document.getElementById("importJsonInput").addEventListener("change", (e) => {
      handleJsonImport(e.target.files[0]);
      e.target.value = "";
    });
    document.getElementById("exportMdHeaderBtn").addEventListener("click", downloadMarkdown);
    document.getElementById("printPdfHeaderBtn").addEventListener("click", printPdfView);

    document.getElementById("downloadMarkdownBtn").addEventListener("click", downloadMarkdown);
    document.getElementById("copyMarkdownBtn").addEventListener("click", copyMarkdown);
    document.getElementById("printOnePageBtn").addEventListener("click", printPdfView);

    refreshAllViews();
  }

  init();
})();
