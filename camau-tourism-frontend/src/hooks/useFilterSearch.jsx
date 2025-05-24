import { useState, useMemo } from "react";

export function useFilterSearch(data, options = {}) {
  const { searchFields = [], filterField = "", filterOptions = [] } = options;
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(filterOptions.length ? filterOptions[0] : "");
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchFilter = !selectedFilter || selectedFilter === "all" || item[filterField] === selectedFilter;
      const matchSearch = !search || searchFields.some(field => {
        const val = item[field];
        return val && val.toString().toLowerCase().includes(search.toLowerCase());
      });

      return matchFilter && matchSearch;
    });
  }, [data, search, selectedFilter, searchFields, filterField]);

  return {
    search,
    setSearch,
    selectedFilter,
    setSelectedFilter,
    filteredData,
  };
}