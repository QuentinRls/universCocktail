'use client';


import CocktailDetailClient from '@/components/CocktailDetailClient';

export default async function CocktailDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CocktailDetailClient id={id} />;
}