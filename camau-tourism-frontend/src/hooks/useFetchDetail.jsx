import { useQuery } from '@tanstack/react-query';
import { getList, getDetail } from '../api/user_api';
export default function useFetchResource({ type, slug, subPath, options = {} }) {
    let queryKey = [type];
    let queryFn;

    if (slug && subPath) {
        queryKey = [type, slug, subPath];
        queryFn = () => getList(`${type}/${slug}/${subPath}`);
    } else if (slug) {
        queryKey = [type, slug];
        queryFn = () => getDetail(type, slug);
    } else {
        queryKey = [type];
        queryFn = () => getList(type);
    }

    return useQuery({
        queryKey,
        queryFn,
        staleTime: 5 * 60 * 1000,
        retry: 2,
        ...options,
    });
}