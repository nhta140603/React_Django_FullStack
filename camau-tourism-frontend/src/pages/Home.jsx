import React, {lazy, Suspense} from 'react';
import MainLayout from '../layouts/MainLayout';
import HeroSection from '../components/MainSection';
const FeaturedDestinations = React.memo(React.lazy(() => import('../components/Destinations')));
const TourSuggestions = React.lazy(() => import('../components/TourSuggestions'));
const PersonalTripSection = React.lazy(() => import('../components/PersonalTripSection'));
const ArticleSection = React.lazy(() => import('../components/ArticleSection'));
const CTASection = React.lazy(() => import('../components/CTASection'));
const FeaturedTours = React.lazy(() => import('../features/tours/FeaturedTours'));
import WeatherPostCast from '../components/WeatherPostCast'
function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <WeatherPostCast/>
      <Suspense fallback={null}>
        <FeaturedDestinations />
        <PersonalTripSection />
        <ArticleSection limit={3} />
        <CTASection />
        <FeaturedTours limit={3} showSearch={false} showBreadcrumb={false}/>
      </Suspense>
    </MainLayout>
  );
}
export default Home;