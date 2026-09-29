"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  pokemonListOptions,
  pokemonByTypeOptions,
  POKEMON_TYPES,
  type PokemonType,
} from "@/lib/queries";
import { PAGE_SIZE, getIdFromUrl, type PokemonListItem, type PokemonListResponse } from "@/lib/pokeapi";
import PokemonCard from "./pokemon-card";

// Colores oficiales para cada tipo
const TYPE_BUTTON_COLORS: Record<string, string> = {
  normal: "bg-gray-500 hover:bg-gray-400 border-gray-500 text-white",
  fire: "bg-orange-500 hover:bg-orange-400 border-orange-500 text-white",
  water: "bg-blue-500 hover:bg-blue-400 border-blue-500 text-white",
  electric: "bg-yellow-400 hover:bg-yellow-300 border-yellow-400 text-black",
  grass: "bg-green-500 hover:bg-green-400 border-green-500 text-white",
  ice: "bg-cyan-400 hover:bg-cyan-300 border-cyan-400 text-black",
  fighting: "bg-red-700 hover:bg-red-600 border-red-700 text-white",
  poison: "bg-purple-500 hover:bg-purple-400 border-purple-500 text-white",
  ground: "bg-yellow-700 hover:bg-yellow-600 border-yellow-700 text-white",
  flying: "bg-indigo-400 hover:bg-indigo-300 border-indigo-400 text-white",
  psychic: "bg-pink-500 hover:bg-pink-400 border-pink-500 text-white",
  bug: "bg-lime-500 hover:bg-lime-400 border-lime-500 text-black",
  rock: "bg-yellow-800 hover:bg-yellow-700 border-yellow-800 text-white",
  ghost: "bg-purple-800 hover:bg-purple-700 border-purple-800 text-white",
  dragon: "bg-indigo-600 hover:bg-indigo-500 border-indigo-600 text-white",
  dark: "bg-gray-800 hover:bg-gray-700 border-gray-700 text-white",
  steel: "bg-slate-500 hover:bg-slate-400 border-slate-500 text-white",
  fairy: "bg-pink-300 hover:bg-pink-200 border-pink-300 text-black",
};

export default function PokemonList({ page }: { page: number }) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<PokemonType | "all">("all");

  // Query 1: todos los Pokémon paginados
  const allPokemonQuery = useQuery(pokemonListOptions(page));

  // Query 2: Pokémon de un tipo (solo activa si hay filtro)
  const typeQuery = useQuery({
    ...pokemonByTypeOptions(selectedType as PokemonType),
    enabled: selectedType !== "all",
  });

  const activeQuery = selectedType === "all" ? allPokemonQuery : typeQuery;
  const { data, isPending, isError, error } = activeQuery;

  // ─── Estados de carga y error ───
  if (isPending) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/5] animate-pulse rounded-2xl border border-white/10 bg-gray-900/50"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
        <p className="text-lg font-semibold text-red-400">¡Algo salió mal!</p>
        <p className="mt-2 text-sm text-gray-300">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // ─── Normalizar datos según el modo (con type narrowing) ───
  let results: PokemonListItem[] = [];
  let totalCount = 0;
  let totalPages = 1;

  if (selectedType === "all") {
    // data es PokemonListResponse
    const listData = data as PokemonListResponse;
    results = listData.results;
    totalCount = listData.count;
    totalPages = Math.ceil(totalCount / PAGE_SIZE);
  } else {
    // data es PokemonListItem[]
    results = data as PokemonListItem[];
    totalCount = results.length;
  }

  // Filtro por búsqueda
  const filteredResults = results.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Filtros por tipo */}
      <div className="mb-6">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
          Filtrar por tipo
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedType("all")}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
              selectedType === "all"
                ? "scale-110 border-red-600 bg-red-600 text-white shadow-lg shadow-red-500/30"
                : "border-white/10 bg-gray-900 text-white hover:border-red-500/50 hover:bg-gray-800"
            }`}
          >
            Todos
          </button>

          {POKEMON_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelectedType(type);
                setSearch("");
              }}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold capitalize transition-all ${
                selectedType === type
                  ? `${TYPE_BUTTON_COLORS[type]} scale-110 shadow-lg`
                  : "border-white/10 bg-gray-900 text-gray-300 hover:bg-gray-800"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="mx-auto mb-6 max-w-md">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar Pokémon por nombre..."
            className="w-full rounded-full border border-white/10 bg-gray-900/80 py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-500 transition hover:bg-white/10 hover:text-white"
              aria-label="Limpiar búsqueda"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Contador */}
      <p className="mb-4 text-center text-sm text-gray-400">
        {selectedType !== "all" && (
          <span className="capitalize">
            Tipo{" "}
            <span className="font-semibold text-white">{selectedType}</span> ·{" "}
          </span>
        )}
        {search
          ? `Mostrando ${filteredResults.length} resultado${
              filteredResults.length !== 1 ? "s" : ""
            }`
          : selectedType === "all"
          ? `Mostrando ${results.length} de ${totalCount} Pokémon`
          : `${totalCount} Pokémon en total`}
      </p>

      {/* Grid */}
      {filteredResults.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-5xl">🔍</p>
          <p className="mt-4 text-lg font-semibold text-white">
            No se encontró ningún Pokémon
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Prueba con otro nombre o cambia el filtro
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredResults.map((p, index) => (
            <div
              key={p.name}
              className="animate-fade-in-up"
              style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
            >
              <PokemonCard name={p.name} id={getIdFromUrl(p.url)} />
            </div>
          ))}
        </div>
      )}

      {/* Paginación (solo sin filtro de tipo) */}
      {selectedType === "all" && !search && (
        <nav className="mt-12 flex items-center justify-center gap-3">
          {page > 1 ? (
            <Link
              href={`/?page=${page - 1}`}
              className="rounded-full border border-white/20 bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:border-red-500 hover:bg-red-500/10"
            >
              ← Anterior
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded-full border border-white/10 bg-gray-900/30 px-5 py-2 text-sm font-semibold text-gray-600">
              ← Anterior
            </span>
          )}

          <span className="rounded-full bg-red-600/20 px-5 py-2 text-sm font-semibold text-red-400">
            Página {page} de {totalPages}
          </span>

          {page < totalPages ? (
            <Link
              href={`/?page=${page + 1}`}
              className="rounded-full border border-white/20 bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:border-red-500 hover:bg-red-500/10"
            >
              Siguiente →
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded-full border border-white/10 bg-gray-900/30 px-5 py-2 text-sm font-semibold text-gray-600">
              Siguiente →
            </span>
          )}
        </nav>
      )}
    </>
  );
}