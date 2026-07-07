import { notFound } from "next/navigation";
import islandsData from "@/app/data/islands.json";
import IslandDetailClient from "@/components/IslandDetailClient";

interface IslandData {
  island: string;
}

export async function generateStaticParams() {
  return (islandsData as IslandData[]).map((island) => ({
    id: encodeURIComponent(island.island),
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function IslandDetailPage({ params }: PageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  // Check if this is a valid island in our database
  const islandExists = (islandsData as IslandData[]).some(
    (i) => i.island === decodedId
  );

  if (!islandExists) {
    notFound();
  }

  return <IslandDetailClient islandName={decodedId} />;
}
