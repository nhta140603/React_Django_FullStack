import React, { useMemo, useState } from "react";
import FilterSidebar from "../../components/Hotels/HotelFilter";
import HotelCard from "../../components/Hotels/HotelCard"
import { getList } from "../../api/user_api"
import FilterBar from "../../components/Hotels/FilterBar";
import SaleBanner from "../../components/Hotels/SaleBanner";
import { useQuery } from "@tanstack/react-query";

export default function HotelListPage() {
  const { data: hotel = [], isLoading: loading, error } = useQuery({
    queryKey: ['hotel'],
    queryFn: () => getList('hotels'),
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  const [currentFilter, setCurrentFilter] = useState({
    priceInRange: [],
    hotelRatingStar: [],
    price: [],
  });

  const [filterPopulate, setFilterPopular] = useState({
    popular: [],
    view: "grid",
  });

  const filteredHotels = useMemo(() => {
    let result = [...hotel];
    if (currentFilter.priceInRange.length > 0) {
      result = result.filter(h => {
        let match = false;
        currentFilter.priceInRange.forEach(range => {
          if (range === "over2m" && h.min_price > 2000000) match = true
          if (range === "over1m" && h.min_price > 1000000) match = true
          if (range === "under500k" && h.min_price < 500000) match = true
        })
        return match
      })
    }
    if (currentFilter.hotelRatingStar.length > 0) {
      result = result.filter(h => {
        let match = false;
        currentFilter.hotelRatingStar.forEach(rating => {
          if (rating === 1 && h.star_rating == 1) match = true
          if (rating === 2 && h.star_rating == 2) match = true
          if (rating === 3 && h.star_rating == 3) match = true
          if (rating === 4 && h.star_rating == 4) match = true
          if (rating === 5 && h.star_rating == 5) match = true
        })
        return match
      })
    }
    if (typeof currentFilter.price === 'number' && currentFilter.price > 0) {
      result = result.filter(h => h.min_price <= currentFilter.price);
    }
    if (Array.isArray(filterPopulate.popular) && filterPopulate.popular.length > 0) {
      const sortType = filterPopulate.popular[0];
      if (sortType === "price-asc") {
        result.sort((a, b) => a.min_price - b.min_price);
      } else if (sortType === "price-desc") {
        result.sort((a, b) => b.min_price - a.min_price);
      }
    }
    return result;
  }, [hotel, currentFilter, filterPopulate]);

  const [filterLoading, setFilterLoading] = useState(false);

  React.useEffect(() => {
    setFilterLoading(true);
    const timer = setTimeout(() => {
      setFilterLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentFilter, filterPopulate, hotel]);

  const handleFilter = (filter) => {
    setCurrentFilter(filter);
  }

  const handleFilterPopular = (filter) => {
    setFilterPopular(filter)
  }

  const SkeletonCard = () => (
    <div className="animate-pulse rounded-xl bg-gray-100 h-40 mb-4 w-full max-w-4xl mx-auto" />
  );

  return (
    <div className="min-h-screen flex max-w-full mx-auto r-1ihkh82">
      <div className="min-h-screen flex gap-3 max-w-7xl mx-auto py-5 px-4 r-1ihkh82">
        <div className="hidden md:block w-80 ">
          <FilterSidebar onFilter={handleFilter} />
        </div>
        <main className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-items-end gap-3 sticky z-12 r-1pn2ns4a r-oyd9sga r-y285pga h-[55px]" style={{ top: '4.5rem' }}>
            <FilterBar onFilter={handleFilterPopular} count={filteredHotels.length} />
          </div>
          <SaleBanner />
          <div>
            {loading && <div></div>}
            {error && <div className="text-red-500">{error}</div>}
            {filterLoading ? (
              <>
                <SkeletonCard className="max-w-full h-[172px]" />
                <SkeletonCard className="max-w-full h-[172px]" />
                <SkeletonCard className="max-w-full h-[172px]" />
              </>
            ) : (
              <>
                {filteredHotels.length === 0 && !loading && (
                  <div className="mx-auto max-w-md mt-10 px-6 py-5 text-gray-800 rounded-xl text-center text-lg font-medium animate-fade-in">
                    Không tìm thấy khách sạn phù hợp
                  </div>
                )}
                <div className={`grid ${filterPopulate.view === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3" : "grid-cols-1"}`}>
                  {filteredHotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} view={filterPopulate.view} />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}