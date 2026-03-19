# Fender Design System — Template Guide

Sistema de diseño dark premium inspirado en fender.com. Adaptable a cualquier marca de productos premium.

---

## Inicio rápido

```tsx
// En tu página:
import '../templates/fender-system/design-tokens.css'
import Navbar from '../templates/fender-system/components/Navbar'
import Hero from '../templates/fender-system/components/Hero'
// ... demás imports
```

---

## Cambiar colores para otra marca

Editar `design-tokens.css` — solo estas 3 variables cambian todo:

```css
:root {
  --color-accent:       #cc0000;  /* → tu color de marca */
  --color-accent-hover: #e60000;  /* → versión más brillante (+15%) */
  --color-accent-muted: rgba(204,0,0,0.15); /* → misma con 15% opacidad */
}
```

**Ejemplos por industria:**

| Marca | Accent |
|---|---|
| Deportes / Energía | `#FF4500` naranja |
| Lujo / Joyería | `#B8860B` dorado |
| Tech / Gaming | `#00D4FF` cyan |
| Moda / Lifestyle | `#8B5CF6` violeta |
| Natura / Eco | `#10B981` esmeralda |

---

## Cambiar tipografía

```css
:root {
  --font-display: 'Tu Fuente Display', fallback, sans-serif;
  --font-body:    'Tu Fuente Body', fallback, sans-serif;
}
```

Agregar el import de Google Fonts ANTES de las variables:

```css
@import url('https://fonts.googleapis.com/css2?family=TuFuente:wght@700;900&display=swap');
```

**Pairings recomendados para dark premium:**

| Display | Body | Mood |
|---|---|---|
| Barlow Condensed | Assistant | Rock / Industrial |
| Oswald | Inter | Deportes / Tech |
| Playfair Display | Lato | Lujo / Moda |
| Bebas Neue | Roboto | Urban / Street |

---

## Componentes — API de props

### `<Navbar>`

```tsx
<Navbar
  logo="NOMBRE"                    // string o ReactNode (tu logo SVG)
  links={[
    { label: 'Sección', href: '#sección' },
  ]}
  cta={{ text: 'Comprar', href: '/shop' }}
/>
```

Comportamiento automático:
- Sticky con `backdrop-blur` al hacer scroll > 40px
- Hamburger + drawer en mobile
- Underline animado en hover

---

### `<Hero>`

```tsx
<Hero
  headline="Tu Headline"
  subheadline="Descripción de apoyo"
  eyebrow="Texto pequeño arriba"     // opcional
  backgroundImage="/path/imagen.jpg"
  ctaPrimary={{ text: 'CTA', href: '/ruta' }}
  ctaSecondary={{ text: 'Secundario', href: '/ruta' }}  // opcional
  align="left"                       // 'left' | 'center'
/>
```

---

### `<FeatureSection>`

```tsx
<FeatureSection
  title="Título de sección"
  subtitle="Descripción opcional"
  features={[
    { icon: <TuIconoSVG />, title: 'Feature', description: 'Descripción' },
  ]}
  layout="grid-3"    // 'grid-3' | 'grid-2' | 'alternating'
  dark={true}        // true = bg #0f0f0f | false = bg #242833
/>
```

`alternating`: alterna imagen/texto izquierda-derecha. Ideal para 2-4 features.

---

### `<ProductGrid>`

```tsx
<ProductGrid
  title="Título"
  subtitle="Subtítulo opcional"
  products={[
    {
      name: 'Nombre del producto',
      category: 'Categoría',
      price: '$999',          // opcional
      href: '/producto',
      image: '/imagen.jpg',
    },
  ]}
  columns={3}   // 2 | 3 | 4
/>
```

---

### `<Footer>`

```tsx
<Footer
  logo="MARCA"
  columns={[
    {
      title: 'Columna',
      links: [{ label: 'Link', href: '/ruta' }],
    },
  ]}
  copyright="© 2025 Tu Empresa"
  socialLinks={[
    { label: 'Instagram', href: 'https://...', icon: <SVG /> },
  ]}
  onNewsletterSubmit={(email) => console.log(email)}
/>
```

---

## Ejemplo completo — otra landing (tienda de skate)

```tsx
// Cambios mínimos para adaptar a otra marca:

// 1. design-tokens.css
--color-accent: #FF4500;  // naranja skate

// 2. Fuente
@import 'Bebas Neue' + 'Roboto'
--font-display: 'Bebas Neue'
--font-body: 'Roboto'

// 3. LandingSkate.tsx — mismos componentes, distinto contenido
<Navbar logo="SKATELAB" links={[...]} cta={{ text: 'Shop', href: '/shop' }} />
<Hero headline="Live to Shred" backgroundImage="/skate-hero.jpg" ... />
<FeatureSection title="Our Decks" features={[...]} layout="grid-3" />
<ProductGrid title="New Drops" products={[...]} columns={4} />
```

**Tiempo estimado de adaptación: 15-20 minutos.**

---

## Animaciones disponibles (sin librerías)

| Efecto | Cómo se activa |
|---|---|
| `fadeInUp` | `style={{ animation: 'fadeInUp 0.8s ease both' }}` |
| `fadeIn` | `style={{ animation: 'fadeIn 0.6s ease both' }}` |
| `slideInLeft` | `style={{ animation: 'slideInLeft 0.8s ease both' }}` |
| Reveal on scroll | `data-reveal` en cualquier elemento dentro de FeatureSection/ProductGrid |
| Hover scale card | `hover:scale-105 transition-transform duration-300` |
| Navbar bg scroll | automático — useState + scrollY > 40 |

---

## Checklist de adaptación

- [ ] Cambiar `--color-accent` en `design-tokens.css`
- [ ] Cambiar fuente display en `design-tokens.css`
- [ ] Reemplazar `backgroundImage` del Hero
- [ ] Actualizar `NAV_LINKS` en la página
- [ ] Reemplazar `PRODUCTS` con tus productos reales
- [ ] Reemplazar `FEATURES_GRID` con tus features
- [ ] Actualizar `FOOTER_COLUMNS` con tus links
- [ ] Cambiar `copyright` en Footer
- [ ] Conectar `onNewsletterSubmit` a tu backend
