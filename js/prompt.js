/*
 * Motor de construcción de prompts.
 * buildPrompt(state) -> { prompt, negative, json, tips, score, refs }
 * No toca el DOM, así que puede probarse en Node.
 */
(function (global) {
  const find = (group, id) => (OPTIONS[group] || []).find((x) => x.id === id);

  // Texto de una opción en el idioma del prompt ("" si no existe o no aplica).
  function txt(group, id, lang) {
    const opt = find(group, id);
    if (!opt) return "";
    if (lang === "en") return opt.en;
    // En español se usa la etiqueta sin sinónimos tras " / " (p. ej. "Belleza / cosmética" -> "belleza").
    return opt.en ? lowerFirst(opt.es.replace(/\s\/\s[^()]*/, "")) : "";
  }

  const lowerFirst = (s) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);
  const upperFirst = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  const clean = (s) => (s || "").trim().replace(/\s+/g, " ");
  const sentence = (s) => {
    s = clean(s);
    if (!s) return "";
    s = upperFirst(s);
    return /[.!?…]$/.test(s) ? s : s + ".";
  };
  const join = (arr, sep = " ") => arr.filter(Boolean).join(sep);
  const wordCount = (s) => clean(s).split(" ").filter(Boolean).length;

  // Frases fijas por idioma.
  const L = {
    en: {
      theProduct: "the product",
      promoVideo: (style, name, kind) => `${upperFirst(style)} promotional video for ${name}${kind ? `, ${kind}` : ""}.`,
      goal: (obj, aud) => `Goal: ${obj}${aud ? `, aimed at ${aud}` : ""}.`,
      concept: "Concept",
      details: "Product details",
      kind: (cat, off) => `a ${join([cat, off])}`,
      camera: (shot, angle, speed, move) => `${upperFirst(shot)}, ${angle}. Camera movement: ${move}, ${speed}.`,
      cameraShort: (move, speed) => `Camera movement: ${move}, ${speed}.`,
      featuring: (t) => `Featuring ${t}.`,
      setting: (s) => `Setting: ${s}.`,
      lighting: (l, c) => `Lighting: ${l}, ${c}.`,
      lens: (l, d) => join([l, d], ", "),
      styleMood: (s, m) => `Style: ${s}, ${m} atmosphere.`,
      onScreen: (t) => `On-screen text: "${t}" in clean, legible, correctly spelled typography.`,
      format: (a, r, d, f) => `Format: ${join([a, r, d, f], ", ")}.`,
      notes: "Additional notes",
      avoid: "Avoid",
      shot: "Shot",
      cutTo: "Cut to",
      sections: { scene: "Scene & action", look: "Look", audio: "Audio", refs: "References", tech: "Technical", cinematography: "Cinematography", actions: "Actions" },
      hooks: {
        lanzamiento: (n) => `Opens in near darkness; a thin beam of light slowly reveals the silhouette of ${n}`,
        demo: (n) => `Close-up of hands reaching for ${n}, ready to use it`,
        beneficio: (n) => `A person shows mild frustration with an everyday problem that ${n} solves`,
        lifestyle: () => `Wide shot of an aspirational, joyful everyday moment`,
        branding: () => `An evocative, emotional image that sets the tone of the brand`,
        promo: (n) => `A fast, eye-catching motion that grabs attention in the first second, ${n} bursting into frame`,
        unboxing: (n) => `Top-down view of the closed ${n} packaging; hands begin to open it`,
        antes_despues: () => `The "before" state is shown clearly, dull and unappealing`,
        testimonial: (n) => `A person looks straight into the camera, smiling, holding ${n}`,
      },
      detailShot: (n) => `Extreme close-up of the textures, materials and finest details of ${n}`,
      showcase: (shot, move, n, act) => `${upperFirst(shot)} with a ${move}: ${n} ${act}`,
      closing: (n, cta) => `Final hero shot: ${n} centered and perfectly lit, the camera gently settles, leaving clean negative space${cta ? ` for the text "${cta}"` : " for the logo"}`,
      action: (n, a) => `${upperFirst(n)} ${a}.`,
      silent: "Silent: no music, no sound effects, no voice.",
      music: (g, m) => `Music: ${g} instrumental, ${m} mood.`,
      sfx: (s) => `Sound effects: ${s}.`,
      ambient: (s) => `Ambient sound: ${s}.`,
      voiceover: (tone, lang, t) => `Voiceover (${tone} ${lang} voice): "${t}"`,
      dialogue: (who, lang, tone, t) => `${upperFirst(who)} speaks to camera in ${lang} with a ${tone} voice and says: "${t}"`,
      aPerson: "a person",
      noSubs: "(no subtitles)",
      firstFrame: (img) => `Use ${img || "the provided image"} as the first frame. Animate naturally from it, keeping the composition, the product and its details identical.`,
      firstLast: (move) => `Image 1 is the first frame and Image 2 is the last frame. Create a smooth, continuous, physically plausible transition between them${move ? ` with a ${move}` : ""}, without morphing.`,
      refList: "Reference images",
      image: "Image",
      sfxDefaults: {
        rotacion: "a subtle airy whoosh", revelacion: "a deep cinematic bass hit as the light reveals the product",
        splash: "a crisp liquid splash and falling droplets", levita: "a soft magical shimmer",
        explosion: "precise mechanical clicks and whooshes", uso: "realistic handling sounds",
        manos: "packaging rustle and a satisfying click", ingredientes: "fresh crunchy ingredients landing",
        transformacion: "a satisfying swoosh at the transformation", particulas: "a delicate sparkling chime", custom: "subtle, realistic sound effects",
      },
      ambientDefault: (bg) => (bg ? `natural ambient sound of the ${bg}` : "quiet, clean studio room tone"),
    },
    es: {
      theProduct: "el producto",
      promoVideo: (style, name, kind) => `Video promocional con estilo ${style} de ${name}${kind ? `, ${kind}` : ""}.`,
      kind: (cat, off) => join([off, cat ? `de la categoría ${cat}` : ""]),
      goal: (obj, aud) => `Objetivo: ${obj}${aud ? `, dirigido a ${aud}` : ""}.`,
      concept: "Concepto",
      details: "Detalles del producto",
      camera: (shot, angle, speed, move) => `${upperFirst(shot)}, ángulo ${angle}. Movimiento de cámara: ${move}, ${speed}.`,
      cameraShort: (move, speed) => `Movimiento de cámara: ${move}, ${speed}.`,
      featuring: (t) => `Aparece ${t}.`,
      setting: (s) => `Escenario: ${s}.`,
      lighting: (l, c) => `Iluminación: ${l}, ${c}.`,
      lens: (l, d) => join([l ? `lente ${l}` : "", d ? `profundidad de campo ${d}` : ""], ", "),
      styleMood: (s, m) => `Estilo: ${s}, atmósfera ${m}.`,
      onScreen: (t) => `Texto en pantalla: "${t}" con tipografía limpia, legible y bien escrita.`,
      format: (a, r, d, f) => `Formato: ${join([a, r, d, f], ", ")}.`,
      notes: "Notas adicionales",
      avoid: "Evitar",
      shot: "Toma",
      cutTo: "Corte a",
      sections: { scene: "Escena y acción", look: "Look visual", audio: "Audio", refs: "Referencias", tech: "Técnico", cinematography: "Cinematografía", actions: "Acciones" },
      hooks: {
        lanzamiento: (n) => `Comienza casi a oscuras; un fino haz de luz revela lentamente la silueta de ${n}`,
        demo: (n) => `Primer plano de unas manos que toman ${n}, listas para usarlo`,
        beneficio: (n) => `Una persona muestra frustración ante un problema cotidiano que ${n} resuelve`,
        lifestyle: () => `Plano general de un momento cotidiano aspiracional y alegre`,
        branding: () => `Una imagen evocadora y emocional que marca el tono de la marca`,
        promo: (n) => `Un movimiento rápido y llamativo que capta la atención en el primer segundo, ${n} irrumpe en cuadro`,
        unboxing: (n) => `Vista cenital del empaque cerrado de ${n}; unas manos comienzan a abrirlo`,
        antes_despues: () => `Se muestra claramente el estado "antes", opaco y poco atractivo`,
        testimonial: (n) => `Una persona mira directo a cámara, sonriente, sosteniendo ${n}`,
      },
      detailShot: (n) => `Primerísimo primer plano de las texturas, materiales y detalles de ${n}`,
      showcase: (shot, move, n, act) => `${upperFirst(shot)} con ${move}; ${n}: ${act}`,
      closing: (n, cta) => `Plano hero final: ${n} centrado y perfectamente iluminado, la cámara se detiene suavemente dejando espacio limpio${cta ? ` para el texto "${cta}"` : " para el logo"}`,
      action: (n, a) => `Acción de ${n}: ${a}.`,
      silent: "Sin audio: sin música, sin efectos, sin voz.",
      music: (g, m) => `Música: ${g} instrumental, sensación ${m}.`,
      sfx: (s) => `Efectos de sonido: ${s}.`,
      ambient: (s) => `Sonido ambiente: ${s}.`,
      voiceover: (tone, lang, t) => `Voz en off (voz ${tone}, en ${lang}): "${t}"`,
      dialogue: (who, lang, tone, t) => `${upperFirst(who)} habla a cámara en ${lang} con voz ${tone} y dice: "${t}"`,
      aPerson: "una persona",
      noSubs: "(sin subtítulos)",
      firstFrame: (img) => `Usa ${img ? `la ${lowerFirst(img)}` : "la imagen proporcionada"} como primer frame. Anima de forma natural a partir de ella, manteniendo idénticos la composición, el producto y sus detalles.`,
      firstLast: (move) => `La imagen 1 es el frame inicial y la imagen 2 es el frame final. Crea una transición fluida, continua y físicamente plausible entre ambas${move ? ` con ${move}` : ""}, sin deformaciones.`,
      refList: "Imágenes de referencia",
      image: "Imagen",
      sfxDefaults: {
        rotacion: "un sutil whoosh de aire", revelacion: "un golpe grave cinematográfico cuando la luz revela el producto",
        splash: "salpicadura nítida de líquido y gotas cayendo", levita: "un suave destello mágico",
        explosion: "clics mecánicos precisos y whooshes", uso: "sonidos realistas de manipulación",
        manos: "roce del empaque y un clic satisfactorio", ingredientes: "ingredientes frescos y crujientes cayendo",
        transformacion: "un swoosh satisfactorio en la transformación", particulas: "un delicado tintineo brillante", custom: "efectos de sonido sutiles y realistas",
      },
      ambientDefault: (bg) => (bg ? `sonido ambiente natural de ${bg}` : "ambiente de estudio silencioso y limpio"),
    },
  };

  // Fidelidad del producto: el texto EN es la instrucción; en español se traduce aquí.
  const FIDELITY_ES = {
    exacta: "Conserva el producto exactamente como en la referencia: misma forma, proporciones, colores, etiqueta y logo. No lo alteres, deformes ni rediseñes.",
    alta: "Mantén el producto fiel a la referencia, con solo variaciones menores de iluminación.",
    inspiracion: "Usa la referencia solo como inspiración visual general.",
  };

  // Roles de cada imagen según el modo elegido.
  function resolveRefs(s) {
    const mode = s.refMode || "none";
    const refs = (s.refs || []).map((r) => ({ role: r.role, desc: clean(r.desc) }));
    if (mode === "none") return [];
    return refs;
  }

  function shotTimings(n, total) {
    const out = [];
    let start = 0;
    for (let i = 0; i < n; i++) {
      const end = i === n - 1 ? total : Math.round(((i + 1) * total) / n);
      out.push(`${start}–${end}s`);
      start = end;
    }
    return out;
  }

  function buildPrompt(s) {
    const lang = s.promptLanguage === "es" ? "es" : "en";
    const t = L[lang];
    const model = s.targetModel || "generico";
    const name = clean(s.productName) || t.theProduct;
    const kind = t.kind(txt("category", s.category, lang), txt("offeringType", s.offeringType, lang));
    const style = txt("visualStyle", s.visualStyle, lang);
    const mood = txt("mood", s.mood, lang);
    const objective = txt("objective", s.objective, lang);
    const audience = clean(s.audience);
    const description = clean(s.description);
    const details = clean(s.productDetails);
    const talent = clean(s.talent);
    const cta = clean(s.onScreenText);

    const shotType = txt("shotType", s.shotType, lang);
    const angle = txt("cameraAngle", s.cameraAngle, lang);
    const move = txt("cameraMovement", s.cameraMovement, lang);
    const moveCmd = (find("cameraMovement", s.cameraMovement) || {}).cmd || "";
    const speed = txt("cameraSpeed", s.cameraSpeed, lang);
    const lens = t.lens(txt("lens", s.lens, lang), txt("depthOfField", s.depthOfField, lang));
    const action = s.productAction === "custom" ? clean(s.customAction) : txt("productAction", s.productAction, lang);

    const background = s.background === "custom" ? clean(s.customBackground) : txt("background", s.background, lang);
    const lighting = txt("lighting", s.lighting, lang);
    const grade = s.colorGrade === "marca" && clean(s.brandColors)
      ? (lang === "en" ? `brand color palette of ${clean(s.brandColors)}` : `paleta de colores de marca: ${clean(s.brandColors)}`)
      : txt("colorGrade", s.colorGrade, lang);

    const duration = parseInt(s.duration, 10) || 8;
    const shots = parseInt(s.shots, 10) || 1;
    const refs = resolveRefs(s);
    const refMode = s.refMode || "none";
    const hasStartFrame = refMode === "start" || refMode === "start_end" || refMode === "mixed";

    // --- Frases base ---
    const intro = t.promoVideo(style, name, kind);
    const goal = objective ? t.goal(objective, audience) : "";
    const cameraLine = t.camera(shotType, angle, speed, move);
    const actionLine = action ? t.action(name, action) : "";
    const talentLine = talent ? t.featuring(talent) : "";
    const settingLine = background ? t.setting(background) : "";
    const lightLine = t.lighting(lighting, grade);
    const lensLine = lens ? sentence(lens) : "";
    const styleLine = t.styleMood(style, mood);
    const onScreenLine = cta ? t.onScreen(cta) : "";
    const formatLine = t.format(
      txt("aspectRatio", s.aspectRatio, lang),
      txt("resolution", s.resolution, lang),
      txt("duration", s.duration, lang),
      txt("fps", s.fps, lang)
    );
    const notes = clean(s.extraNotes);

    // --- Tomas ---
    const shotList = [];
    if (shots > 1) {
      const hook = (t.hooks[s.objective] || t.hooks.branding)(name);
      const showcase = t.showcase(shotType, move, name, action || "");
      const closing = t.closing(name, cta);
      const parts = shots === 2 ? [t.detailShot(name), `${showcase}. ${closing}`] : [hook, showcase, closing];
      const times = shotTimings(shots, duration);
      parts.forEach((p, i) => shotList.push({ label: `${t.shot} ${i + 1} (${times[i]})`, text: sentence(p) }));
    }

    // --- Audio ---
    const audio = [];
    const voiceLang = txt("voiceLanguage", s.voiceLanguage, lang);
    const tone = txt("voiceTone", s.voiceTone, lang);
    const genre = txt("musicGenre", s.musicGenre, lang);
    const sfx = clean(s.sfx) || t.sfxDefaults[s.productAction] || t.sfxDefaults.custom;
    const voiceText = clean(s.voiceText);
    const studio = ["infinito_blanco", "color_solido", "reflectante", "pedestal", "abstracto"].includes(s.background);
    const ambientBg = studio ? "" : background;
    switch (s.audioType) {
      case "musica":
        audio.push(t.music(genre, mood));
        break;
      case "musica_sfx":
        audio.push(t.music(genre, mood), t.sfx(sfx));
        break;
      case "vo":
        audio.push(t.music(genre, mood));
        if (voiceText) audio.push(`${t.voiceover(tone, voiceLang, voiceText)} ${t.noSubs}`);
        break;
      case "dialogo":
        if (voiceText) audio.push(`${t.dialogue(talent || t.aPerson, voiceLang, tone, voiceText)} ${t.noSubs}`);
        audio.push(t.ambient(t.ambientDefault(ambientBg)));
        break;
      case "ambiente":
        audio.push(t.ambient(clean(s.sfx) || t.ambientDefault(ambientBg)));
        break;
      default:
        if (model === "veo" || model === "sora") audio.push(t.silent);
    }

    // --- Referencias ---
    const refLines = [];
    const tag = (i) => (model === "seedance" ? `@Image${i + 1}` : `${t.image} ${i + 1}`);
    if (refMode === "start") {
      refLines.push(t.firstFrame());
    } else if (refMode === "start_end") {
      refLines.push(model === "seedance"
        ? (lang === "en" ? `@Image1 is the first frame and @Image2 is the last frame. Transition smoothly between them${move ? ` with a ${move}` : ""}, without morphing.` : `@Image1 es el frame inicial y @Image2 el frame final. Transición fluida entre ambas${move ? ` con ${move}` : ""}, sin deformaciones.`)
        : t.firstLast(move));
    }
    if (refMode === "ingredients" || refMode === "mixed") {
      const items = refs.map((r, i) => {
        const role = txt("refRole", r.role, lang);
        return `${tag(i)} = ${role}${r.desc ? ` (${r.desc})` : ""}`;
      });
      if (items.length) refLines.push(`${t.refList}: ${items.join("; ")}.`);
      if (refMode === "mixed" && refs[0] && refs[0].role === "frame_inicial") refLines.push(t.firstFrame(tag(0)));
    }
    if (refMode === "start_end" && refs.some((r) => r.desc)) {
      refs.forEach((r, i) => r.desc && refLines.push(`${tag(i)}: ${r.desc}.`));
    }
    if (refMode !== "none" && s.refFidelity) {
      refLines.push(lang === "en" ? find("refFidelity", s.refFidelity).en : FIDELITY_ES[s.refFidelity]);
    }

    // --- Negativos ---
    const negList = (s.negatives || []).map((id) => txt("negatives", id, lang)).filter(Boolean);
    if (clean(s.customNegative)) negList.push(clean(s.customNegative));
    const negative = negList.join(", ");
    const inlineAvoid = negative && model !== "kling" && model !== "runway" ? `${t.avoid}: ${negative}.` : "";

    // --- Formateo por modelo ---
    const conceptLine = description ? `${t.concept}: ${sentence(description)}` : "";
    const detailsLine = details && !hasStartFrame ? `${t.details}: ${sentence(details)}` : "";
    const shotsText = (sep = "\n") => shotList.map((x) => `${x.label}: ${x.text}`).join(sep);
    const notesLine = notes ? `${t.notes}: ${sentence(notes)}` : "";
    let prompt = "";

    switch (model) {
      case "veo": {
        // Cinematografía + sujeto + acción + contexto + estilo, luego audio.
        const p1 = join([cameraLine, sentence(description), detailsLine, actionLine, talentLine, settingLine, lightLine, lensLine, styleLine]);
        prompt = join([
          join([intro, goal]),
          p1,
          shotList.length ? shotsText() : "",
          audio.length ? `${t.sections.audio}: ${audio.join(" ")}` : "",
          refLines.join(" "), onScreenLine, notesLine, formatLine, inlineAvoid,
        ], "\n\n");
        break;
      }
      case "sora": {
        const prose = join([intro, goal, sentence(description), detailsLine, talentLine, settingLine, actionLine]);
        const cine = [
          `${t.sections.cinematography}:`,
          `- ${lang === "en" ? "Camera shot" : "Plano"}: ${upperFirst(shotType)}, ${angle}`,
          `- ${lang === "en" ? "Camera movement" : "Movimiento"}: ${move}, ${speed}`,
          lens ? `- ${lang === "en" ? "Lens" : "Óptica"}: ${lens}` : "",
          `- ${lang === "en" ? "Lighting" : "Iluminación"}: ${lighting}`,
          `- ${lang === "en" ? "Color" : "Color"}: ${grade}`,
          `- ${lang === "en" ? "Style & mood" : "Estilo y atmósfera"}: ${style}, ${mood}`,
        ].filter(Boolean).join("\n");
        const actions = shotList.length
          ? `${t.sections.actions}:\n${shotList.map((x) => `- ${x.label}: ${x.text}`).join("\n")}`
          : (actionLine ? `${t.sections.actions}:\n- ${actionLine}` : "");
        prompt = join([
          prose, cine, actions,
          audio.length ? `${t.sections.audio}:\n${audio.map((a) => `- ${a}`).join("\n")}` : "",
          refLines.join(" "), onScreenLine, notesLine, formatLine, inlineAvoid,
        ], "\n\n");
        break;
      }
      case "kling": {
        const subj = join([name, details && !hasStartFrame ? `— ${details}` : ""]);
        prompt = join([
          join([intro, sentence(description)]),
          join([
            `${lang === "en" ? "Subject" : "Sujeto"}: ${subj}.`,
            action ? `${lang === "en" ? "Action" : "Acción"}: ${action}.` : "",
            talentLine,
            background ? `${lang === "en" ? "Scene" : "Escena"}: ${background}.` : "",
            `${lang === "en" ? "Camera" : "Cámara"}: ${shotType}, ${angle}, ${move}, ${speed}${lens ? `, ${lens}` : ""}.`,
            `${lang === "en" ? "Lighting & atmosphere" : "Luz y atmósfera"}: ${lighting}, ${grade}, ${style}, ${mood}.`,
          ]),
          shotList.length ? shotsText() : "",
          audio.length ? audio.join(" ") : "",
          refLines.join(" "), onScreenLine, notesLine, formatLine,
        ], "\n\n");
        break;
      }
      case "runway": {
        // Corto y centrado en el movimiento; con imagen no se redescribe el producto.
        const subjectBit = hasStartFrame ? "" : join([sentence(description), detailsLine]);
        prompt = join([
          join([t.cameraShort(move, speed), actionLine, talentLine, subjectBit, hasStartFrame ? "" : settingLine, lightLine, styleLine]),
          shotList.length ? shotsText() : "",
          refLines.join(" "), onScreenLine, notesLine,
        ], "\n\n");
        break;
      }
      case "seedance": {
        const refIntro = refLines.join(" ");
        const shotsJoined = shotList.length
          ? shotList.map((x, i) => `${i ? `${t.cutTo} ` : ""}${x.label}: ${x.text}`).join("\n")
          : "";
        prompt = join([
          refIntro,
          join([intro, goal, sentence(description), detailsLine, talentLine]),
          join([cameraLine, actionLine, settingLine, lightLine, lensLine, styleLine]),
          shotsJoined,
          audio.join(" "), onScreenLine, notesLine, formatLine, inlineAvoid,
        ], "\n\n");
        break;
      }
      case "hailuo": {
        const cmd = moveCmd ? `${moveCmd} ` : "";
        prompt = join([
          join([intro, sentence(description), detailsLine]),
          `${cmd}${join([cameraLine, actionLine, talentLine, settingLine, lightLine, lensLine, styleLine])}`,
          shotList.length ? shotsText() : "",
          audio.join(" "), refLines.join(" "), onScreenLine, notesLine, formatLine, inlineAvoid,
        ], "\n\n");
        break;
      }
      case "luma": {
        prompt = join([
          join([intro, sentence(description), detailsLine, talentLine, actionLine, settingLine, cameraLine, lightLine, lensLine, styleLine]),
          shotList.length ? shotsText() : "",
          refLines.join(" "), audio.join(" "), onScreenLine, notesLine, formatLine, inlineAvoid,
        ], "\n\n");
        break;
      }
      default: {
        const S = t.sections;
        prompt = join([
          join([intro, goal]),
          conceptLine, detailsLine,
          `${S.scene}: ${join([cameraLine, actionLine, talentLine, settingLine])}`,
          `${S.look}: ${join([lightLine, lensLine, styleLine])}`,
          shotList.length ? shotsText() : "",
          audio.length ? `${S.audio}: ${audio.join(" ")}` : "",
          refLines.length ? `${S.refs}: ${refLines.join(" ")}` : "",
          onScreenLine, notesLine,
          `${S.tech}: ${formatLine}`,
          inlineAvoid,
        ], "\n\n");
      }
    }

    // --- JSON estructurado ---
    const json = {
      model: (find("targetModel", model) || {}).en,
      language: lang,
      concept: { product: name, type: kind, objective, audience: audience || undefined, description: description || undefined, product_details: details || undefined },
      scene: { setting: background || undefined, talent: talent || undefined, action: action || undefined },
      camera: { shot: shotType, angle, movement: move, speed, lens: lens || undefined },
      look: { style, lighting, color: grade, mood },
      shots: shotList.length ? shotList.map((x) => ({ [x.label]: x.text })) : undefined,
      audio: audio.length ? audio : undefined,
      references: refMode !== "none" ? { mode: refMode, images: refs.map((r, i) => ({ image: i + 1, role: txt("refRole", r.role, "en"), description: r.desc || undefined })), instructions: refLines } : undefined,
      on_screen_text: cta || undefined,
      technical: { aspect_ratio: s.aspectRatio, resolution: s.resolution, duration_seconds: duration, fps: s.fps },
      negative_prompt: negative || undefined,
      notes: notes || undefined,
    };

    const { tips, score } = evaluate(s, { model, duration, shots, refs, refMode, voiceText, negList });

    return {
      prompt,
      negative,
      json: JSON.stringify(json, null, 2),
      tips,
      score,
      refs: refMode === "none" ? [] : refs.map((r, i) => ({ n: i + 1, tag: tag(i), role: find("refRole", r.role).es, desc: r.desc })),
      words: wordCount(prompt),
    };
  }

  // Calidad del prompt (0-100) y recomendaciones según buenas prácticas.
  function evaluate(s, ctx) {
    const tips = [];
    const checks = [
      [clean(s.description).length >= 40, "Describe con más detalle lo que quieres lograr (al menos una o dos frases)."],
      [!!clean(s.productName), "Agrega el nombre del producto o servicio."],
      [ctx.refMode !== "none" || clean(s.productDetails).length >= 15, "Sin imágenes de referencia, describe la apariencia del producto: forma, color, material, empaque."],
      [!!s.visualStyle && !!s.lighting, "Elige estilo visual e iluminación."],
      [!!s.cameraMovement && !!s.shotType, "Define el plano y el movimiento de cámara: sin él, muchos modelos generan planos estáticos."],
      [!!s.productAction && (s.productAction !== "custom" || clean(s.customAction)), "Indica qué hace el producto o la persona: el movimiento es lo que da vida al video."],
      [s.background !== "custom" || !!clean(s.customBackground), "Describe el fondo personalizado."],
      [s.audioType !== "vo" && s.audioType !== "dialogo" || !!clean(s.voiceText), "Escribe el texto de la voz en off o del diálogo."],
      [ctx.negList.length > 0, "Selecciona al menos una restricción (prompt negativo)."],
      [!(ctx.shots === 3 && ctx.duration < 8) && !(ctx.shots === 2 && ctx.duration < 5), "Demasiadas tomas para la duración elegida: reduce tomas o aumenta la duración."],
      [ctx.refMode === "none" || ctx.refs.every((r) => r.desc), "Describe brevemente cada imagen de referencia."],
    ];
    let ok = 0;
    checks.forEach(([pass, msg]) => (pass ? ok++ : tips.push({ level: "warn", text: msg })));
    const score = Math.round((ok / checks.length) * 100);

    // Consejos específicos del modelo y combinaciones de parámetros.
    const m = ctx.model;
    if (s.promptLanguage === "es") tips.push({ level: "info", text: "La mayoría de modelos de video siguen mejor las instrucciones en inglés. Considera generar el prompt en inglés." });
    if (m === "veo" && ctx.duration > 8) tips.push({ level: "warn", text: "Veo suele generar clips de hasta 8 s: para más duración usa la extensión de escena o genera varias tomas y únelas." });
    if (m === "runway" && s.audioType !== "none") tips.push({ level: "info", text: "Runway no se centra en audio nativo: agrega música y voz en edición." });
    if (m === "runway" && ctx.negList.length) tips.push({ level: "info", text: "Runway recomienda frases en positivo: el prompt negativo no se incluye en el texto. Describe lo que sí quieres ver." });
    if (m === "kling" && ctx.negList.length) tips.push({ level: "info", text: "Pega el contenido de la pestaña «Negativo» en el campo Negative Prompt de Kling." });
    if (m === "hailuo") tips.push({ level: "info", text: "Hailuo interpreta los comandos de cámara entre corchetes (p. ej. [Push in]) al inicio de la descripción." });
    if (m === "seedance" && ctx.refs.length) tips.push({ level: "info", text: "Sube las imágenes en el mismo orden: @Image1, @Image2… corresponden a cada una." });
    if (ctx.refMode === "start_end" && ["orbita", "dron", "handheld"].includes(s.cameraMovement)) tips.push({ level: "warn", text: "Con frame inicial y final, los movimientos amplios (órbita, dron, cámara en mano) aumentan el riesgo de deformación. Prueba estática, dolly o paneo suave." });
    if (ctx.refMode === "start_end") tips.push({ level: "info", text: "Mantén ambas imágenes con encuadre, luz y escala similares para que la transición sea creíble." });
    if (["start", "mixed", "start_end"].includes(ctx.refMode)) tips.push({ level: "info", text: "Con imagen inicial, el prompt debe centrarse en el movimiento y la acción, no en volver a describir la foto." });
    if (clean(s.onScreenText)) tips.push({ level: "info", text: "Los modelos de video aún fallan con textos largos: usa máximo 2-4 palabras o agrega el texto en edición." });
    if (ctx.voiceText && (s.audioType === "vo" || s.audioType === "dialogo")) {
      const secs = wordCount(ctx.voiceText) / 2.5;
      if (secs > ctx.duration) tips.push({ level: "warn", text: `El texto hablado dura unos ${Math.ceil(secs)} s y el video ${ctx.duration} s. Acórtalo (≈ ${Math.floor(ctx.duration * 2.5)} palabras máx.).` });
    }
    if (s.resolution === "4k") tips.push({ level: "info", text: "Verifica que tu modelo y plan permitan 4K; muchos generan en 1080p y escalan después." });
    if (s.fps === "slowmo" && ["dialogo", "vo"].includes(s.audioType)) tips.push({ level: "warn", text: "La cámara lenta no combina bien con voz sincronizada." });
    if (s.visualStyle === "ugc" && ["dron", "grua", "orbita"].includes(s.cameraMovement)) tips.push({ level: "warn", text: "El estilo UGC se ve más auténtico con cámara en mano o POV que con movimientos de grúa/dron." });
    if (ctx.shots === 1 && ctx.duration >= 10) tips.push({ level: "info", text: "Para 10 s o más, una estructura de 3 tomas (gancho → producto → cierre) retiene mejor la atención." });
    tips.push({ level: "info", text: "Configura también relación de aspecto, duración y resolución en la interfaz del modelo: el texto del prompt no siempre las controla." });
    return { tips, score };
  }

  global.buildPrompt = buildPrompt;
  if (typeof module !== "undefined") module.exports = { buildPrompt };
})(typeof window !== "undefined" ? window : globalThis);
