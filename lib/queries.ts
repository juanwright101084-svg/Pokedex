import { queryOptions } from "@tanstack/react-query";
import { getPokemonFull, getPokemonList, type PokemonListItem } from "./pokeapi";

export const pokemonListOptions = (page: number) =>
  queryOptions({
    queryKey: ["pokemon-list", page],
    queryFn: () => getPokemonList(page),
  });

export const pokemonDetailOptions = (name: string) =>
  queryOptions({
    queryKey: ["pokemon", name],
    queryFn: () => getPokemonFull(name),
  });

// ─────────────────────────────────────────────────────────
// Filtro por tipo
// ─────────────────────────────────────────────────────────

export const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];

export const pokemonByTypeOptions = (type: PokemonType) =>
  queryOptions({
    queryKey: ["pokemon-type", type],
    queryFn: async (): Promise<PokemonListItem[]> => {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`, {
        next: { revalidate: 24 * 60 * 60 },
      });
      if (!res.ok) throw new Error(`No se pudo cargar el tipo ${type}`);
      const data = await res.json();
      // data.pokemon es un array de { pokemon: { name, url }, slot }
      return data.pokemon.map(
        (p: { pokemon: PokemonListItem }) => p.pokemon
      );
    },
    staleTime: 1000 * 60 * 60,
  });