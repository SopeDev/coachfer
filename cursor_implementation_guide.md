# LANDING PAGE OPTIMIZATION - IMPLEMENTATION GUIDE FOR CURSOR.IO

## SECTION 1: HERO SECTION
### Current Component: `components/Hero/Hero.jsx`

**CHANGE 1.1: Update Subheadline**
```jsx
// LOCATE: <p className="hero__description">
// REPLACE WITH:
<p className="hero__description">
  Libera las memorias kármicas que te mantienen atrapado en ciclos repetitivos. 
  <strong> En 3 sesiones reprogramamos el código de tu destino desde el plano cuántico.</strong>
</p>
```

**CHANGE 1.2: Add Trust Indicator Below Description**
```jsx
// ADD AFTER: <p className="hero__description">
<div className="hero__trust-bar">
  <span className="hero__trust-item">✓ Más de 26 años de experiencia</span>
  <span className="hero__trust-separator">•</span>
  <span className="hero__trust-item">✓ Miles de vidas transformadas</span>
  <span className="hero__trust-separator">•</span>
  <span className="hero__trust-item">✓ Método cuántico único</span>
</div>
```

**CHANGE 1.3: Add CSS for Trust Bar**
```css
/* ADD TO: components/Hero/Hero.css */
.hero__trust-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  flex-wrap: wrap;
}

.hero__trust-item {
  white-space: nowrap;
}

.hero__trust-separator {
  color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .hero__trust-bar {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .hero__trust-separator {
    display: none;
  }
}
```

---

## SECTION 2: PAIN POINTS SECTION
### Current Component: `components/PainPoints/PainPoints.jsx`

**CHANGE 2.1: Restructure to 5 Chakra-Based Pain Points**
```jsx
// REPLACE ENTIRE pain-points__grid content with:
<div className="pain-points__grid">
  {/* CARD 1: Root + Sacral Chakras */}
  <div className="pain-points__card">
    <div className="pain-points__card-bg"></div>
    <div className="pain-points__card-number">01</div>
    <div className="pain-points__card-chakra">Raíz y Sacral</div>
    <div className="pain-points__card-content">
      <h3 className="pain-points__card-title">Inseguridad y Bloqueos Emocionales</h3>
      <p className="pain-points__card-text">
        Falta de seguridad y estabilidad en tu vida, como si el suelo se moviera bajo tus pies. 
        Arrastras patrones repetitivos en tus relaciones que reconoces pero no puedes transformar, 
        atrapado en ciclos que se repiten una y otra vez.
      </p>
    </div>
    <div className="pain-points__card-accent"></div>
  </div>

  {/* CARD 2: Solar Plexus Chakra */}
  <div className="pain-points__card">
    <div className="pain-points__card-bg"></div>
    <div className="pain-points__card-number">02</div>
    <div className="pain-points__card-chakra">Plexo Solar</div>
    <div className="pain-points__card-content">
      <h3 className="pain-points__card-title">Falta de Poder Personal</h3>
      <p className="pain-points__card-text">
        Inviertes tiempo y dinero en terapia, coaching y trabajo personal, pero sigues sintiéndote 
        sin poder personal, sin la capacidad de tomar decisiones que realmente cambien tu vida.
      </p>
    </div>
    <div className="pain-points__card-accent"></div>
  </div>

  {/* CARD 3: Heart Chakra */}
  <div className="pain-points__card">
    <div className="pain-points__card-bg"></div>
    <div className="pain-points__card-number">03</div>
    <div className="pain-points__card-chakra">Corazón</div>
    <div className="pain-points__card-content">
      <h3 className="pain-points__card-title">Heridas Emocionales que No Cierran</h3>
      <p className="pain-points__card-text">
        Arrastras heridas que parecen no cerrarse nunca, sin importar cuánto trabajo interno haces. 
        Algo te impide abrirte completamente al amor y la conexión profunda que deseas.
      </p>
    </div>
    <div className="pain-points__card-accent"></div>
  </div>

  {/* CARD 4: Throat Chakra */}
  <div className="pain-points__card">
    <div className="pain-points__card-bg"></div>
    <div className="pain-points__card-number">04</div>
    <div className="pain-points__card-chakra">Garganta</div>
    <div className="pain-points__card-content">
      <h3 className="pain-points__card-title">Incapacidad de Expresar tu Verdad</h3>
      <p className="pain-points__card-text">
        No puedes expresar tu verdad ni comunicar lo que realmente sientes. Algo te silencia 
        desde adentro y te impide hablar con autenticidad.
      </p>
    </div>
    <div className="pain-points__card-accent"></div>
  </div>

  {/* CARD 5: Third Eye + Crown Chakras */}
  <div className="pain-points__card">
    <div className="pain-points__card-bg"></div>
    <div className="pain-points__card-number">05</div>
    <div className="pain-points__card-chakra">Tercer Ojo y Corona</div>
    <div className="pain-points__card-content">
      <h3 className="pain-points__card-title">Desconexión de tu Propósito Superior</h3>
      <p className="pain-points__card-text">
        Sientes que algo te bloquea de vivir tu verdadero propósito. Tienes la intuición profunda 
        de que vienes de vidas pasadas con carga que afecta tu presente, pero no puedes ver el 
        camino para alinear tu destino con tu mejor versión.
      </p>
    </div>
    <div className="pain-points__card-accent"></div>
  </div>
</div>
```

**CHANGE 2.2: Add CSS for New Elements**
```css
/* ADD TO: components/PainPoints/PainPoints.css */

.pain-points__card-chakra {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--accent-purple);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.pain-points__card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.pain-points__card-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .pain-points__card-title {
    font-size: 1.1rem;
  }
  
  .pain-points__card-text {
    font-size: 0.9rem;
  }
}
```

**CHANGE 2.3: Update Subtitle for Context**
```jsx
// LOCATE: <p className="pain-points__subtitle">
// REPLACE WITH:
<p className="pain-points__subtitle">
  Cada bloqueo está conectado con un centro energético de tu cuerpo. Si reconoces alguna de estas 
  señales, significa que estás listo para un cambio que va más allá de la terapia tradicional:
</p>
```

---

## SECTION 3: QUOTE SECTION INTEGRATION
### Current Component: `components/Quote/Quote.jsx`

**CHANGE 3.1: Update Quote to Lead into About Section**
```jsx
// LOCATE: <p className="quote__text">
// REPLACE WITH:
<p className="quote__text">
  "Después de más de 26 años acompañando a miles de personas en su proceso de transformación, 
  he desarrollado un método que va más allá de entender tu carta astral: 
  <strong>reprogramamos el software kármico que controla tu vida</strong>."
</p>
```

**CHANGE 3.2: Add Attribution**
```jsx
// ADD AFTER: <p className="quote__text">
<p className="quote__attribution">— Fernando Quintero</p>
```

**CHANGE 3.3: Add CSS for Attribution**
```css
/* ADD TO: components/Quote/Quote.css */
.quote__attribution {
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent-purple);
  margin-top: 1.5rem;
  font-style: normal;
}
```

---

## SECTION 4: ABOUT FERNANDO SECTION
### Current Component: `components/SobreFernando/SobreFernando.jsx`

**CHANGE 4.1: Enhance First Paragraph**
```jsx
// LOCATE: First <p className="sobre-fernando__paragraph">
// REPLACE WITH:
<p className="sobre-fernando__paragraph">
  Mi enfoque ha evolucionado desde lecturas astrológicas tradicionales hacia un 
  <strong> método profundo de reprogramación cuántica</strong> que integra:
</p>
<ul className="sobre-fernando__features">
  <li>✓ La sabiduría ancestral de la Kabbalah</li>
  <li>✓ Principios de física cuántica</li>
  <li>✓ Reprogramación de memorias kármicas</li>
  <li>✓ Activación del ADN divino</li>
</ul>
<p className="sobre-fernando__paragraph">
  Diseñado para quienes están listos para <strong>liberar sus limitaciones kármicas 
  y activar su máximo potencial.</strong>
</p>
```

**CHANGE 4.2: Add CSS for Features List**
```css
/* ADD TO: components/SobreFernando/SobreFernando.css */

.sobre-fernando__features {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}

.sobre-fernando__features li {
  padding: 0.5rem 0;
  font-size: 1rem;
  color: var(--text-primary);
  line-height: 1.6;
}

.sobre-fernando__features li::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 4px;
  background: var(--accent-purple);
  border-radius: 50%;
  margin-right: 0.75rem;
  vertical-align: middle;
}
```

---

## SECTION 5: METHODOLOGY SECTION
### Current Component: `components/Metodo/Metodo.jsx`

**CHANGE 5.1: Add Specific Session Durations**
```jsx
// For each session description, add duration info:

// SESSION 1:
<div className="metodo__session-meta">
  <span className="metodo__session-duration">⏱ Duración: 90 minutos</span>
</div>
<h3 className="metodo__session-title">Diagnóstico Cuántico</h3>

// SESSION 2:
<div className="metodo__session-meta">
  <span className="metodo__session-duration">⏱ Duración: 90 minutos</span>
</div>
<h3 className="metodo__session-title">Reprogramación Lunar y Kármica</h3>

// SESSION 3:
<div className="metodo__session-meta">
  <span className="metodo__session-duration">⏱ Duración: 90 minutos</span>
</div>
<h3 className="metodo__session-title">Activación y Recodificación Hebrea</h3>
```

**CHANGE 5.2: Add CSS for Session Meta**
```css
/* ADD TO: components/Metodo/Metodo.css */

.metodo__session-meta {
  margin-bottom: 0.75rem;
}

.metodo__session-duration {
  display: inline-block;
  font-size: 0.85rem;
  color: var(--accent-purple);
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 4px;
}
```

---

## SECTION 6: BENEFITS SECTION
### Current Component: `components/Benefits/Benefits.jsx`

**CHANGE 6.1: Make Benefits More Specific and Chakra-Connected**
```jsx
// LOCATE: benefits__list
// UPDATE each benefit to be more specific:

<div className="benefits__item">
  <div className="benefits__check">✓</div>
  <p className="benefits__text">
    <strong>Identificar tu herida raíz</strong> que gobierna tu vida desde el inconsciente
  </p>
</div>

<div className="benefits__item">
  <div className="benefits__check">✓</div>
  <p className="benefits__text">
    <strong>Transformar traumas kármicos</strong> y memorias de vidas pasadas que te limitan
  </p>
</div>

<div className="benefits__item">
  <div className="benefits__check">✓</div>
  <p className="benefits__text">
    <strong>Reprogramar patrones ancestrales</strong> heredados de tu línea familiar
  </p>
</div>

<div className="benefits__item">
  <div className="benefits__check">✓</div>
  <p className="benefits__text">
    <strong>Cortar contratos energéticos</strong> que te mantienen en ciclos repetitivos
  </p>
</div>

<div className="benefits__item">
  <div className="benefits__check">✓</div>
  <p className="benefits__text">
    <strong>Activar tu propósito superior</strong> y recuperar tu poder personal
  </p>
</div>

<div className="benefits__item">
  <div className="benefits__check">✓</div>
  <p className="benefits__text">
    <strong>Alinear tus 7 chakras</strong> con tu destino más elevado
  </p>
</div>

<div className="benefits__item">
  <div className="benefits__check">✓</div>
  <p className="benefits__text">
    <strong>Recodificar tu alma</strong> con las vibraciones de las letras hebreas
  </p>
</div>
```

---

## SECTION 7: OFFER/PRICING SECTION
### Current Component: `components/Offer/Offer.jsx`

**CHANGE 7.1: Replace Entire Packages Section with New Structure**
```jsx
// REPLACE all three package divs with:

<div className="offer__packages">
  {/* PACKAGE 1: Sesión Única */}
  <div className="offer__package offer__package--starter">
    <div className="offer__package-header">
      <h3 className="offer__package-name">Sesión Única</h3>
      <p className="offer__package-tagline">"Conoce tu programa"</p>
    </div>
    
    <div className="offer__package-duration">
      <span className="offer__duration-label">Duración</span>
      <span className="offer__duration-value">1 sesión (90 minutos)</span>
    </div>

    <div className="offer__package-price-section">
      <p className="offer__price">$2,000 MXN</p>
    </div>

    <div className="offer__package-features">
      <p className="offer__features-title">Incluye:</p>
      <ul className="offer__features-list">
        <li className="offer__feature-item">
          <span className="offer__feature-icon">✓</span>
          <span className="offer__feature-text">Interpretación inicial de tu carta natal</span>
        </li>
        <li className="offer__feature-item">
          <span className="offer__feature-icon">✓</span>
          <span className="offer__feature-text">Identificación de tu herida raíz principal</span>
        </li>
        <li className="offer__feature-item">
          <span className="offer__feature-icon">✓</span>
          <span className="offer__feature-text">Mapa básico de tus contratos kármicos</span>
        </li>
      </ul>
    </div>

    <div className="offer__package-ideal">
      <p className="offer__ideal-text">
        <strong>Ideal para:</strong> Quien quiere conocer su programa sin compromiso mayor
      </p>
    </div>

    <div className="offer__package-footer">
      <a href="#agendar" className="button button--secondary offer__package-cta">
        Reservar Sesión
      </a>
    </div>
  </div>

  {/* PACKAGE 2: Versión Básica */}
  <div className="offer__package offer__package--basic">
    <div className="offer__package-header">
      <h3 className="offer__package-name">Versión Básica</h3>
      <p className="offer__package-tagline">"Reprograma tu Mapa"</p>
    </div>
    
    <div className="offer__package-duration">
      <span className="offer__duration-label">Duración</span>
      <span className="offer__duration-value">3 sesiones (4.5 horas total)</span>
    </div>

    <div className="offer__package-price-section">
      <p className="offer__price">$5,000 MXN</p>
      <p className="offer__price-detail">$1,666 por sesión</p>
    </div>

    <div className="offer__package-features">
      <p className="offer__features-title">Incluye:</p>
      <ul className="offer__features-list">
        <li className="offer__feature-item">
          <span className="offer__feature-icon">✓</span>
          <span className="offer__feature-text">Interpretación cuántica de la carta</span>
        </li>
        <li className="offer__feature-item">
          <span className="offer__feature-icon">✓</span>
          <span className="offer__feature-text">Identificación de heridas y contratos kármicos</span>
        </li>
        <li className="offer__feature-item">
          <span className="offer__feature-icon">✓</span>
          <span className="offer__feature-text">Rutina personalizada de respiración, mantras y chakras</span>
        </li>
        <li className="offer__feature-item">
          <span className="offer__feature-icon">✓</span>
          <span className="offer__feature-text">Mini-protocolo de reprogramación</span>
        </li>
      </ul>
    </div>

    <div className="offer__package-ideal">
      <p className="offer__ideal-text">
        <strong>Ideal para:</strong> Quien quiere adentrarse al poder de la reprogramación cuántica
      </p>
    </div>

    <div className="offer__package-footer">
      <a href="#agendar" className="button button--secondary offer__package-cta">
        Comenzar Transformación
      </a>
    </div>
  </div>

  {/* PACKAGE 3: Versión Integral */}
  <div className="offer__package offer__package--popular">
    <div className="offer__badge">Más Vendido</div>
    <div className="offer__package-header">
      <h3 className="offer__package-name">Versión Integral</h3>
      <p className="offer__package-tagline">"Recode de Alma"</p>
    </div>
    
    <div className="offer__package-duration">
      <span className="offer__duration-label">Duración</span>
      <span className="offer__duration-value">6 sesiones (9 horas total)</span>
    </div>

    <div className="offer__package-price-section">
      <p className="offer__price">$8,000 MXN</p>
      <p className="offer__price-detail">$1,333 por sesión</p>
      <p className="offer__savings">Ahorras $2,000 vs. sesiones individuales</p>
    </div>

    <div className="offer__package-features">
      <p className="offer__features-title">Todo lo de Básica, más:</p>
      <ul className="offer__features-list">
        <li className="offer__feature-item">
          <span className="offer__feature-icon">✓</span>
          <span className="offer__feature-text">Mayor profundidad de interpretación en 2 sesiones adicionales</span>
        </li>
        <li className="offer__feature-item">
          <span className="offer__feature-icon">✓</span>
          <span className="offer__feature-text">Reprogramación de los planetas kármicos</span>
        </li>
        <li className="offer__feature-item">
          <span className="offer__feature-icon">✓</span>
          <span className="offer__feature-text">Reprogramación personalizada de heridas de la infancia</span>
        </li>
        <li className="offer__feature-item">
          <span className="offer__feature-icon">✓</span>
          <span className="offer__feature-text">Meditación de activación del Destino Superior desde la Astrología Kabbalista</span>
        </li>
      </ul>
    </div>

    <div className="offer__package-ideal">
      <p className="offer__ideal-text">
        <strong>Ideal para:</strong> Quien busca una transformación profunda y duradera
      </p>
    </div>

    <div className="offer__package-footer">
      <a href="#agendar" className="button button--primary offer__package-cta">
        Comenzar Recode de Alma
      </a>
    </div>
  </div>

  {/* PACKAGE 4: Versión Premium */}
  <div className="offer__package offer__package--premium">
    <div className="offer__badge offer__badge--premium">Premium</div>
    <div className="offer__package-header">
      <h3 className="offer__package-name">Versión Premium</h3>
      <p className="offer__package-tagline">"AstroHacking 360"</p>
    </div>
    
    <div className="offer__package-duration">
      <span className="offer__duration-label">Duración</span>
      <span className="offer__duration-value">12 sesiones (18 horas total)</span>
    </div>

    <div className="offer__package-price-section">
      <p className="offer__price">$12,000 MXN</p>
      <p className="offer__price-detail">$1,000 por sesión</p>
      <p className="offer__savings">Ahorras $6,000 vs. sesiones individuales</p>
    </div>

    <div className="offer__package-features">
      <p className="offer__features-title">Todo lo de Integral, más:</p>
      <ul className="offer__features-list">
        <li className="offer__feature-item">
          <span className="offer__feature-icon">✓</span>
          <span className="offer__feature-text">Reprogramación de las 12 casas (todas las áreas de vida)</span>
        </li>
        <li className="offer__feature-item">
          <span className="offer__feature-icon">✓</span>
          <span className="offer__feature-text">Meditación de reprogramación de cada aspecto planetario</span>
        </li>
        <li className="offer__feature-item">
          <span className="offer__feature-icon">✓</span>
          <span className="offer__feature-text">Trabajo profundo de activación de ADN Divino</span>
        </li>
        <li className="offer__feature-item">
          <span className="offer__feature-icon">✓</span>
          <span className="offer__feature-text">Entrenamiento en el manejo de Reprogramación Cuántica</span>
        </li>
        <li className="offer__feature-item">
          <span className="offer__feature-icon">✓</span>
          <span className="offer__feature-text">Acompañamiento en el manejo y uso de los Dones Potenciales</span>
        </li>
      </ul>
    </div>

    <div className="offer__package-ideal">
      <p className="offer__ideal-text">
        <strong>Ideal para:</strong> Quien busca la transformación total y dominar la reprogramación cuántica
      </p>
    </div>

    <div className="offer__package-footer">
      <a href="#agendar" className="button button--primary offer__package-cta">
        Comenzar AstroHacking 360
      </a>
    </div>
  </div>
</div>
```

**CHANGE 7.2: Update CSS for New Package Structure**
```css
/* REPLACE/UPDATE IN: components/Offer/Offer.css */

.offer__packages {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.offer__package {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.offer__package:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);
}

.offer__package--popular {
  border: 2px solid var(--accent-purple);
  box-shadow: 0 4px 24px rgba(139, 92, 246, 0.3);
}

.offer__package--premium {
  border: 2px solid #fbbf24;
  box-shadow: 0 4px 24px rgba(251, 191, 36, 0.3);
}

.offer__badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background: var(--accent-purple);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.offer__badge--premium {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
}

.offer__package-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.offer__package-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.offer__package-tagline {
  font-size: 0.95rem;
  color: var(--accent-purple);
  font-style: italic;
}

.offer__package-duration {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.offer__duration-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--accent-purple);
  font-weight: 600;
}

.offer__duration-value {
  font-size: 0.95rem;
  color: var(--text-primary);
  font-weight: 600;
}

.offer__package-price-section {
  text-align: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.offer__price {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.offer__price-detail {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.offer__savings {
  font-size: 0.85rem;
  color: #10b981;
  font-weight: 600;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  display: inline-block;
  margin-top: 0.5rem;
}

.offer__package-features {
  flex-grow: 1;
  margin-bottom: 1.5rem;
}

.offer__features-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.offer__features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.offer__feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.offer__feature-icon {
  color: var(--accent-purple);