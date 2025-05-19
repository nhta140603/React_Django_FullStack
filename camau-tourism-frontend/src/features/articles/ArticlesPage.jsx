import React, { useEffect, useState } from "react";
import { getPage } from "../../api/user_api";
import ArticleFilter from "../../components/Articles/ArticleFilter";
import LatestArticles from "../../components/Articles/LatestArticles";
import FeaturedEvent from "../../components/Articles/FeaturedEvents";
import ArticleCard from "../../components/Articles/ArticleCard";
import FilterBar from "../../components/Articles/FilterBar";
import { useQuery } from "@tanstack/react-query";

function MobileFilterDrawer({ open, onClose, children }) {
    return (
        <div className={`fixed inset-0 z-50 transition-all ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
            <div
                className={`absolute inset-0 bg-black bg-opacity-40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            ></div>
            <div className={`fixed bottom-0 left-0 w-full bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-xl transform transition-transform duration-200
                ${open ? "translate-y-0" : "translate-y-full"}`}>
                <div className="flex justify-between items-center px-4 pt-4 pb-2 border-b">
                    <span className="font-semibold text-lg">Bộ lọc</span>
                    <button className="text-gray-500 text-2xl" onClick={onClose}>&times;</button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}

export default function ArticlesPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [activeFilter, setActiveFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [view, setView] = useState("list");

    const [drawerOpen, setDrawerOpen] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ['articles', page, pageSize],
        queryFn: () => getPage('articles', page, pageSize),
        staleTime: 5 * 60 * 1000,
        retry: 2
    });

    useEffect(() => {
        if (data && data.count) {
            setTotalPages(Math.ceil(data.count / pageSize));
        }
    }, [data, pageSize]);

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

    const allArticles = data?.results || [];
    const events = allArticles.filter(article => article.type === 'event');

    const SkeletonCard = ({ viewType }) => (
        viewType === "grid" ? (
            <div className="bg-white rounded-lg shadow overflow-hidden h-full animate-pulse">
                <div className="h-32 sm:h-48 w-full bg-gray-200"></div>
                <div className="p-2 sm:p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-4 w-12 bg-gray-200 rounded"></div>
                        <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                </div>
            </div>
        ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden flex animate-pulse">
                <div className="w-1/3 md:w-1/4 bg-gray-200 h-24"></div>
                <div className="p-2 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-4 w-12 bg-gray-200 rounded"></div>
                        <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    );

    const Pagination = () => (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white px-2 sm:px-4 py-2 sm:py-3 mt-4 rounded-lg text-xs sm:text-sm">
            <div className="mb-2 sm:mb-0">
                <p className="text-gray-700">
                    Hiển thị <span className="font-medium">{((page - 1) * pageSize) + 1}</span> đến <span className="font-medium">{Math.min(page * pageSize, data?.count || 0)}</span> trong <span className="font-medium">{data?.count || 0}</span> bài viết
                </p>
            </div>
            <div className="flex items-center">
                <select
                    value={pageSize}
                    onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                    className="rounded border-gray-300 text-xs sm:text-sm mr-2 sm:mr-6"
                >
                    {[5, 10, 20, 50, 100].map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
                <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-2 py-1 text-xs sm:text-sm"
                >Trước</button>
                <span className="mx-1 sm:mx-2">{page}/{totalPages}</span>
                <button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-2 py-1 text-xs sm:text-sm"
                >Sau</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-4 sm:pb-10">
            <div className="w-full h-40 sm:h-72 md:h-96 relative overflow-hidden mb-5 sm:mb-10">
                <img
                    src="https://fileapidulich.surelrn.vn/Upload/Banner/undefined/30/Picture/R637946840470742404.png"
                    alt="Cà Mau"
                    className="w-full h-full object-cover object-center"
                />
            </div>
            <div className="max-w-7xl mx-auto px-2 sm:px-4">
                <div className="mb-3 sm:mb-8">
                    <h1 className="text-xl sm:text-3xl font-bold text-gray-800">Tin tức & Sự kiện</h1>
                    <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Cập nhật những thông tin và sự kiện mới nhất</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                    <div className="hidden md:block md:w-1/4">
                        <div className="sticky top-20">
                            <ArticleFilter
                                activeType={activeFilter}
                                onTypeChange={handleTypeChange}
                            />
                            <LatestArticles articles={allArticles} />
                            <FeaturedEvent events={events} />
                        </div>
                    </div>

                    <div className="w-full md:w-3/4">
                        <div className="md:hidden flex justify-between mb-3">
                            <button
                                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium shadow hover:bg-blue-700"
                                onClick={() => setDrawerOpen(true)}
                            >
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                                </svg>
                                Bộ lọc
                            </button>
                        </div>
                        <MobileFilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                            <ArticleFilter
                                activeType={activeFilter}
                                onTypeChange={type => {
                                    handleTypeChange(type);
                                    setDrawerOpen(false);
                                }}
                            />
                            <div className="mt-4">
                                <LatestArticles articles={allArticles} />
                                <FeaturedEvent events={events} />
                            </div>
                        </MobileFilterDrawer>

                        <FilterBar
                            onViewChange={handleViewChange}
                            count={filteredArticles.length}
                            view={view}
                            onSearch={setSearchQuery}
                            searchValue={searchQuery}
                            className="mb-2"
                        />

                        {isLoading ? (
                            <div className={`grid gap-3 sm:gap-5 ${view === "grid" ? "grid-cols-1 xs:grid-cols-2 sm:grid-cols-3" : "grid-cols-1"}`}>
                                {[...Array(6)].map((_, index) => (
                                    <SkeletonCard key={index} viewType={view} />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
                                {error.message || "Đã xảy ra lỗi"}
                            </div>
                        ) : filteredArticles.length === 0 ? (
                            <div className="bg-white p-5 sm:p-8 rounded-lg shadow text-center">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Không tìm thấy kết quả</h3>
                                <p className="text-gray-600 text-sm sm:text-base">Vui lòng thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc hiện tại.</p>
                                {(activeFilter || searchQuery) && (
                                    <button
                                        onClick={() => {
                                            setActiveFilter(null);
                                            setSearchQuery("");
                                        }}
                                        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                    >
                                        Xóa bộ lọc
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div>
                                <div className={`grid gap-3 sm:gap-5 ${view === "grid" ? "grid-cols-1 xs:grid-cols-2 sm:grid-cols-3" : "grid-cols-1"}`}>
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