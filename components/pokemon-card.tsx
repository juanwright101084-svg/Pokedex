"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { pokemonDetailOptions } from "@/lib/queries";
import {
  animatedSpriteUrl,
  artworkUrl,
  formatName,
  hasAnimatedSprite,
} from "@/lib/pokeapi";

// Colores oficiales de cada tipo de Pokémon
const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  fire: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  water: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  electric: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  grass: "bg-green-500/20 text-green-300 border-green-500/30",
  ice: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  fighting: "bg-red-700/20 text-red-300 border-red-700/30",
  poison: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  ground: "bg-yellow-700/20 text-yellow-200 border-yellow-700/30",
  flying: "bg-indigo-400/20 text-indigo-300 border-indigo-400/30",
  psychic: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  bug: "bg-lime-500/20 text-lime-300 border-lime-500/30",
  rock: "bg-yellow-800/20 text-yellow-200 border-yellow-800/30",
  ghost: "bg-purple-800/20 text-purple-300 border-purple-800/30",
  dragon: "bg-indigo-600/20 text-indigo-300 border-indigo-600/30",
  dark: "bg-gray-800/40 text-gray-300 border-gray-700/50",
  steel: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  fairy: "bg-pink-300/20 text-pink-200 border-pink-300/30",
};

export default function PokemonCard({ name, id }: { name: string; id: number }) {
  const queryClient = useQueryClient();
  const [hovered, setHovered] = useState(false);
  const [wasHovered, setWasHovered] = useState(false);

  const { data } = useQuery({
    ...pokemonDetailOptions(name),
    enabled: wasHovered,
  });

  const animated = hovered && hasAnimatedSprite(id);

  return (
    <Link
      href={`/pokemon/${name}`}
      onMouseEnter={() => {
        setHovered(true);
        setWasHovered(true);
        queryClient.prefetchQuery(pokemonDetailOptions(name));
      }}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 p-4 text-center transition-all duration-300 hover:-translate-y-2 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/20"
    >
      {/* Número en la esquina superior derecha */}
      <span className="absolute right-3 top-3 text-xs font-bold text-gray-500 transition-colors group-hover:text-red-400">
        #{String(id).padStart(3, "0")}
      </span>

      {/* Imagen del Pokémon */}
      <div
        className={`mx-auto h-[120px] w-[120px] transition-transform duration-300 ${
          hovered ? "poke-float scale-110" : ""
        }`}
      >
        {animated ? (
          <Image
            src={animatedSpriteUrl(id)}
            alt={name}
            width={120}
            height={120}
            unoptimized
            className="h-full w-full object-contain"
            style={{ imageRendering: "pixelated" }}
          />
        ) : (
          <Image src={artworkUrl(id)} alt={name} width={120} height={120} />
        )}
      </div>

      {/* Nombre del Pokémon */}
      <p className="mt-3 font-semibold capitalize text-white transition-colors group-hover:text-red-400">
        {name}
      </p>

      {/* Tooltip en hover con detalles */}
      {hovered && data && (
        <div className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-56 -translate-x-1/2 rounded-xl border border-white/10 bg-neutral-900/95 p-3 text-left text-xs shadow-2xl backdrop-blur-md">
          {/* Tipos */}
          <div className="flex flex-wrap gap-1">
            {data.types.map((t) => (
              <span
                key={t.type.name}
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${
                  TYPE_COLORS[t.type.name] ??
                  "border-gray-500/30 bg-gray-500/20 text-gray-300"
                }`}
              >
                {t.type.name}
              </span>
            ))}
          </div>

          {/* Movimiento principal */}
          {data.mainMove && (
            <p className="mt-2 capitalize text-gray-300">
              ⚔️ {formatName(data.mainMove.name)}
              <span className="block text-[10px] opacity-70">
                {data.mainMove.type} · Poder {data.mainMove.power ?? "—"}
              </span>
            </p>
          )}

          {/* Evoluciones */}
          <p className="mt-2 border-t border-white/10 pt-2 text-[10px] capitalize text-gray-400">
            {data.evolutions.join(" → ")}
          </p>
        </div>
      )}
    </Link>
  );
}