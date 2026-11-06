import { Suspense } from 'react';
import { HomeOverview } from '@/components/features/home/HomeOverview';
import { getHomeOverview } from '@/services/homeService';
import { requireSession } from '@/services/sessionService';
import HomeLoading from './loading';

async function Home() {
  const { user } = await requireSession();
  const overview = await getHomeOverview(user.id);
  return (
    <HomeOverview
      overview={overview}
      today={new Date().toISOString().slice(0, 10)}
    />
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <Home />
    </Suspense>
  );
}
