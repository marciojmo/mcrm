import { Suspense } from 'react';
import { HomeOverview } from '@/components/features/home/HomeOverview';
import { getHomeOverview } from '@/services/homeService';
import { requireSession } from '@/services/sessionService';
import type { HomeView } from '@/types/home';
import HomeLoading from './loading';

function parseView(view: string | string[] | undefined): HomeView {
  return view === 'notifications' || view === 'deadlines' ? view : 'overview';
}

async function Home({
  searchParams,
}: {
  searchParams: PageProps<'/home'>['searchParams'];
}) {
  const view = parseView((await searchParams).view);
  const { user } = await requireSession();
  const today = new Date().toISOString().slice(0, 10);
  const overview = await getHomeOverview(user.id, user.name, today, view);
  return <HomeOverview overview={overview} today={today} view={view} />;
}

export default function HomePage({ searchParams }: PageProps<'/home'>) {
  return (
    <Suspense fallback={<HomeLoading />}>
      <Home searchParams={searchParams} />
    </Suspense>
  );
}
