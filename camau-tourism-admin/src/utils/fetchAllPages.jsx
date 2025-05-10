export async function fetchAllPages(apiFunc, resource, params = {}) {
  let page = 1;
  let allResults = [];
  let hasMore = true;
  while (hasMore) {
    const query = new URLSearchParams({ ...params, page, page_size: 100 }).toString();
    const res = await apiFunc(`${resource}/?${query}`);
    allResults = allResults.concat(res.results);
    if (allResults.length >= res.count || !res.next) {
      hasMore = false;
    } else {
      page += 1;
    }
  }
  return allResults;
}