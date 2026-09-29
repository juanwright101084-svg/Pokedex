# Pokédex 🎮

> Optimización de Transferencia de Datos con Next.js 16 + TanStack Query + PokeAPI

Explorador interactivo de los **1351 Pokémon** de las 9 generaciones, construido como proyecto del **Módulo 4: Profesionalización Frontend con TypeScript y Next.js** del Bootcamp Full Stack Junior (Kodigo).

**🔗 Demo en vivo:** [pokedex-omega-inky.vercel.app](https://pokedex-omega-inky.vercel.app/)

---

## 📋 Cumplimiento de la actividad

### ✅ Requisitos técnicos obligatorios

#### a) Lista de Pokémon (Servidor)
- ✅ Página principal implementada como **React Server Component** (`app/page.tsx`).
- ✅ Renderiza **50 Pokémon por página** desde el servidor con `prefetchQuery`.
- ✅ Muestra nombre e imagen (artwork oficial) de cada Pokémon en tarjetas visuales.
- ✅ **Paginación** funcional con botones "Anterior/Siguiente" y contador.

#### b) Prefetching en Hover
- ✅ `queryClient.prefetchQuery()` se dispara al pasar el mouse por una tarjeta (`onMouseEnter`).
- ✅ Se pre-cargan datos detallados: **stats, tipos, movimientos principales y evolución**.
- ✅ Transición instantánea al detalle si ya se hizo hover previamente.

#### c) Hydration Boundary
- ✅ `<HydrationBoundary>` envuelve la lista en `app/page.tsx`.
- ✅ `dehydrate(queryClient)` transfiere el estado del servidor al cliente.
- ✅ **Transición fluida** sin flash de carga inicial.

#### d) Página de Detalle
- ✅ Ruta dinámica: **`/pokemon/[name]`**.
- ✅ Muestra: **stats, tipos, habilidades, movimiento principal, cadena evolutiva y sprites**.
- ✅ Datos disponibles **instantáneamente** si fueron prefetched (gracias a la caché de TanStack Query).

### ✅ Configuración de caché

- ✅ **`staleTime: 24 * 60 * 60 * 1000`** (24 horas) configurado en todas las queries.
- ✅ **`gcTime`** configurado por defecto de TanStack Query (5 minutos).
- ✅ Estrategia de caché documentada (ver sección "Estrategia de Caché" abajo).

### ✅ Mejores prácticas

- ✅ **Separación clara** entre Server Components (`page.tsx`) y Client Components (`pokemon-list.tsx`, `pokemon-card.tsx`).
- ✅ **Manejo de estados** de carga (`isPending`), error (`isError`) y skeleton loading.
- ✅ **TypeScript** con tipado completo en `lib/pokeapi.ts` (`PokemonDetail`, `PokemonListItem`, `PokemonFull`, `PokemonListResponse`).

### ✨ Extras implementados (más allá de los requisitos)

- 🎬 **Intro con video** — Pantalla de bienvenida con video de fondo y transición suave.
- 🎯 **Filtro por 18 tipos** — Botones con colores oficiales de cada tipo.
- 🔍 **Búsqueda en tiempo real** — Filtra Pokémon por nombre mientras escribes.
- ⬆️ **Botón "Volver arriba"** — Aparece al hacer scroll.
- 🎨 **Diseño premium** — Tema oscuro con gradientes, glassmorphism y hover effects.
- 🃏 **Tooltip en hover** — Muestra tipos, movimiento principal y evoluciones al pasar el mouse.
- 💀 **Skeleton loading** — 50 cards animadas mientras se cargan los datos.
- 🎭 **Sprites animados** — GIFs animados para Pokémon de Gen 1-5.

---

## 🚀 Puesta en marcha

### 1. Clona el repositorio

```bash
git clone https://github.com/juanwright101084-svg/Pokedex.git
cd Pokedex
2. Instala dependencias
bash
npm install
3. Levanta el servidor de desarrollo
bash
npm run dev
Abre http://localhost:3000 en tu navegador.

No requiere variables de entorno — PokeAPI es pública.

📁 Estructura del proyecto
text
pokeapi/
├── app/
│   ├── layout.tsx                    # Layout raíz (header, footer, intro, ScrollToTop)
│   ├── page.tsx                      # 🖥️ Server Component — prefetch + HydrationBoundary
│   ├── globals.css                   # Estilos globales y animaciones
│   ├── loading.tsx                   # Estado de carga global
│   ├── error.tsx                     # Estado de error global
│   ├── not-found.tsx                 # Página 404 personalizada
│   └── pokemon/
│       └── [name]/page.tsx           # 📄 Detalle de Pokémon (Server Component)
├── components/
│   ├── AppWrapper.tsx                # Cliente — controla la intro
│   ├── IntroVideo.tsx                # 🎬 Pantalla de bienvenida con video
│   ├── pokemon-list.tsx              # Cliente — filtros, búsqueda, paginación
│   ├── pokemon-card.tsx              # Cliente — hover + prefetch + tooltip
│   ├── pokemon-detail.tsx            # Detalle completo del Pokémon
│   ├── providers.tsx                 # TanStack Query Provider
│   └── scroll-to-top.tsx             # Botón "Volver arriba"
├── lib/
│   ├── pokeapi.ts                    # Funciones y tipos de PokeAPI
│   ├── queries.ts                    # queryOptions centralizadas
│   └── query-client.ts               # Cliente de TanStack Query
├── public/
│   └── videos/
│       └── pokemon-intro.mp4         # Video de la intro
└── next.config.ts
🛠️ Stack Tecnológico
Tecnología	Uso
Next.js 16	App Router, Server Components, prefetch SSR
TypeScript	Tipado completo de las respuestas de PokeAPI
TanStack Query v5	Estado del servidor, caché, prefetch, hydration
Tailwind CSS	Estilos utilitarios con tema oscuro personalizado
PokeAPI	Fuente de datos (REST pública, sin autenticación)
Vercel	Deploy con CI/CD automático
🎯 Estrategia de Caché
Configuración global
tsx
// lib/queries.ts
export const pokemonListOptions = (page: number) =>
  queryOptions({
    queryKey: ["pokemon-list", page],
    queryFn: () => getPokemonList(page),
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
  });

export const pokemonDetailOptions = (name: string) =>
  queryOptions({
    queryKey: ["pokemon", name],
    queryFn: () => getPokemonFull(name),
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
  });
Por qué 24 horas de staleTime
Los datos de Pokémon nunca cambian (PokeAPI es estática).

Evitamos refetch innecesarios que consumirían ancho de banda.

Los usuarios obtienen respuestas instantáneas desde caché.

gcTime (Garbage Collection)
Por defecto en TanStack Query v5: 5 minutos.

Los datos en desuso se limpian después de este tiempo.

Configurado implícitamente — no requiere ajustes para este caso.

Estrategia de prefetch
Server-side prefetch en app/page.tsx con prefetchQuery + dehydrate.

Client-side prefetch al hacer hover con queryClient.prefetchQuery.

Caché compartida entre servidor y cliente gracias a HydrationBoundary.

🎬 Intro con video
La intro se muestra una vez por sesión (sessionStorage):

Video de fondo con overlay oscuro.

Texto "¿Quieres volver a recordar tu infancia?".

Botón "Explorar ahora" que salta la intro.

Auto-avance al terminar el video (30 segundos).

Transición de opacidad suave de 1 segundo.

Para reemplazar: coloca tu video en public/videos/pokemon-intro.mp4 (siempre en minúsculas — Linux/Vercel son case-sensitive).

🎯 Filtro por tipo
Los 18 tipos de Pokémon tienen colores oficiales:

Tipo	Color	Tipo	Color
Normal	Gris	Bug	Verde lima
Fire	Naranja	Rock	Marrón
Water	Azul	Ghost	Púrpura oscuro
Electric	Amarillo	Dragon	Índigo
Grass	Verde	Dark	Negro
Ice	Cian	Steel	Acero
Fighting	Rojo oscuro	Fairy	Rosa
Poison	Púrpura	Flying	Índigo claro
Ground	Marrón claro	Psychic	Rosa fuerte
Al seleccionar un tipo:

El botón se ilumina con su color oficial.

El grid se filtra instantáneamente.

La paginación se oculta (PokeAPI devuelve todos juntos).

🚢 Deploy
El proyecto está desplegado en Vercel con CI/CD automático:

URL de producción: pokedex-omega-inky.vercel.app

Repositorio: github.com/juanwright101084-svg/Pokedex

Rama: main

Cada git push a main desencadena un nuevo deploy automático.

📊 Estadísticas del proyecto
1351 Pokémon disponibles (9 generaciones).

18 tipos con filtro y colores oficiales.

50 Pokémon por página.

24 horas de caché configurado.

0 variables de entorno requeridas.

~5 MB de peso del video intro (comprimido con HandBrake).

🎓 Aprendizajes aplicados
SSR con prefetch y transferencia de estado con HydrationBoundary.

queryOptions pattern de TanStack Query v5 para centralizar configuración.

Prefetch al hover con onMouseEnter para UX optimizada.

Type narrowing en TypeScript para datos polimórficos.

Caché con staleTime apropiado al caso de uso.

Separación Server/Client Components según necesidad.

Compresión de video con HandBrake para producción.

Compatibilidad Windows/Linux en nombres de archivos.

👨‍💻 Autor
Juan Guzman
Bootcamp Full Stack Junior — Kodigo, Módulo 4

GitHub: @juanwright101084-svg

Demo: pokedex-omega-inky.vercel.app