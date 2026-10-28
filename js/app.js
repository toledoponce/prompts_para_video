/* Interfaz del asistente: pasos, formulario, vista previa, historial. */
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const DEFAULTS = {
    productName: "", offeringType: "producto", category: "otro", objective: "lanzamiento",
    description: "", productDetails: "", audience: "", onScreenText: "",
    targetModel: "generico", platform: "youtube", aspectRatio: "16:9", resolution: "1080p", duration: "8", fps: "24", shots: "1",
    refMode: "none", refs: [], refFidelity: "exacta",
    visualStyle: "comercial", lighting: "softbox", colorGrade: "natural", brandColors: "", background: "infinito_blanco", customBackground: "", mood: "inspirador",
    shotType: "hero", cameraAngle: "tresCuartos", cameraMovement: "dollyin", cameraSpeed: "lenta", lens: "auto", depthOfField: "baja",
    productAction: "rotacion", customAction: "", talent: "",
    audioType: "musica_sfx", musicGenre: "corporativa", sfx: "", voiceTone: "calida", voiceLanguage: "es", voiceText: "",
    negatives: ["texto", "watermark", "morph", "manos", "flicker"], customNegative: "", promptLanguage: "en", extraNotes: "",
  };

  const EXAMPLE = {
    ...DEFAULTS,
    productName: "Aura Glow", offeringType: "producto", category: "belleza", objective: "lanzamiento",
    description: "Presentar el nuevo sérum facial Aura Glow como un producto de lujo accesible que deja la piel luminosa e hidratada desde la primera aplicación.",
    productDetails: "Frasco de vidrio esmerilado rosa pálido con gotero dorado, etiqueta minimalista blanca con el logo Aura Glow, sérum dorado translúcido.",
    audience: "mujeres de 25 a 40 años interesadas en el cuidado de la piel",
    onScreenText: "Brilla natural",
    targetModel: "veo", platform: "vertical", aspectRatio: "9:16", duration: "8", shots: "3",
    refMode: "ingredients", refs: [{ role: "producto", desc: "foto del frasco sobre fondo blanco" }, { role: "estilo", desc: "moodboard en tonos rosa y dorado" }],
    visualStyle: "lujo", lighting: "rim", colorGrade: "pastel", background: "reflectante", mood: "elegante",
    shotType: "macro", cameraAngle: "tresCuartos", cameraMovement: "orbita", lens: "macro", productAction: "splash",
    audioType: "musica_sfx", musicGenre: "ambiental",
  };

  // Configuración declarativa de los pasos del asistente.
  const STEPS = [
    {
      id: "concepto", title: "Concepto", icon: "💡",
      intro: "Cuéntanos brevemente qué quieres lograr. Una idea clara es la base de un buen prompt.",
      fields: [
        { id: "productName", type: "text", label: "Nombre del producto o servicio", placeholder: "Ej.: Aura Glow, Café Andino, App FinFácil" },
        { id: "offeringType", type: "select", label: "¿Qué vas a promocionar?" },
        { id: "category", type: "select", label: "Categoría", help: "Usamos la categoría para sugerirte parámetros que suelen funcionar.", action: { id: "btnPreset", label: "✨ Aplicar recomendaciones de esta categoría" } },
        { id: "objective", type: "select", label: "Objetivo del video" },
        { id: "description", type: "textarea", label: "Descripción breve de lo que quieres lograr *", full: true, rows: 3,
          placeholder: "Ej.: Mostrar nuestra nueva botella térmica como la compañera ideal para el día: mantiene el café caliente 12 horas y luce elegante en la oficina.",
          help: "Qué se ve, qué sucede y qué debe sentir el espectador. 1-3 frases." },
        { id: "productDetails", type: "textarea", label: "Apariencia del producto", full: true, rows: 2,
          placeholder: "Ej.: botella de acero inoxidable negro mate, tapa de bambú, logo blanco grabado.",
          help: "Fundamental si no usarás fotos de referencia: forma, colores, materiales, empaque, logo." },
        { id: "audience", type: "text", label: "Público objetivo (opcional)", placeholder: "Ej.: profesionales jóvenes, deportistas, familias" },
        { id: "onScreenText", type: "text", label: "Texto o eslogan en pantalla (opcional)", placeholder: "Ej.: 2x1 hoy", help: "Máximo 2-4 palabras; los modelos fallan con textos largos." },
      ],
    },
    {
      id: "formato", title: "Modelo y formato", icon: "🎞️",
      intro: "Cada generador de video tiene su propio «idioma». Elige dónde usarás el prompt y el formato de salida.",
      fields: [
        { id: "targetModel", type: "select", label: "Generador de video (IA)", full: true },
        { id: "platform", type: "select", label: "Dónde se publicará", help: "Ajusta automáticamente la relación de aspecto." },
        { id: "aspectRatio", type: "select", label: "Relación de aspecto" },
        { id: "resolution", type: "select", label: "Resolución" },
        { id: "duration", type: "select", label: "Duración" },
        { id: "fps", type: "select", label: "Cuadros por segundo / velocidad" },
        { id: "shots", type: "select", label: "Estructura de tomas" },
      ],
    },
    {
      id: "referencias", title: "Fotos de referencia", icon: "🖼️",
      intro: "¿Usarás imágenes junto al prompt? Muchos modelos aceptan un frame inicial, un frame final o imágenes que guían la apariencia del producto, personaje o estilo.",
      fields: [
        { id: "refMode", type: "select", label: "¿Incluirás fotos de referencia?", full: true },
        { id: "refs", type: "refs", label: "Imágenes", full: true, showIf: (s) => s.refMode !== "none" },
        { id: "refFidelity", type: "select", label: "Fidelidad al producto de la referencia", full: true, showIf: (s) => s.refMode !== "none" },
      ],
    },
    {
      id: "estilo", title: "Estilo visual", icon: "🎨",
      intro: "Define el look: estilo, luz, color, fondo y emoción. La iluminación es lo que más eleva la calidad percibida.",
      fields: [
        { id: "visualStyle", type: "select", label: "Estilo visual" },
        { id: "mood", type: "select", label: "Atmósfera / emoción" },
        { id: "lighting", type: "select", label: "Iluminación" },
        { id: "colorGrade", type: "select", label: "Paleta / gradación de color" },
        { id: "brandColors", type: "text", label: "Colores de marca", placeholder: "Ej.: azul marino y dorado", showIf: (s) => s.colorGrade === "marca" },
        { id: "background", type: "select", label: "Fondo / escenario", full: true },
        { id: "customBackground", type: "text", label: "Describe el fondo", full: true, placeholder: "Ej.: terraza de café en Lima al atardecer con plantas colgantes", showIf: (s) => s.background === "custom" },
      ],
    },
    {
      id: "camara", title: "Cámara y acción", icon: "🎥",
      intro: "Encuadre, ángulo y movimiento de cámara convierten una imagen en una toma de cine. Indica también qué ocurre en escena.",
      fields: [
        { id: "shotType", type: "select", label: "Encuadre (tipo de plano)" },
        { id: "cameraAngle", type: "select", label: "Ángulo de cámara" },
        { id: "cameraMovement", type: "select", label: "Movimiento de cámara" },
        { id: "cameraSpeed", type: "select", label: "Velocidad del movimiento" },
        { id: "lens", type: "select", label: "Lente" },
        { id: "depthOfField", type: "select", label: "Profundidad de campo" },
        { id: "productAction", type: "select", label: "Acción principal del producto", full: true },
        { id: "customAction", type: "textarea", label: "Describe la acción", full: true, rows: 2, placeholder: "Ej.: la puerta del departamento se abre y la luz de la mañana inunda la sala", showIf: (s) => s.productAction === "custom" },
        { id: "talent", type: "text", label: "Personas en escena (opcional)", full: true, placeholder: "Ej.: una mujer de 30 años, cabello rizado, sonrisa natural, ropa casual", help: "Describe edad, apariencia y vestimenta para mayor consistencia." },
      ],
    },
    {
      id: "audio", title: "Audio", icon: "🎵",
      intro: "Modelos como Veo o Sora generan audio nativo. Si no lo especificas, pueden crear sonidos aleatorios o ninguno.",
      fields: [
        { id: "audioType", type: "select", label: "Tipo de audio", full: true },
        { id: "musicGenre", type: "select", label: "Estilo musical", showIf: (s) => ["musica", "musica_sfx", "vo"].includes(s.audioType) },
        { id: "sfx", type: "text", label: "Efectos / ambiente (opcional)", placeholder: "Se sugiere uno según la acción", showIf: (s) => ["musica_sfx", "ambiente"].includes(s.audioType) },
        { id: "voiceTone", type: "select", label: "Tono de voz", showIf: (s) => ["vo", "dialogo"].includes(s.audioType) },
        { id: "voiceLanguage", type: "select", label: "Idioma de la voz", showIf: (s) => ["vo", "dialogo"].includes(s.audioType) },
        { id: "voiceText", type: "textarea", label: "Texto hablado", full: true, rows: 2, placeholder: "Ej.: Tu piel, más luminosa desde el primer día.", showIf: (s) => ["vo", "dialogo"].includes(s.audioType), counter: true },
      ],
    },
    {
      id: "final", title: "Ajustes finales", icon: "✅",
      intro: "Indica qué evitar y en qué idioma quieres el prompt. Revisa las recomendaciones del panel antes de copiarlo.",
      fields: [
        { id: "negatives", type: "checks", label: "Evitar en el video (prompt negativo)", full: true },
        { id: "customNegative", type: "text", label: "Otras cosas a evitar", full: true, placeholder: "Ej.: personas en el fondo, colores neón" },
        { id: "promptLanguage", type: "segmented", label: "Idioma del prompt", full: true,
          choices: [["en", "Inglés (recomendado)"], ["es", "Español"]],
          help: "Los modelos de video suelen seguir mejor las instrucciones en inglés. Tus textos libres se incluyen tal cual." },
        { id: "extraNotes", type: "textarea", label: "Instrucciones adicionales (opcional)", full: true, rows: 2, placeholder: "Ej.: el logo debe aparecer en la esquina inferior derecha en el último segundo" },
      ],
    },
  ];

  const MAX_REFS = 6;
  let state = loadDraft() || structuredClone(DEFAULTS);
  let current = 0;
  const visited = new Set([0]);

  // ---------- Render ----------
  function optionHtml(group) {
    return OPTIONS[group].map((x) => `<option value="${x.id}">${x.es}</option>`).join("");
  }

  function fieldHtml(f) {
    const cls = `field${f.full ? " full" : ""}`;
    const help = f.help ? `<p class="help">${f.help}</p>` : "";
    const id = `f_${f.id}`;
    let control = "";
    switch (f.type) {
      case "text":
        control = `<input type="text" id="${id}" data-field="${f.id}" placeholder="${f.placeholder || ""}">`;
        break;
      case "textarea":
        control = `<textarea id="${id}" data-field="${f.id}" rows="${f.rows || 3}" placeholder="${f.placeholder || ""}"></textarea>${f.counter ? `<p class="counter" data-counter="${f.id}"></p>` : ""}`;
        break;
      case "select":
        control = `<select id="${id}" data-field="${f.id}">${optionHtml(f.id)}</select><p class="tip hidden" data-tip="${f.id}"></p>`;
        break;
      case "checks":
        control = `<div class="checks">${OPTIONS[f.id].map((x) => `<label class="check"><input type="checkbox" data-check="${f.id}" value="${x.id}"><span>${x.es}</span></label>`).join("")}</div>`;
        break;
      case "segmented":
        control = `<div class="segmented" role="radiogroup">${f.choices.map(([v, l]) => `<label><input type="radio" name="${f.id}" data-field="${f.id}" value="${v}"><span>${l}</span></label>`).join("")}</div>`;
        break;
      case "refs":
        control = `<div id="refsBox" class="refs"></div><button type="button" class="btn small" id="btnAddRef">+ Agregar imagen de referencia</button>`;
        break;
    }
    const label = f.type === "checks" || f.type === "segmented" || f.type === "refs"
      ? `<span class="label">${f.label}</span>`
      : `<label class="label" for="${id}">${f.label}</label>`;
    const action = f.action ? `<button type="button" class="btn small accent" id="${f.action.id}">${f.action.label}</button>` : "";
    return `<div class="${cls}" data-wrap="${f.id}">${label}${help}${control}${action}</div>`;
  }

  function renderSteps() {
    $("#stepper").innerHTML = STEPS.map((s, i) =>
      `<button type="button" class="step-btn" data-step="${i}"><span class="num">${i + 1}</span><span class="txt">${s.title}</span></button>`).join("");
    $("#steps").innerHTML = STEPS.map((s, i) => `
      <fieldset class="step" data-panel="${i}" ${i ? "hidden" : ""}>
        <legend><span class="step-icon" aria-hidden="true">${s.icon}</span> Paso ${i + 1}: ${s.title}</legend>
        <p class="intro">${s.intro}</p>
        <div class="grid">${s.fields.map(fieldHtml).join("")}</div>
      </fieldset>`).join("");
  }

  function renderRefs() {
    const box = $("#refsBox");
    if (!box) return;
    const locked = lockedRoles(state.refMode);
    box.innerHTML = state.refs.map((r, i) => `
      <div class="ref-card" data-ref="${i}">
        <div class="ref-thumb">${r.preview ? `<img src="${r.preview}" alt="Vista previa ${i + 1}">` : `<span>${i + 1}</span>`}</div>
        <div class="ref-body">
          <div class="ref-row">
            <select data-ref-role="${i}" ${i < locked.length ? "disabled" : ""} aria-label="Rol de la imagen ${i + 1}">${optionHtml("refRole")}</select>
            ${i >= locked.length ? `<button type="button" class="btn small ghost" data-ref-remove="${i}" aria-label="Quitar imagen ${i + 1}">✕</button>` : ""}
          </div>
          <input type="text" data-ref-desc="${i}" placeholder="Describe la imagen (ej.: frasco sobre fondo blanco, vista frontal)" value="${escapeAttr(r.desc)}">
          <label class="file">Vista previa local (opcional)<input type="file" accept="image/*" data-ref-file="${i}"></label>
        </div>
      </div>`).join("");
    state.refs.forEach((r, i) => ($(`[data-ref-role="${i}"]`).value = r.role));
    const add = $("#btnAddRef");
    add.hidden = !["ingredients", "mixed"].includes(state.refMode) || state.refs.length >= MAX_REFS;
  }

  function lockedRoles(mode) {
    return { start: ["frame_inicial"], start_end: ["frame_inicial", "frame_final"], mixed: ["frame_inicial"] }[mode] || [];
  }

  function defaultRefs(mode) {
    const base = lockedRoles(mode).map((role) => ({ role, desc: "" }));
    if (mode === "ingredients" || mode === "mixed") base.push({ role: "producto", desc: "" });
    return base;
  }

  // Copia el estado al formulario.
  function syncForm() {
    $$("[data-field]").forEach((el) => {
      const v = state[el.dataset.field];
      if (el.type === "radio") el.checked = el.value === v;
      else el.value = v ?? "";
    });
    $$("[data-check]").forEach((el) => (el.checked = (state[el.dataset.check] || []).includes(el.value)));
    renderRefs();
    updateVisibility();
    updateTips();
  }

  function updateVisibility() {
    STEPS.forEach((s) => s.fields.forEach((f) => {
      if (!f.showIf) return;
      $(`[data-wrap="${f.id}"]`).hidden = !f.showIf(state);
    }));
  }

  function updateTips() {
    $$("[data-tip]").forEach((el) => {
      const opt = OPTIONS[el.dataset.tip].find((x) => x.id === state[el.dataset.tip]);
      el.textContent = opt && opt.tip ? opt.tip : "";
      el.classList.toggle("hidden", !(opt && opt.tip));
    });
    $$("[data-counter]").forEach((el) => {
      const words = (state[el.dataset.counter] || "").trim().split(/\s+/).filter(Boolean).length;
      const secs = Math.ceil(words / 2.5);
      el.textContent = words ? `${words} palabras ≈ ${secs} s de habla (video: ${state.duration} s)` : "";
      el.classList.toggle("over", secs > parseInt(state.duration, 10));
    });
  }

  function showStep(i) {
    current = Math.max(0, Math.min(STEPS.length - 1, i));
    visited.add(current);
    $$("[data-panel]").forEach((p) => (p.hidden = +p.dataset.panel !== current));
    $$(".step-btn").forEach((b) => {
      const n = +b.dataset.step;
      b.classList.toggle("active", n === current);
      b.classList.toggle("done", visited.has(n) && n !== current);
      b.setAttribute("aria-current", n === current ? "step" : "false");
      if (n === current) b.scrollIntoView({ block: "nearest", inline: "center" });
    });
    $("#btnPrev").disabled = current === 0;
    $("#btnNext").textContent = current === STEPS.length - 1 ? "Ver prompt ↓" : "Siguiente →";
    $("#stepCount").textContent = `${current + 1} / ${STEPS.length}`;
  }

  // ---------- Generación ----------
  let lastResult = null;
  function generate() {
    const r = buildPrompt(state);
    lastResult = r;
    $("#outPrompt").value = r.prompt;
    $("#outNegative").value = r.negative || "(Sin restricciones seleccionadas)";
    $("#outJson").value = r.json;
    $("#outMeta").textContent = `${r.words} palabras · ${r.prompt.length} caracteres`;

    const circ = 2 * Math.PI * 15.9;
    const bar = $("#scoreBar");
    bar.style.strokeDasharray = `${(r.score / 100) * circ} ${circ}`;
    bar.dataset.level = r.score >= 85 ? "high" : r.score >= 60 ? "mid" : "low";
    $("#scoreValue").textContent = `${r.score}%`;

    $("#tips").innerHTML = r.tips.map((t) => `<li class="${t.level}">${escapeHtml(t.text)}</li>`).join("");

    $("#refsSummary").classList.toggle("hidden", !r.refs.length);
    $("#refsList").innerHTML = r.refs.map((x) => `<li><strong>${escapeHtml(x.tag)}</strong> — ${escapeHtml(x.role)}${x.desc ? `: ${escapeHtml(x.desc)}` : ""}</li>`).join("");
    saveDraft();
  }

  // ---------- Eventos ----------
  function onChange(e) {
    const el = e.target;
    if (el.dataset.field) {
      const key = el.dataset.field;
      state[key] = el.value;
      if (key === "platform" && PLATFORM_PRESETS[el.value]) Object.assign(state, PLATFORM_PRESETS[el.value]);
      if (key === "refMode") state.refs = defaultRefs(el.value);
      if (key === "platform" || key === "refMode") syncForm();
    } else if (el.dataset.check) {
      const key = el.dataset.check;
      state[key] = $$(`[data-check="${key}"]:checked`).map((x) => x.value);
    } else if (el.dataset.refRole) {
      state.refs[+el.dataset.refRole].role = el.value;
    } else if (el.dataset.refDesc) {
      state.refs[+el.dataset.refDesc].desc = el.value;
    } else if (el.dataset.refFile && el.files[0]) {
      const i = +el.dataset.refFile;
      const reader = new FileReader();
      reader.onload = () => { state.refs[i].preview = reader.result; renderRefs(); };
      reader.readAsDataURL(el.files[0]);
      return;
    } else {
      return;
    }
    updateVisibility();
    updateTips();
    generate();
  }

  function bind() {
    const form = $("#form");
    form.addEventListener("input", onChange);
    form.addEventListener("change", (e) => { if (e.target.tagName === "SELECT" || e.target.type === "file" || e.target.type === "radio") onChange(e); });

    form.addEventListener("click", (e) => {
      const rm = e.target.closest("[data-ref-remove]");
      if (rm) {
        state.refs.splice(+rm.dataset.refRemove, 1);
        renderRefs();
        generate();
      }
    });

    $("#btnAddRef").addEventListener("click", () => {
      if (state.refs.length >= MAX_REFS) return;
      state.refs.push({ role: "producto", desc: "" });
      renderRefs();
      generate();
    });

    $("#btnPreset").addEventListener("click", () => {
      const preset = CATEGORY_PRESETS[state.category];
      if (!preset) return;
      Object.assign(state, preset);
      syncForm();
      generate();
      const cat = OPTIONS.category.find((x) => x.id === state.category).es;
      toast(`Recomendaciones aplicadas para «${cat}». Revisa los pasos de estilo, cámara y audio.`);
    });

    $("#stepper").addEventListener("click", (e) => {
      const b = e.target.closest("[data-step]");
      if (b) showStep(+b.dataset.step);
    });
    $("#btnPrev").addEventListener("click", () => { showStep(current - 1); scrollToWizard(); });
    $("#btnNext").addEventListener("click", () => {
      if (current === 0 && !state.description.trim()) {
        toast("Escribe una breve descripción de lo que quieres lograr.");
        $("#f_description").focus();
        return;
      }
      if (current === STEPS.length - 1) {
        $(".preview").scrollIntoView({ behavior: "smooth" });
        return;
      }
      showStep(current + 1);
      scrollToWizard();
    });

    $$(".tab").forEach((tab) => tab.addEventListener("click", () => {
      $$(".tab").forEach((t) => { t.classList.toggle("active", t === tab); t.setAttribute("aria-selected", t === tab); });
      const name = tab.dataset.tab;
      $("#outPrompt").classList.toggle("hidden", name !== "prompt");
      $("#outNegative").classList.toggle("hidden", name !== "negative");
      $("#outJson").classList.toggle("hidden", name !== "json");
    }));

    $("#btnCopy").addEventListener("click", async () => {
      const visible = $$(".output").find((x) => !x.classList.contains("hidden"));
      try {
        await navigator.clipboard.writeText(visible.value);
      } catch {
        visible.select();
        document.execCommand("copy");
      }
      toast("Copiado al portapapeles");
    });

    $("#btnDownload").addEventListener("click", () => {
      const text = [
        "PROMPT", "======", $("#outPrompt").value, "",
        "PROMPT NEGATIVO", "===============", lastResult.negative || "-", "",
        ...(lastResult.refs.length ? ["IMÁGENES DE REFERENCIA", "======================", ...lastResult.refs.map((x) => `${x.tag}: ${x.role}${x.desc ? ` — ${x.desc}` : ""}`), ""] : []),
        "JSON", "====", lastResult.json,
      ].join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
      a.download = `prompt-${slug(state.productName || "video")}.txt`;
      a.click();
      URL.revokeObjectURL(a.href);
    });

    $("#btnSave").addEventListener("click", () => {
      const list = readHistory();
      list.unshift({ id: Date.now(), date: new Date().toLocaleString("es"), title: state.productName || state.description.slice(0, 40) || "Sin título", model: OPTIONS.targetModel.find((x) => x.id === state.targetModel).es, state: stripPreviews(state) });
      writeHistory(list.slice(0, 20));
      toast("Prompt guardado en el historial de este navegador");
    });

    $("#btnHistory").addEventListener("click", openHistory);
    $("#btnCloseHistory").addEventListener("click", () => $("#historyDialog").close());
    $("#historyList").addEventListener("click", (e) => {
      const load = e.target.closest("[data-load]");
      const del = e.target.closest("[data-del]");
      const list = readHistory();
      if (load) {
        const item = list.find((x) => x.id === +load.dataset.load);
        if (item) { setState(item.state); $("#historyDialog").close(); toast("Prompt cargado"); }
      } else if (del) {
        writeHistory(list.filter((x) => x.id !== +del.dataset.del));
        openHistory();
      }
    });

    $("#btnExample").addEventListener("click", () => { setState(EXAMPLE); toast("Ejemplo cargado: sérum facial para Reels"); });
    $("#btnReset").addEventListener("click", () => {
      if (!confirm("¿Borrar todos los parámetros y empezar de nuevo?")) return;
      setState(DEFAULTS);
    });
  }

  function setState(s) {
    state = { ...structuredClone(DEFAULTS), ...structuredClone(s) };
    syncForm();
    generate();
    showStep(0);
  }

  function openHistory() {
    const list = readHistory();
    $("#historyList").innerHTML = list.length
      ? list.map((x) => `<li><div><strong>${escapeHtml(x.title)}</strong><small>${escapeHtml(x.model)} · ${escapeHtml(x.date)}</small></div><div class="history-actions"><button type="button" class="btn small" data-load="${x.id}">Cargar</button><button type="button" class="btn small ghost" data-del="${x.id}" aria-label="Eliminar">✕</button></div></li>`).join("")
      : `<li class="empty">Aún no guardaste prompts. Usa «Guardar» en el panel del prompt.</li>`;
    $("#historyDialog").showModal();
  }

  // ---------- Utilidades ----------
  function scrollToWizard() {
    if (window.innerWidth < 980) $(".wizard").scrollIntoView({ behavior: "smooth" });
  }
  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }
  const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const escapeAttr = escapeHtml;
  const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "video";
  const stripPreviews = (s) => ({ ...s, refs: s.refs.map(({ role, desc }) => ({ role, desc })) });

  function readHistory() {
    try { return JSON.parse(localStorage.getItem("psv-history")) || []; } catch { return []; }
  }
  function writeHistory(list) {
    try { localStorage.setItem("psv-history", JSON.stringify(list)); } catch { toast("No se pudo guardar en este navegador"); }
  }
  function saveDraft() {
    try { localStorage.setItem("psv-draft", JSON.stringify(stripPreviews(state))); } catch { /* sin almacenamiento */ }
  }
  function loadDraft() {
    try {
      const d = JSON.parse(localStorage.getItem("psv-draft"));
      return d ? { ...structuredClone(DEFAULTS), ...d } : null;
    } catch { return null; }
  }

  // ---------- Inicio ----------
  renderSteps();
  bind();
  syncForm();
  showStep(0);
  generate();
})();
