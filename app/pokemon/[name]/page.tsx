import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { pokemonDetailOptions } from "@/lib/queries";
import PokemonDetailView from "@/components/pokemon-detail";

export default async function PokemonPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(pokemonDetailOptions(name));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PokemonDetailView name={name} />
    </HydrationBoundary>
  );
}