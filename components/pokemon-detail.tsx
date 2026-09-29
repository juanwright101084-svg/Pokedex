"use client";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { pokemonDetailOptions } from "@/lib/queries";
import { artworkUrl, formatName } from "@/lib/pokeapi";

export default function PokemonDetailView({ name }: { name: string }) {
  const { data: p, isPending, isError, error } = useQuery(pokemonDetailOptions(name));

  if (isPending) return <p className="p-6">Cargando...</p>;
  if (isError) return <p className="p-6 text-red-600">Error: {error.message}</p>;

  const sprites = [p.sprites.front_default, p.sprites.back_default, p.sprites.front_shiny].filter(
    (s): s is string => Boolean(s)
  );

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <Link href="/" className="underline">← Volver</Link>

      <h1 className="text-3xl font-bold capitalize">#{p.id} {p.name}</h1>

      <div className="poke-idle inline-block drop-shadow-[0_10px_12px_rgba(255,255,255,0.2)]">
        <Image src={artworkUrl(p.id)} alt={p.name} width={250} height={250} priority />
      </div>

      <section>
        <h2 className="text-xl font-semibold">Tipos</h2>
        <p className="capitalize">{p.types.map((t) => t.type.name).join(", ")}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Habilidades</h2>
        <ul className="list-disc pl-6 capitalize">
          {p.abilities.map((a) => (
            <li key={a.ability.name}>
              {a.ability.name}{a.is_hidden && " (oculta)"}
            </li>
          ))}
        </ul>
      </section>

      {p.mainMove && (
        <section>
          <h2 className="text-xl font-semibold">Ataque principal</h2>
          <p className="capitalize">
            {formatName(p.mainMove.name)}
            <span className="ml-2 text-sm opacity-70">
              {p.mainMove.type} · Poder {p.mainMove.power ?? "—"}
            </span>
          </p>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold">Stats</h2>
        <div className="space-y-1">
          {p.stats.map((s) => (
            <div key={s.stat.name} className="flex items-center gap-2">
              <span className="w-36 capitalize">{s.stat.name}</span>
              <div
                className="h-2 rounded bg-blue-500"
                style={{ width: `${Math.min(s.base_stat, 200)}px` }}
              />
              <span>{s.base_stat}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Cadena evolutiva</h2>
        <p className="capitalize">{p.evolutions.join(" → ")}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Sprites</h2>
        <div className="flex gap-2">
          {sprites.map((src) => (
            <Image key={src} src={src} alt={`sprite de ${p.name}`} width={96} height={96} />
          ))}
        </div>
      </section>
    </main>
  );
}