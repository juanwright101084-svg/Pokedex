const BASE = "https://pokeapi.co/api/v2";
export const PAGE_SIZE = 50;
const MOVES_SAMPLE = 10;

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { slot: number; type: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  stats: { base_stat: number; stat: { name: string } }[];
  moves: { move: { name: string; url: string } }[];
  sprites: {
    front_default: string | null;
    back_default: string | null;
    front_shiny: string | null;
    other: { "official-artwork": { front_default: string | null } };
  };
  species: { url: string };
}

interface MoveDetail {
  name: string;
  power: number | null;
  type: { name: string };
}

export interface MainMove {
  name: string;
  power: number | null;
  type: string;
}

interface PokemonSpecies {
  evolution_chain: { url: string };
}
interface ChainLink {
  species: { name: string };
  evolves_to: ChainLink[];
}
interface EvolutionChain {
  chain: ChainLink;
}

export type PokemonFull = PokemonDetail & {
  evolutions: string[];
  mainMove: MainMove | null;
};

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 24 * 60 * 60 } });
  if (!res.ok) throw new Error(`Error ${res.status} en ${url}`);
  return res.json() as Promise<T>;
}

export const getPokemonList = (page: number) =>
  get<PokemonListResponse>(
    `${BASE}/pokemon?limit=${PAGE_SIZE}&offset=${(page - 1) * PAGE_SIZE}`
  );

function flattenChain(link: ChainLink): string[] {
  return [link.species.name, ...link.evolves_to.flatMap(flattenChain)];
}

async function getEvolutions(speciesUrl: string): Promise<string[]> {
  const species = await get<PokemonSpecies>(speciesUrl);
  const chain = await get<EvolutionChain>(species.evolution_chain.url);
  return flattenChain(chain.chain);
}

async function getMainMove(moves: PokemonDetail["moves"]): Promise<MainMove | null> {
  const details = await Promise.all(
    moves.slice(0, MOVES_SAMPLE).map((m) => get<MoveDetail>(m.move.url))
  );
  if (details.length === 0) return null;

  // Elige el movimiento con más poder; si ninguno tiene, usa el primero
  const best = details.reduce((acc, m) => ((m.power ?? 0) > (acc.power ?? 0) ? m : acc));

  return { name: best.name, power: best.power, type: best.type.name };
}

export async function getPokemonFull(name: string): Promise<PokemonFull> {
  const pokemon = await get<PokemonDetail>(`${BASE}/pokemon/${name}`);
  const [evolutions, mainMove] = await Promise.all([
    getEvolutions(pokemon.species.url),
    getMainMove(pokemon.moves),
  ]);
  return { ...pokemon, evolutions, mainMove };
}

export const getIdFromUrl = (url: string) =>
  Number(url.split("/").filter(Boolean).pop());

export const artworkUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const formatName = (name: string) => name.replace(/-/g, " ");

export const animatedSpriteUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;

// Los GIFs animados existen solo hasta la 5.ª generación (#649)
export const hasAnimatedSprite = (id: number) => id <= 649;