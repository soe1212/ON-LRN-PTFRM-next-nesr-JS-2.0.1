import { Suspense } from 'react';
import { Hero } from '@/components/sections/hero';
import { FeaturedCourses } from '@/components/sections/featured-courses';
import { Categories } from '@/components/sections/categories';
import { Stats } from '@/components/sections/stats';
import { Testimonials } from '@/components/sections/testimonials';
import { Newsletter } from '@/components/sections/newsletter';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<LoadingSkeleton className="h-96" />}>
          <Stats />
        </Suspense>
        <Suspense fallback={<LoadingSkeleton className="h-96" />}>
          <Categories />
        </Suspense>
        <Suspense fallback={<LoadingSkeleton className="h-96" />}>
          <FeaturedCourses />
        </Suspense>
        <Suspense fallback={<LoadingSkeleton className="h-96" />}>
          <Testimonials />
        </Suspense>
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}