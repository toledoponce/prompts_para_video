/*
 * Catálogo de parámetros del generador.
 * Cada opción: id, texto ES (UI y prompt en español), texto EN (prompt en inglés),
 * consejo para el usuario y, en movimientos de cámara, el comando de cámara estilo Hailuo.
 */
const o = (id, es, en, tip = "", cmd = "") => ({ id, es, en, tip, cmd });

const OPTIONS = {
  offeringType: [
    o("producto", "Producto físico", "physical product", "Algo que se puede tocar: el video debe lucir su forma, textura y detalles."),
    o("servicio", "Servicio", "service", "Muestra a personas disfrutando el resultado del servicio, no solo el proceso."),
    o("app", "App / software", "digital app", "Combina interfaces en pantalla con personas usándola; evita texto pequeño en pantalla."),
    o("marca", "Marca / institucional", "brand", "Prioriza emoción, valores y estética consistente sobre características."),
    o("evento", "Evento / experiencia", "event experience", "Transmite energía y ambiente: gente, luces, movimiento."),
  ],

  category: [
    o("tecnologia", "Tecnología / electrónica", "consumer technology"),
    o("belleza", "Belleza / cosmética", "beauty and cosmetics"),
    o("moda", "Moda / accesorios", "fashion and accessories"),
    o("alimentos", "Alimentos / bebidas", "food and beverage"),
    o("restaurante", "Restaurante / cafetería", "restaurant and café"),
    o("hogar", "Hogar / decoración", "home and decor"),
    o("joyeria", "Joyería / relojes", "jewelry and watches"),
    o("automotriz", "Automotriz", "automotive"),
    o("salud", "Salud / fitness / bienestar", "health, fitness and wellness"),
    o("finanzas", "Finanzas / seguros", "finance and insurance"),
    o("educacion", "Educación / cursos", "education"),
    o("turismo", "Turismo / hotelería", "travel and hospitality"),
    o("inmobiliaria", "Inmobiliaria", "real estate"),
    o("saas", "Software / SaaS", "software and SaaS"),
    o("otro", "Otro", "general"),
  ],

  objective: [
    o("lanzamiento", "Lanzamiento / revelación", "product launch reveal", "Ideal para generar expectativa: empieza en penumbra y revela el producto con luz."),
    o("demo", "Demostración de uso", "product demonstration", "Muestra manos o personas usando el producto en un contexto real."),
    o("beneficio", "Problema → solución", "problem to solution story", "Presenta un problema en el primer segundo y el producto como la solución."),
    o("lifestyle", "Lifestyle / aspiracional", "aspirational lifestyle", "Personas reales en escenarios deseables; el producto integrado de forma natural."),
    o("branding", "Branding emocional", "emotional brand film", "Menos características, más emoción y narrativa visual."),
    o("promo", "Oferta / promoción", "promotional offer", "Ritmo rápido y un CTA claro; añade el texto de la oferta en edición si es posible."),
    o("unboxing", "Unboxing", "unboxing", "Manos abriendo el empaque, primeros planos de texturas y detalles."),
    o("antes_despues", "Antes y después", "before and after transformation", "Funciona muy bien con frame inicial (antes) y frame final (después)."),
    o("testimonial", "Testimonial / UGC", "user-generated testimonial", "Estilo grabado con celular, persona hablando a cámara: genera confianza."),
  ],

  targetModel: [
    o("generico", "Genérico (cualquier modelo)", "generic", "Estructura universal: sujeto + acción + escena + cámara + luz + estilo + audio."),
    o("veo", "Google Veo 3.x / Flow", "Google Veo", "Veo genera audio nativo: describe música, efectos y diálogos. Si no indicas movimiento de cámara tiende a planos estáticos."),
    o("sora", "OpenAI Sora 2", "OpenAI Sora", "Responde bien a lenguaje de cine (lente, profundidad de campo) y a un bloque de cinematografía separado."),
    o("kling", "Kling", "Kling", "Fórmula: sujeto + acción + escena + cámara/luz/atmósfera. Admite prompt negativo en un campo aparte."),
    o("runway", "Runway Gen-4", "Runway", "Prompts cortos y centrados en el movimiento. Con imagen, no la describas de nuevo: describe qué se mueve."),
    o("seedance", "Seedance (ByteDance)", "Seedance", "Admite narrativas largas multitoma y etiquetas explícitas de referencia como @Image1."),
    o("luma", "Luma Ray", "Luma", "Lenguaje natural y descriptivo; buen soporte de keyframes inicial y final."),
    o("hailuo", "Hailuo / MiniMax", "Hailuo", "Usa comandos de cámara entre corchetes, p. ej. [Push in], [Pan left]."),
  ],

  platform: [
    o("youtube", "YouTube / web horizontal", "YouTube", "Formato 16:9."),
    o("vertical", "TikTok / Reels / Shorts", "vertical social feeds", "Formato 9:16. Gancho visual en los primeros 1-2 segundos."),
    o("instagram", "Instagram / Facebook feed", "social feed", "Formato 4:5 o 1:1, ocupa más pantalla en el feed."),
    o("tv", "TV / CTV / cine", "broadcast TV", "16:9 o 21:9, calidad cinematográfica, 24 fps."),
    o("web", "Banner / hero de sitio web", "website hero banner", "16:9 o 21:9, movimiento sutil que pueda repetirse en bucle."),
    o("linkedin", "LinkedIn / B2B", "LinkedIn", "1:1 o 16:9, tono profesional."),
  ],

  aspectRatio: [
    o("16:9", "16:9 horizontal", "16:9 widescreen"),
    o("9:16", "9:16 vertical", "9:16 vertical"),
    o("1:1", "1:1 cuadrado", "1:1 square"),
    o("4:5", "4:5 retrato", "4:5 portrait"),
    o("21:9", "21:9 cinemascope", "21:9 cinemascope"),
  ],

  resolution: [
    o("720p", "720p (HD)", "720p HD", "Más rápido y barato; útil para pruebas."),
    o("1080p", "1080p (Full HD)", "1080p Full HD", "Estándar recomendado para redes y web."),
    o("4k", "4K (Ultra HD)", "4K Ultra HD", "Solo si el modelo lo soporta; ideal para TV o pantallas grandes."),
  ],

  duration: [
    o("4", "4 segundos", "4 seconds", "Una sola acción clara."),
    o("5", "5 segundos", "5 seconds"),
    o("6", "6 segundos", "6 seconds"),
    o("8", "8 segundos", "8 seconds", "Duración típica de Veo; permite 2 tomas cortas."),
    o("10", "10 segundos", "10 seconds", "Permite estructura gancho → producto → cierre."),
    o("15", "15 segundos", "15 seconds", "Solo en modelos que lo admiten; considera generar tomas y unirlas."),
    o("20", "20 segundos", "20 seconds", "Recomendado dividir en varias generaciones."),
  ],

  fps: [
    o("24", "24 fps (cinematográfico)", "24fps cinematic motion"),
    o("30", "30 fps (estándar web/TV)", "30fps"),
    o("60", "60 fps (fluido)", "smooth 60fps"),
    o("slowmo", "Cámara lenta (high-speed)", "high-speed slow motion", "Espectacular para líquidos, polvo, telas y partículas."),
  ],

  refMode: [
    o("none", "Sin imágenes (texto a video)", "", "El modelo inventa todo: describe el producto con mucho detalle (forma, color, material, logo)."),
    o("start", "Una imagen como frame inicial", "", "Image-to-video: el video arranca exactamente desde tu foto. El prompt debe centrarse en el movimiento."),
    o("start_end", "Frame inicial + frame final", "", "El modelo interpola entre dos imágenes. Mantén composición similar en ambas para evitar deformaciones."),
    o("ingredients", "Imágenes de referencia (producto, persona, estilo…)", "", "Las imágenes guían la apariencia sin ser un frame fijo. Ideal para mantener el producto fiel en una escena nueva."),
    o("mixed", "Frame inicial + referencias adicionales", "", "Combina un primer frame con referencias de producto, logo o estilo."),
  ],

  refRole: [
    o("producto", "Producto", "the product"),
    o("persona", "Persona / modelo", "the character / model"),
    o("logo", "Logo / empaque", "the logo and packaging"),
    o("escenario", "Escenario / locación", "the setting / location"),
    o("estilo", "Estilo / look visual", "the visual style and color grade"),
    o("frame_inicial", "Frame inicial", "the opening frame"),
    o("frame_final", "Frame final", "the closing frame"),
  ],

  refFidelity: [
    o("exacta", "Exacta (no alterar el producto)", "Preserve the product exactly as shown in the reference: same shape, proportions, colors, label and logo. Do not alter, morph or redesign it.", "Recomendado para productos reales con etiqueta o logo."),
    o("alta", "Alta (pequeñas variaciones)", "Keep the product faithful to the reference with only minor lighting variations."),
    o("inspiracion", "Solo inspiración", "Use the reference only as loose visual inspiration."),
  ],

  visualStyle: [
    o("comercial", "Comercial cinematográfico", "high-end cinematic commercial", "El estándar de anuncios premium de TV."),
    o("fotorrealista", "Fotorrealista", "photorealistic, true-to-life"),
    o("minimal", "Minimalista premium", "minimalist premium aesthetic, clean composition, negative space", "Ideal para tecnología, cosmética y joyería."),
    o("lujo", "Editorial de lujo", "luxury editorial fashion film"),
    o("lifestyle", "Lifestyle natural", "natural lifestyle footage, authentic and candid"),
    o("ugc", "UGC (grabado con celular)", "authentic UGC smartphone footage, handheld, vertical selfie style", "Genera confianza en TikTok/Reels; se siente orgánico."),
    o("documental", "Documental", "documentary style, observational"),
    o("3d", "Animación 3D / CGI", "polished 3D CGI animation, octane render look"),
    o("motion", "Motion graphics", "sleek motion graphics, kinetic design"),
    o("stopmotion", "Stop motion", "playful stop-motion animation"),
    o("anime", "Anime / ilustrado", "anime-inspired illustrated animation"),
    o("vintage", "Vintage / película 35mm", "vintage 35mm film look, natural film grain"),
    o("futurista", "Futurista / tech", "futuristic high-tech aesthetic, holographic accents"),
  ],

  lighting: [
    o("softbox", "Estudio suave (softbox)", "soft diffused studio lighting from large softboxes", "Neutra y favorecedora; ideal para mostrar el producto tal cual es."),
    o("golden", "Hora dorada", "warm golden hour sunlight", "Cálida y emocional; perfecta para lifestyle."),
    o("ventana", "Luz natural de ventana", "soft natural window light"),
    o("lowkey", "Low key (alto contraste)", "dramatic low-key lighting with deep shadows", "Misterio y lujo; ideal para revelaciones."),
    o("highkey", "High key (luminoso)", "bright high-key lighting, minimal shadows", "Limpio y optimista; salud, belleza, limpieza."),
    o("rim", "Contraluz / rim light", "strong rim light outlining the silhouette", "Separa el producto del fondo y resalta su contorno."),
    o("volumetrica", "Volumétrica (rayos de luz)", "volumetric light rays through haze"),
    o("neon", "Neón / cyberpunk", "vibrant neon lighting with colored reflections"),
    o("bluehour", "Hora azul", "cool blue hour twilight"),
    o("practica", "Luces prácticas / ambiente", "warm practical lights, cozy ambient glow"),
    o("dura", "Luz dura de mediodía", "hard midday sunlight with crisp shadows"),
  ],

  colorGrade: [
    o("natural", "Natural / fiel", "natural true-to-life color grading"),
    o("calidos", "Tonos cálidos", "warm color palette"),
    o("frios", "Tonos fríos", "cool color palette"),
    o("tealorange", "Teal & orange (cine)", "cinematic teal and orange color grade"),
    o("pastel", "Pastel suave", "soft pastel color palette"),
    o("saturado", "Vibrante / saturado", "vibrant, highly saturated colors"),
    o("desaturado", "Desaturado / mate", "muted, desaturated matte look"),
    o("mono", "Monocromático / B&N", "monochrome black and white"),
    o("marca", "Colores de marca (especificar)", "brand colors", "Escribe los colores en el campo de abajo, p. ej. «azul marino y dorado»."),
  ],

  background: [
    o("infinito_blanco", "Estudio, fondo infinito blanco", "seamless white studio backdrop", "Clásico e-commerce; el producto es el único protagonista."),
    o("color_solido", "Fondo de color sólido", "solid colored backdrop"),
    o("reflectante", "Superficie reflectante oscura", "dark glossy reflective surface", "Look premium tipo Apple / perfumería."),
    o("pedestal", "Pedestal / podio geométrico", "minimalist geometric podium"),
    o("cocina", "Cocina moderna", "modern bright kitchen"),
    o("sala", "Sala / hogar acogedor", "cozy modern living room"),
    o("oficina", "Oficina moderna", "modern open-plan office"),
    o("urbano", "Exterior urbano", "vibrant city street"),
    o("naturaleza", "Naturaleza / bosque", "lush natural forest setting"),
    o("playa", "Playa / costa", "sunny beach coastline"),
    o("lujo", "Interior de lujo", "luxurious interior with marble and brass"),
    o("gimnasio", "Gimnasio / deporte", "modern gym"),
    o("abstracto", "Abstracto (partículas, humo, agua)", "abstract environment with floating particles and soft smoke"),
    o("custom", "Personalizado (describir)", "", "Describe el fondo en el campo de abajo."),
  ],

  mood: [
    o("inspirador", "Inspirador", "inspiring"),
    o("energetico", "Enérgico", "energetic and dynamic"),
    o("elegante", "Elegante / sofisticado", "elegant and sophisticated"),
    o("calido", "Cálido / familiar", "warm and heartfelt"),
    o("divertido", "Divertido / juguetón", "playful and fun"),
    o("misterioso", "Misterioso / intrigante", "mysterious and intriguing"),
    o("tranquilo", "Tranquilo / relajante", "calm and serene"),
    o("epico", "Épico", "epic and grand"),
    o("confiable", "Confiable / profesional", "trustworthy and professional"),
  ],

  shotType: [
    o("hero", "Plano hero de producto", "hero product shot", "El producto centrado y protagonista. El más usado en publicidad."),
    o("general", "Plano general", "wide establishing shot", "Muestra el contexto y la escena completa."),
    o("medio", "Plano medio", "medium shot"),
    o("primer", "Primer plano", "close-up shot"),
    o("macro", "Macro / detalle extremo", "extreme macro close-up", "Resalta texturas, gotas, materiales. Muy atractivo en comida y cosmética."),
    o("cenital", "Cenital (flat lay)", "top-down overhead flat lay shot"),
    o("pov", "POV (punto de vista)", "first-person POV shot", "El espectador «usa» el producto; muy efectivo en redes."),
    o("hombro", "Sobre el hombro", "over-the-shoulder shot"),
  ],

  cameraAngle: [
    o("ojos", "A la altura de los ojos", "eye-level angle"),
    o("contrapicado", "Contrapicado (desde abajo)", "low angle looking up", "Hace que el producto se vea poderoso e imponente."),
    o("picado", "Picado (desde arriba)", "high angle looking down"),
    o("tresCuartos", "Tres cuartos (3/4)", "three-quarter angle", "Muestra frente y lateral: da volumen al producto."),
    o("holandes", "Holandés (inclinado)", "dutch tilt angle"),
    o("cenital", "Cenital (90°)", "bird's-eye overhead angle"),
  ],

  cameraMovement: [
    o("estatica", "Estática (trípode)", "static locked-off camera", "Recomendado con frame inicial + final para evitar deformaciones.", "[Static shot]"),
    o("dollyin", "Dolly in (acercamiento)", "slow dolly-in push toward the subject", "Crea intimidad y foco en el producto.", "[Push in]"),
    o("dollyout", "Dolly out (alejamiento)", "slow dolly-out pull back revealing the scene", "Ideal para revelar el contexto al final.", "[Pull out]"),
    o("orbita", "Órbita 360° alrededor", "smooth 360-degree orbit around the subject", "Muestra el producto desde todos los ángulos.", "[Truck left, Pan right]"),
    o("travelling", "Travelling lateral", "smooth lateral tracking shot", "", "[Truck right]"),
    o("pan", "Paneo horizontal", "slow horizontal pan", "", "[Pan right]"),
    o("tilt", "Tilt vertical", "slow vertical tilt up", "Revela productos altos (botellas, autos) de abajo hacia arriba.", "[Tilt up]"),
    o("grua", "Grúa ascendente", "sweeping crane shot rising upward", "", "[Pedestal up]"),
    o("dron", "Dron FPV", "dynamic FPV drone flythrough", "Energía y espectáculo; turismo, autos, inmobiliaria.", "[Tracking shot]"),
    o("handheld", "Cámara en mano", "subtle handheld camera movement", "Realismo y cercanía, estilo UGC.", "[Shake]"),
    o("seguimiento", "Seguimiento del sujeto", "tracking shot following the subject", "", "[Tracking shot]"),
    o("zoom", "Zoom lento", "slow cinematic zoom in", "", "[Zoom in]"),
    o("rackfocus", "Cambio de foco (rack focus)", "rack focus shifting from foreground to the product", "Dirige la mirada del espectador hacia el producto.", "[Static shot]"),
  ],

  cameraSpeed: [
    o("lenta", "Lenta y suave", "slow, smooth and steady"),
    o("moderada", "Moderada", "moderately paced"),
    o("rapida", "Rápida / dinámica", "fast and dynamic"),
  ],

  lens: [
    o("auto", "Automático (sin especificar)", ""),
    o("24", "Gran angular 24mm", "24mm wide-angle lens"),
    o("35", "35mm (natural)", "35mm lens"),
    o("50", "50mm (estándar)", "50mm lens"),
    o("85", "85mm (retrato)", "85mm portrait lens", "Comprime el fondo y favorece a personas y productos."),
    o("macro", "Macro 100mm", "100mm macro lens"),
    o("anamorfico", "Anamórfico", "anamorphic lens with subtle horizontal flares", "Look de cine con destellos horizontales."),
  ],

  depthOfField: [
    o("auto", "Automática", ""),
    o("baja", "Baja (fondo desenfocado / bokeh)", "shallow depth of field with creamy bokeh", "Aísla el producto del fondo; muy publicitario."),
    o("profunda", "Profunda (todo enfocado)", "deep focus, everything sharp"),
  ],

  productAction: [
    o("rotacion", "Gira lentamente sobre sí mismo", "slowly rotates on its axis"),
    o("revelacion", "Se revela emergiendo de la sombra", "is gradually revealed as it emerges from the shadows"),
    o("splash", "Salpicadura de líquido / agua", "is surrounded by a dramatic splash of liquid frozen in motion"),
    o("levita", "Levita en el aire", "levitates weightlessly in mid-air"),
    o("explosion", "Vista explotada de sus piezas", "separates into an exploded view of its components, then reassembles"),
    o("uso", "Una persona lo usa", "is being used naturally by a person"),
    o("manos", "Manos lo toman / abren", "is picked up and opened by elegant hands"),
    o("ingredientes", "Ingredientes caen a su alrededor", "is surrounded by fresh ingredients falling in slow motion"),
    o("transformacion", "Transformación antes → después", "drives a visible before-and-after transformation"),
    o("particulas", "Partículas / polvo de luz lo rodean", "is surrounded by swirling glowing particles"),
    o("custom", "Personalizada (describir)", ""),
  ],

  shots: [
    o("1", "Toma única (plano secuencia)", "", "La opción más segura: una sola acción continua."),
    o("2", "2 tomas", "", "Ej.: detalle → producto completo."),
    o("3", "3 tomas: gancho → producto → cierre", "", "Estructura clásica de anuncio. Recomendada para 8 s o más."),
  ],

  audioType: [
    o("none", "Sin audio (lo agrego en edición)", "", "La opción más flexible si vas a editar."),
    o("musica", "Solo música", ""),
    o("musica_sfx", "Música + efectos de sonido", "", "Recomendado: los SFX (clic, burbujas, whoosh) aumentan la sensación de calidad."),
    o("vo", "Voz en off + música", ""),
    o("dialogo", "Diálogo de personaje a cámara", "", "Mantén frases cortas (máx. ~8 s de habla por clip)."),
    o("ambiente", "Sonido ambiente natural", ""),
  ],

  musicGenre: [
    o("corporativa", "Corporativa inspiradora", "uplifting corporate"),
    o("electronica", "Electrónica moderna", "modern electronic beat"),
    o("lofi", "Lo-fi relajado", "chill lo-fi"),
    o("orquestal", "Orquestal épica", "epic orchestral score"),
    o("pop", "Pop pegajoso", "catchy upbeat pop"),
    o("acustica", "Acústica cálida", "warm acoustic guitar"),
    o("jazz", "Jazz elegante", "smooth elegant jazz"),
    o("hiphop", "Hip hop / trap", "punchy hip hop beat"),
    o("ambiental", "Ambiental minimalista", "minimal ambient soundscape"),
  ],

  voiceTone: [
    o("calida", "Cálida y cercana", "warm, friendly"),
    o("profesional", "Profesional y segura", "confident, professional"),
    o("energica", "Enérgica y entusiasta", "energetic, enthusiastic"),
    o("susurro", "Suave / íntima (ASMR)", "soft, intimate"),
    o("grave", "Grave y épica (tráiler)", "deep, cinematic trailer-style"),
  ],

  voiceLanguage: [
    o("es", "Español", "Spanish"),
    o("en", "Inglés", "English"),
    o("pt", "Portugués", "Portuguese"),
  ],

  negatives: [
    o("texto", "Texto ilegible o distorsionado", "distorted or illegible text"),
    o("watermark", "Marcas de agua y logos ajenos", "watermarks, extra logos"),
    o("manos", "Manos o dedos deformes", "deformed hands or extra fingers"),
    o("morph", "Deformación del producto", "product morphing or warping"),
    o("flicker", "Parpadeo / flicker", "flickering, jitter"),
    o("cortes", "Cortes bruscos", "abrupt jump cuts"),
    o("blur", "Desenfoque de movimiento excesivo", "excessive motion blur"),
    o("lowq", "Baja calidad / artefactos", "low quality, compression artifacts"),
    o("subtitulos", "Subtítulos automáticos", "burned-in subtitles"),
    o("caras", "Rostros deformes", "distorted faces"),
  ],
};

// Sugerencias automáticas por categoría (rellena parámetros recomendados).
const CATEGORY_PRESETS = {
  tecnologia:   { visualStyle: "minimal", lighting: "rim", colorGrade: "frios", background: "reflectante", mood: "inspirador", shotType: "hero", cameraAngle: "tresCuartos", cameraMovement: "orbita", lens: "85", depthOfField: "baja", productAction: "levita", musicGenre: "electronica" },
  belleza:      { visualStyle: "lujo", lighting: "softbox", colorGrade: "pastel", background: "pedestal", mood: "elegante", shotType: "macro", cameraAngle: "ojos", cameraMovement: "dollyin", lens: "macro", depthOfField: "baja", productAction: "splash", musicGenre: "ambiental" },
  moda:         { visualStyle: "lujo", lighting: "golden", colorGrade: "calidos", background: "urbano", mood: "elegante", shotType: "medio", cameraAngle: "ojos", cameraMovement: "seguimiento", lens: "85", depthOfField: "baja", productAction: "uso", musicGenre: "pop" },
  alimentos:    { visualStyle: "comercial", lighting: "rim", colorGrade: "saturado", background: "reflectante", mood: "energetico", shotType: "macro", cameraAngle: "tresCuartos", cameraMovement: "dollyin", lens: "macro", depthOfField: "baja", productAction: "splash", musicGenre: "pop", fps: "slowmo" },
  restaurante:  { visualStyle: "lifestyle", lighting: "practica", colorGrade: "calidos", background: "custom", mood: "calido", shotType: "primer", cameraAngle: "tresCuartos", cameraMovement: "travelling", lens: "50", depthOfField: "baja", productAction: "ingredientes", musicGenre: "jazz" },
  hogar:        { visualStyle: "lifestyle", lighting: "ventana", colorGrade: "natural", background: "sala", mood: "calido", shotType: "medio", cameraAngle: "ojos", cameraMovement: "dollyin", lens: "35", depthOfField: "auto", productAction: "uso", musicGenre: "acustica" },
  joyeria:      { visualStyle: "lujo", lighting: "lowkey", colorGrade: "calidos", background: "reflectante", mood: "elegante", shotType: "macro", cameraAngle: "tresCuartos", cameraMovement: "orbita", lens: "macro", depthOfField: "baja", productAction: "rotacion", musicGenre: "ambiental" },
  automotriz:   { visualStyle: "comercial", lighting: "bluehour", colorGrade: "tealorange", background: "urbano", mood: "epico", shotType: "general", cameraAngle: "contrapicado", cameraMovement: "dron", lens: "anamorfico", depthOfField: "auto", productAction: "revelacion", musicGenre: "orquestal" },
  salud:        { visualStyle: "fotorrealista", lighting: "highkey", colorGrade: "natural", background: "gimnasio", mood: "energetico", shotType: "medio", cameraAngle: "contrapicado", cameraMovement: "seguimiento", lens: "35", depthOfField: "baja", productAction: "uso", musicGenre: "electronica" },
  finanzas:     { visualStyle: "fotorrealista", lighting: "ventana", colorGrade: "natural", background: "oficina", mood: "confiable", shotType: "medio", cameraAngle: "ojos", cameraMovement: "dollyin", lens: "50", depthOfField: "baja", productAction: "uso", musicGenre: "corporativa" },
  educacion:    { visualStyle: "lifestyle", lighting: "ventana", colorGrade: "calidos", background: "sala", mood: "inspirador", shotType: "medio", cameraAngle: "ojos", cameraMovement: "travelling", lens: "35", depthOfField: "baja", productAction: "uso", musicGenre: "corporativa" },
  turismo:      { visualStyle: "comercial", lighting: "golden", colorGrade: "tealorange", background: "playa", mood: "inspirador", shotType: "general", cameraAngle: "cenital", cameraMovement: "dron", lens: "24", depthOfField: "profunda", productAction: "uso", musicGenre: "acustica" },
  inmobiliaria: { visualStyle: "fotorrealista", lighting: "golden", colorGrade: "calidos", background: "lujo", mood: "elegante", shotType: "general", cameraAngle: "ojos", cameraMovement: "grua", lens: "24", depthOfField: "profunda", productAction: "custom", musicGenre: "ambiental" },
  saas:         { visualStyle: "motion", lighting: "highkey", colorGrade: "frios", background: "oficina", mood: "confiable", shotType: "pov", cameraAngle: "ojos", cameraMovement: "dollyin", lens: "35", depthOfField: "baja", productAction: "uso", musicGenre: "electronica" },
  otro:         { visualStyle: "comercial", lighting: "softbox", colorGrade: "natural", background: "infinito_blanco", mood: "inspirador", shotType: "hero", cameraAngle: "tresCuartos", cameraMovement: "dollyin", lens: "auto", depthOfField: "baja", productAction: "rotacion", musicGenre: "corporativa" },
};

// Ajustes sugeridos según la plataforma de destino.
const PLATFORM_PRESETS = {
  youtube:   { aspectRatio: "16:9" },
  vertical:  { aspectRatio: "9:16" },
  instagram: { aspectRatio: "4:5" },
  tv:        { aspectRatio: "16:9", fps: "24" },
  web:       { aspectRatio: "21:9" },
  linkedin:  { aspectRatio: "1:1" },
};
