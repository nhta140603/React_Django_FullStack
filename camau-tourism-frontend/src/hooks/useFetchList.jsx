import { useQuery } from '@tanstack/react-query';
import { getList } from '../api/user_api';

export function useFetchList(type) {
  return useQuery({
    queryKey: [type],
    queryFn: () => getList(type),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}