# Prompt Studio Video

Aplicación web para crear **prompts optimizados para videos promocionales** de productos o servicios con IA generativa de video (Google Veo, OpenAI Sora, Kling, Runway, Seedance, Luma, Hailuo/MiniMax o cualquier otro modelo).

El usuario describe brevemente lo que quiere lograr y un asistente por pasos lo guía para elegir con listas desplegables los parámetros que más influyen en la calidad del video. Cada opción incluye un consejo que explica cuándo conviene usarla.

## Cómo usarla

No requiere instalación ni dependencias. Abre `index.html` en el navegador o sírvela como sitio estático:

```bash
python3 -m http.server 8000
```

Luego visita `http://localhost:8000`.

## Pasos del asistente

1. **Concepto**: nombre, tipo (producto, servicio, app…), categoría, objetivo (lanzamiento, demostración, problema → solución, unboxing, antes/después…), descripción breve, apariencia del producto, público y texto en pantalla. El botón «Aplicar recomendaciones» rellena parámetros que suelen funcionar en esa categoría.
2. **Modelo y formato**: generador de destino, plataforma (ajusta la relación de aspecto), resolución, duración, fps / cámara lenta y estructura de tomas (1, 2 o 3 tomas: gancho → producto → cierre, con tiempos calculados).
3. **Fotos de referencia**: sin imágenes (texto a video), frame inicial, **frame inicial + frame final**, referencias de producto/persona/logo/estilo, o frame inicial con referencias adicionales. Cada imagen lleva un rol y una descripción, y se elige el nivel de fidelidad al producto. Opcionalmente se ve una vista previa local de la foto (no se sube a ningún lado).
4. **Estilo visual**: estilo, atmósfera, iluminación, paleta de color (incluye colores de marca) y fondo/escenario.
5. **Cámara y acción**: encuadre, ángulo, movimiento, velocidad, lente, profundidad de campo, acción del producto y personas en escena.
6. **Audio**: sin audio, música, música + efectos, voz en off o diálogo (con contador de palabras ≈ segundos de habla), tono e idioma de la voz.
7. **Ajustes finales**: prompt negativo (qué evitar), idioma del prompt (inglés recomendado o español) e instrucciones adicionales.

## Resultado

- **Prompt** formateado según el modelo elegido, editable antes de copiar.
- **Prompt negativo** por separado (para modelos con ese campo, como Kling).
- **JSON** estructurado con todos los parámetros.
- **Puntuación de completitud** y **recomendaciones** según el modelo y la combinación de parámetros (p. ej. duración máxima de Veo, riesgo de deformación con frame inicial + final y movimientos amplios, texto hablado demasiado largo para la duración).
- Lista de **imágenes a subir** en orden (`Image 1`, `@Image1` en Seedance…).
- Copiar, descargar `.txt`, guardar en un historial local (localStorage) y cargar un ejemplo.

## Buenas prácticas en las que se basa

- Estructura: **sujeto + acción + escena + cámara + iluminación + estilo/atmósfera + audio**, con un sujeto principal por toma.
- Especificar el **movimiento de cámara**: sin él muchos modelos generan planos estáticos.
- **Veo**: lenguaje cinematográfico con la cámara al inicio y audio descrito explícitamente (música, efectos, diálogo entre comillas, «sin subtítulos»).
- **Sora**: prosa descriptiva más un bloque de cinematografía (plano, lente, luz, atmósfera) y lista de acciones.
- **Kling**: sujeto + acción + escena + cámara/luz/atmósfera; prompt negativo en campo aparte.
- **Runway**: prompts cortos, en positivo y centrados en el movimiento; con imagen inicial no se vuelve a describir la foto.
- **Seedance**: narrativa multitoma con etiquetas `@Image1`, `@Image2`.
- **Hailuo**: comandos de cámara entre corchetes (`[Push in]`, `[Pan left]`…).
- **Frame inicial y final**: mantener composición y escala similares para evitar el «morphing» entre imágenes.
- Textos en pantalla cortos (2-4 palabras) o agregados en edición.

## Estructura

```
index.html        Interfaz
css/styles.css    Estilos (tema claro/oscuro, responsive)
js/options.js     Catálogo de opciones, consejos y recomendaciones por categoría
js/prompt.js      Motor que construye el prompt por modelo e idioma (sin DOM)
js/app.js         Asistente, vista previa, historial
```

Para agregar una opción, añádela al grupo correspondiente en `js/options.js` con su texto en español, en inglés y un consejo.
