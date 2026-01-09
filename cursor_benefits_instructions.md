# Cursor.io Instructions: Redesign Benefits Section with GSAP

## Objective
Transform the current vertical "benefits" section (3 before→after cards) into a GSAP-powered horizontal scrolling narrative journey. Each panel will have an image and text that slides in from right to left as the user scrolls.

## Current Context
- **Previous section**: Large centered quote on light background with purple text: "ESTOS PATRONES NO SON TU CULPA. SON PROGRAMACIÓN. Y LO QUE FUE PROGRAMADO... PUEDE SER REPROGRAMADO."
- **Current section to replace**: Title "La Transformación Que Experimentarás" with 3 cards showing before (❌) → after (✨) transformations
- **Next section**: "ASTROHACKING: REPROGRAMACIÓN DEL SOFTWARE ASTROLÓGICO" with 4 pillars

## Section Flow Structure

### 1. Quote Section (existing)
User scrolls past the quote section

### 2. Intro Text (NEW)
- Fades in centered when quote section exits viewport
- Text: "Tu Viaje de Transformación" (title) + "Imagina despertar cada día con claridad absoluta sobre quién eres y para qué viniste" (subtitle from original)
- Background: Clean, light background matching quote section
- Duration: Takes ~100vh of scroll space
- GSAP: Fade in on scroll, fade out as horizontal section approaches

### 3. Horizontal Scroll Journey (NEW - Main Feature)
4 panels with [Image | Text] layout that slide horizontally

### 4. Transition to Method (NEW)
- Brief closing text or visual element that bridges to the method section
- Could be a summary statement or call-forward
- GSAP: Fade in after horizontal scroll completes

### 5. Method Section (existing)
Continues as normal with 4 pillars

## Content Structure

### Intro Text Content
```
Title: "Tu Viaje de Transformación"
Subtitle: "Imagina despertar cada día con claridad absoluta sobre quién eres y para qué viniste. Sin dudas. Sin patrones. Solo propósito."
```

### Horizontal Scroll - 4 Panels [Image | Text]

Each panel layout: **50% Image (left) | 50% Text (right)** on desktop
(Stack vertically on mobile)

#### Panel 1: "Donde Estás Ahora"
**Text Content:**
- Eyebrow/Label: "El Punto de Partida"
- Main text: "Desconectado de tu propósito, atrapado en patrones que reconoces pero no puedes romper. Cargando heridas del pasado, programaciones heredadas y memorias kármicas. Viviendo desde limitaciones inconscientes, sin claridad sobre tu camino."
**Image**: [To be provided - suggest dark, constrained imagery - night sky, closed doors, fog]

#### Panel 2: "El Despertar"
**Text Content:**
- Eyebrow/Label: "El Momento de Decisión"
- Main text: "Cuando decides reclamar tu poder y descubres que la astrología es la llave para comprender tu diseño divino. Tu carta natal no es solo información—es el mapa de tu alma esperando ser activado."
**Image**: [To be provided - suggest dawn, keys, opening, revelation imagery]

#### Panel 3: "La Transformación"
**Text Content:**
- Eyebrow/Label: "El Proceso"
- Main text: "Sanación energética profunda que libera karma y memorias celulares. Reprogramación consciente desde tu carta astral. Activación de tu frecuencia más alta y reconexión con tu misión de alma."
**Image**: [To be provided - suggest energy, light, transformation, cosmic activation]

#### Panel 4: "Tu Nueva Realidad"
**Text Content:**
- Eyebrow/Label: "Tu Destino Manifestado"
- Main text: "Alineado con tu misión de alma, libre para crear desde la consciencia superior. Con un mapa claro de tu propósito y poder personal restaurado. Activado en tu frecuencia más alta, creando tu destino conscientemente."
**Image**: [To be provided - suggest expansive sky, open paths, light, freedom]

### Transition Text (after horizontal scroll)
```
"Esta transformación no es teoría. Es el resultado que cientos de personas ya experimentaron."
```
Or alternative:
```
"Ahora descubre cómo lo hacemos posible..."
```

## Complete GSAP JavaScript Implementation

```javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ===== 1. INTRO TEXT ANIMATIONS =====

// Fade in intro text
gsap.from('.intro-text', {
  scrollTrigger: {
    trigger: '.intro-text-section',
    start: 'top 80%',
    end: 'top 20%',
    scrub: 1,
  },
  opacity: 0,
  y: 50,
});

// Fade out intro text as horizontal section approaches
gsap.to('.intro-text', {
  scrollTrigger: {
    trigger: '.horizontal-scroll-wrapper',
    start: 'top 80%',
    end: 'top 50%',
    scrub: 1,
  },
  opacity: 0,
  y: -50,
});

// ===== 2. HORIZONTAL SCROLL ANIMATION =====

const horizontalScroll = gsap.to('.horizontal-container', {
  xPercent: -75, // Move 75% to show all 4 panels (100% - 25% for last panel)
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-scroll-wrapper',
    pin: true,
    scrub: 1,
    snap: {
      snapTo: 1 / 3, // Snap to each of 4 panels (1/3 because we have 3 gaps)
      duration: 0.5,
      ease: 'power1.inOut'
    },
    end: () => '+=' + (document.querySelector('.horizontal-container').scrollWidth - window.innerWidth),
    anticipatePin: 1,
  }
});

// ===== 3. PANEL CONTENT ANIMATIONS =====

// Animate each panel's image and text sliding in from right
const panels = gsap.utils.toArray('.panel');

panels.forEach((panel, index) => {
  const image = panel.querySelector('.panel-image');
  const text = panel.querySelector('.panel-text');
  const eyebrow = panel.querySelector('.eyebrow');
  const paragraph = panel.querySelector('p');

  // Create a timeline for each panel
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: panel,
      containerAnimation: horizontalScroll,
      start: 'left 70%',
      end: 'left 30%',
      scrub: 1,
    }
  });

  // Image slides in and scales
  tl.from(image, {
    x: 200,
    opacity: 0,
    scale: 1.2,
  }, 0);

  // Eyebrow slides in
  tl.from(eyebrow, {
    x: 150,
    opacity: 0,
  }, 0.1);

  // Paragraph slides in
  tl.from(paragraph, {
    x: 150,
    opacity: 0,
  }, 0.2);
});

// ===== 4. TRANSITION TEXT ANIMATION =====

gsap.from('.transition-text', {
  scrollTrigger: {
    trigger: '.transition-text-section',
    start: 'top 80%',
    end: 'top 50%',
    scrub: 1,
  },
  opacity: 0,
  y: 50,
  scale: 0.95,
});

// ===== 5. OPTIONAL: PROGRESS INDICATOR =====

// Add this HTML to your structure:
// <div class="scroll-progress">
//   <div class="progress-bar"></div>
// </div>

gsap.to('.progress-bar', {
  scrollTrigger: {
    trigger: '.horizontal-scroll-wrapper',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.3,
  },
  width: '100%',
});

// ===== 6. MOBILE SPECIFIC (disable horizontal scroll on mobile) =====

ScrollTrigger.matchMedia({
  // Desktop
  '(min-width: 769px)': function() {
    // All animations above run normally
  },
  
  // Mobile
  '(max-width: 768px)': function() {
    // Kill horizontal scroll, use simpler vertical animations
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.containerAnimation) {
        trigger.kill();
      }
    });

    // Simple fade-in for each panel on mobile
    panels.forEach(panel => {
      gsap.from(panel, {
        scrollTrigger: {
          trigger: panel,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
        },
        opacity: 0,
        y: 100,
      });
    });
  }
});

// ===== 7. REFRESH SCROLLTRIGGER AFTER IMAGES LOAD =====

window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});
```

## Design Specifications

### Typography
- **Intro title**: 3rem (48px), match site's heading font (likely serif like Cormorant Garamond)
- **Intro subtitle**: 1.5rem (24px), line-height 1.6
- **Eyebrow text**: 0.875rem (14px), uppercase, letter-spacing 2px, gold/accent color
- **Panel text**: 1.5rem (24px), line-height 1.8
- **Transition text**: 1.75rem (28px), italic style

### Color Palette
- **Purple accent**: #4a4a8a (match existing site)
- **Gold accent**: #d4af37 (for eyebrows)
- **Text dark**: #333
- **Text light**: #666
- **Background**: #f8f8f8 (match quote section)
- **Panel backgrounds**: White (#fff) for text side

### Spacing
- Section padding: 2rem mobile, 4rem desktop
- Panel text padding: 2rem mobile, 4-6rem desktop
- Margins between elements: 1.5rem standard

### Image Specifications
- **Dimensions**: Minimum 1920x1080px for desktop
- **Aspect ratio**: 16:9 or similar landscape
- **Format**: WebP preferred for performance, JPG fallback
- **Optimization**: Compress to under 200kb each
- **Alt text**: Descriptive for accessibility

### Suggested Image Themes
1. **Panel 1 - Darkness/Constraint**: Dark night sky, fog, closed doors, shadowy path, person in darkness
2. **Panel 2 - Awakening**: Dawn breaking, light through window, keys, opening door, zodiac wheel emerging
3. **Panel 3 - Transformation**: Bright energy, light beams, chakras, cosmic patterns, astrological chart with light
4. **Panel 4 - Freedom**: Expansive bright sky, open landscape, person in light, star-filled clarity, open path

## Success Criteria

- [x] Uses GSAP with ScrollTrigger (no vanilla CSS scroll)
- [x] Intro text fades in/out smoothly
- [x] Horizontal scroll is pinned and smooth
- [x] 4 panels with [Image | Text] layout
- [x] Content slides from right to left on scroll
- [x] Snap points for each panel
- [x] Transition text bridges to method section
- [x] Mobile responsive (converts to vertical scroll)
- [x] Images are provided by user
- [x] Maintains site's elegant, spiritual aesthetic
- [x] Smooth transitions between all sections

## File Structure

```
/components
  /sections
    IntroText.jsx (or .js)
    HorizontalJourney.jsx
    TransitionText.jsx
    
/animations
  horizontalScroll.js (GSAP logic)
  
/styles
  horizontalJourney.css
  
/assets
  /images
    panel-1.jpg
    panel-2.jpg
    panel-3.jpg
    panel-4.jpg
```

## Performance Considerations

1. **Lazy load images**: Only load images as they approach viewport
2. **GSAP optimization**: Use `will-change: transform` on animated elements
3. **Smooth scrolling**: Ensure `scrub` values are optimized (1 is good balance)
4. **Mobile**: Disable heavy animations on mobile, use simpler fade-in
5. **Test on**: Chrome, Firefox, Safari, mobile browsers

## Accessibility

- Add `aria-label` to horizontal scroll section: "Viaje de transformación - desliza horizontalmente"
- Ensure keyboard navigation works (Tab key through panels)
- Provide `alt` text for all images
- Test with screen readers
- Maintain text contrast ratios (WCAG AA minimum)
- Add focus states for interactive elements

## Integration Notes

- This replaces the existing "La Transformación Que Experimentarás" section entirely
- Sits between "Quote Section" and "Method Section" 
- Total scroll length: ~5-6 viewports (intro + 4 panels + transition)
- Should feel like a natural flow, not a jarring transition
- Test smooth handoff from quote fade-out to intro fade-in

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- GSAP ScrollTrigger handles most cross-browser issues
- Provide fallback for older browsers (simple vertical scroll)
- Test on iOS Safari (can have scroll issues)

## Next Steps for Implementation

1. Create the HTML structure with placeholder content
2. Add CSS styling and responsive breakpoints  
3. Implement GSAP animations following the JavaScript code provided
4. Replace placeholder images with actual images (provided by user)
5. Test on multiple devices and browsers
6. Optimize performance and loading times
7. Add progress dots if desired
8. Fine-tune animation timing and easing
9. Test complete flow: quote → intro → horizontal → transition → method

## HTML Structure

```html
<!-- 1. Intro Text Section -->
<section class="intro-text-section">
  <div class="intro-text">
    <h2>Tu Viaje de Transformación</h2>
    <p>Imagina despertar cada día con claridad absoluta sobre quién eres y para qué viniste. Sin dudas. Sin patrones. Solo propósito.</p>
  </div>
</section>

<!-- 2. Horizontal Scroll Container -->
<section class="horizontal-scroll-wrapper">
  <div class="horizontal-container">
    
    <!-- Panel 1 -->
    <div class="panel" data-panel="1">
      <div class="panel-image">
        <img src="[image-1.jpg]" alt="Punto de partida">
      </div>
      <div class="panel-text">
        <span class="eyebrow">El Punto de Partida</span>
        <p>Desconectado de tu propósito, atrapado en patrones que reconoces pero no puedes romper. Cargando heridas del pasado, programaciones heredadas y memorias kármicas. Viviendo desde limitaciones inconscientes, sin claridad sobre tu camino.</p>
      </div>
    </div>

    <!-- Panel 2 -->
    <div class="panel" data-panel="2">
      <div class="panel-image">
        <img src="[image-2.jpg]" alt="El despertar">
      </div>
      <div class="panel-text">
        <span class="eyebrow">El Momento de Decisión</span>
        <p>Cuando decides reclamar tu poder y descubres que la astrología es la llave para comprender tu diseño divino. Tu carta natal no es solo información—es el mapa de tu alma esperando ser activado.</p>
      </div>
    </div>

    <!-- Panel 3 -->
    <div class="panel" data-panel="3">
      <div class="panel-image">
        <img src="[image-3.jpg]" alt="La transformación">
      </div>
      <div class="panel-text">
        <span class="eyebrow">El Proceso</span>
        <p>Sanación energética profunda que libera karma y memorias celulares. Reprogramación consciente desde tu carta astral. Activación de tu frecuencia más alta y reconexión con tu misión de alma.</p>
      </div>
    </div>

    <!-- Panel 4 -->
    <div class="panel" data-panel="4">
      <div class="panel-image">
        <img src="[image-4.jpg]" alt="Nueva realidad">
      </div>
      <div class="panel-text">
        <span class="eyebrow">Tu Destino Manifestado</span>
        <p>Alineado con tu misión de alma, libre para crear desde la consciencia superior. Con un mapa claro de tu propósito y poder personal restaurado. Activado en tu frecuencia más alta, creando tu destino conscientemente.</p>
      </div>
    </div>

  </div>
</section>

<!-- 3. Transition Text -->
<section class="transition-text-section">
  <div class="transition-text">
    <p>Esta transformación no es teoría. Es el resultado que cientos de personas ya experimentaron.</p>
  </div>
</section>
```

## CSS Structure

```css
/* ===== INTRO TEXT SECTION ===== */
.intro-text-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8; /* Match quote section background */
}

.intro-text {
  text-align: center;
  max-width: 800px;
  padding: 2rem;
}

.intro-text h2 {
  font-size: 3rem;
  color: #4a4a8a; /* Match site purple */
  margin-bottom: 1.5rem;
}

.intro-text p {
  font-size: 1.5rem;
  color: #666;
  line-height: 1.6;
}

/* ===== HORIZONTAL SCROLL SECTION ===== */
.horizontal-scroll-wrapper {
  overflow: hidden;
}

.horizontal-container {
  display: flex;
  width: 400vw; /* 4 panels × 100vw each */
  height: 100vh;
}

.panel {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-shrink: 0;
}

.panel-image {
  width: 50%;
  height: 100%;
  overflow: hidden;
}

.panel-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.panel-text {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem 6rem;
  background: #fff; /* Or match your site background */
}

.panel-text .eyebrow {
  display: block;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #d4af37; /* Gold accent */
  margin-bottom: 1.5rem;
}

.panel-text p {
  font-size: 1.5rem;
  line-height: 1.8;
  color: #333;
}

/* ===== TRANSITION TEXT ===== */
.transition-text-section {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
}

.transition-text {
  text-align: center;
  max-width: 800px;
  padding: 2rem;
}

.transition-text p {
  font-size: 1.75rem;
  font-style: italic;
  color: #4a4a8a;
  line-height: 1.6;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .horizontal-container {
    flex-direction: column;
    width: 100vw;
    height: auto;
  }
  
  .panel {
    width: 100vw;
    height: auto;
    min-height: 100vh;
    flex-direction: column;
  }
  
  .panel-image,
  .panel-text {
    width: 100%;
    height: 50vh;
  }
  
  .panel-text {
    padding: 2rem;
  }
  
  .intro-text h2 {
    font-size: 2rem;
  }
  
  .intro-text p {
    font-size: 1.125rem;
  }
}
```