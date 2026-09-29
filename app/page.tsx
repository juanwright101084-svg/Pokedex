import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { pokemonListOptions } from "@/lib/queries";
import PokemonList from "@/components/pokemon-list";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(pokemonListOptions(page));

  return (
    <div className="space-y-8">
      {/* Título y subtítulo */}
      <header className="text-center">
        <h2 className="text-3xl font-extrabold text-white md:text-4xl">
          Explora todos los Pokémon
        </h2>
        <p className="mt-2 text-sm text-gray-400 md:text-base">
          Descubre sus tipos, estadísticas y evoluciones
        </p>
      </header>

      {/* Lista de Pokémon */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PokemonList page={page} />
      </HydrationBoundary>
    </div>
  );
}