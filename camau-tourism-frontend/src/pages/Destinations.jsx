import React from 'react';
import MainLayout from '../layouts/MainLayout';
import FeaturedDestinations from "../features/destinations/FeaturedDestinations";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
const queryClient = new QueryClient();
function Destinations() {
  return (
    <MainLayout>
      <QueryClientProvider client={queryClient}>
        <FeaturedDestinations />
      </QueryClientProvider>
    </MainLayout>
  );
}

export default Destinations;