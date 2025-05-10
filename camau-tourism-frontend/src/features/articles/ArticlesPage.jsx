import React, { useEffect, useState } from "react";
import { getPage } from "../../api/user_api";
import ArticleFilter from "../../components/Articles/ArticleFilter";
import LatestArticles from "../../components/Articles/LatestArticles";
import FeaturedEvent from "../../components/Articles/FeaturedEvents";
import ArticleCard from "../../components/Articles/ArticleCard";
import FilterBar from "../../components/Articles/FilterBar";
import { useQuery } from "@tanstack/react-query";

export default function ArticlesPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // For filter/search
    const [activeFilter, setActiveFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [view, setView] = useState("list");

    // Fetch paginated data
    const { data, isLoading, error } = useQuery({
        queryKey: ['articles', page, pageSize],
        queryFn: () => getPage('articles', page, pageSize),
        staleTime: 5 * 60 * 1000,
        retry: 2
    });

    // Calculate totalPages from API count
    useEffect(() => {
        if (data && data.count) {
            setTotalPages(Math.ceil(data.count / pageSize));
        }
    }, [data, pageSize]);

    // Filter articles on the current page
    const [filteredArticles, setFilteredArticles] = useState([]);
    useEffect(() => {
        if (!data || !data.results) {
            setFilteredArticles([]);
            return;
        }
        let filtered = [...data.results];
        if (activeFilter) {
            filtered = filtered.filter(article => article.type === activeFilter);
        }
        if (searchQuery) {
            filtered = filtered.filter(article =>
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.content.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setFilteredArticles(filtered);
    }, [activeFilter, searchQuery, data]);

    const handleTypeChange = (type) => setActiveFilter(type);
    const handleViewChange = (newView) => setView(newView);

    // For sidebar
    const allArticles = data?.results || [];
    const events = allArticles.filter(article => article.type === 'event');

    // Skeleton loader
    const SkeletonCard = ({ viewType }) => (
        viewType === "grid" ? (
            <div className="bg-white rounded-lg shadow overflow-hidden h-full animate-pulse">
                <div className="h-48 w-full bg-gray-200"></div>
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-16 bg-gray-200 rounded"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                </div>
            </div>
        ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden flex animate-pulse">
                <div className="w-1/3 md:w-1/4 bg-gray-200"></div>
                <div className="p-4 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-16 bg-gray-200 rounded"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    );

    // Pagination Component
    const Pagination = () => (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg">
            <div>
                <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{((page - 1) * pageSize) + 1}</span> đến <span className="font-medium">{Math.min(page * pageSize, data?.count || 0)}</span> trong <span className="font-medium">{data?.count || 0}</span> bài viết
                </p>
            </div>
            <div className="flex items-center">
                <select
                    value={pageSize}
                    onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                    className="rounded border-gray-300 text-sm mr-6"
                >
                    {[5, 10, 20, 50, 100].map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
                <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-2 py-1 text-sm"
                >Trước</button>
                <span className="mx-2">{page}/{totalPages}</span>
                <button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-2 py-1 text-sm"
                >Sau</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <div className="w-full h-full md:h-96 relative overflow-hidden mb-10">
                <img
                    src="https://fileapidulich.surelrn.vn/Upload/Banner/undefined/30/Picture/R637946840470742404.png"
                    alt="Cà Mau"
                    className="w-full h-full object-cover object-center"
                />
            </div>
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Tin tức & Sự kiện</h1>
                    <p className="text-gray-600 mt-2">Cập nhật những thông tin và sự kiện mới nhất</p>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4">
                        <div className="sticky top-20">
                            <ArticleFilter
                                activeType={activeFilter}
                                onTypeChange={handleTypeChange}
                            />
                            <LatestArticles articles={allArticles} />
                            <FeaturedEvent events={events} />
                        </div>
                    </div>

                    <div className="md:w-3/4">
                        <FilterBar
                            onViewChange={handleViewChange}
                            count={filteredArticles.length}
                            view={view}
                            onSearch={setSearchQuery}
                            searchValue={searchQuery}
                        />

                        {isLoading ? (
                            <div className={`grid gap-5 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : "grid-cols-1"}`}>
                                {[...Array(6)].map((_, index) => (
                                    <SkeletonCard key={index} viewType={view} />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
                                {error.message || "Đã xảy ra lỗi"}
                            </div>
                        ) : filteredArticles.length === 0 ? (
                            <div className="bg-white p-8 rounded-lg shadow text-center">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy kết quả</h3>
                                <p className="text-gray-600">Vui lòng thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc hiện tại.</p>
                                {(activeFilter || searchQuery) && (
                                    <button
                                        onClick={() => {
                                            setActiveFilter(null);
                                            setSearchQuery("");
                                        }}
                                        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Xóa bộ lọc
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div>
                                <div className={`grid gap-5 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : "grid-cols-1"}`}>
                                    {filteredArticles.map(article => (
                                        <ArticleCard key={article.id} article={article} viewType={view} />
                                    ))}
                                </div>
                                <Pagination />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}