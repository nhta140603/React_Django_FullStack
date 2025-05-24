import React, { useEffect, useState } from "react";
import ArticleFilter from "../../components/Articles/ArticleFilter";
import LatestArticles from "../../components/Articles/LatestArticles";
import FeaturedEvent from "../../components/Articles/FeaturedEvents";
import ArticleCard from "../../components/Articles/ArticleCard";
import FilterBar from "../../components/Articles/FilterBar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";
import { useFetchList } from "../../hooks/useFetchList"
function MobileFilterDrawer({ open, onClose, children }) {
    return (
        <div className={`fixed inset-0 z-50 transition-all duration-200 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
            <div
                className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />
            <div className={`fixed bottom-0 left-0 w-full bg-white rounded-t-2xl max-h-[88vh] overflow-y-auto shadow-2xl transition-transform duration-200
                ${open ? "translate-y-0" : "translate-y-full"}`}>
                <div className="flex justify-between items-center px-5 pt-4 pb-2 border-b border-gray-100">
                    <span className="font-semibold text-lg">Bộ lọc</span>
                    <button className="text-gray-500 text-2xl leading-none" onClick={onClose}>&times;</button>
                </div>
                <div className="p-5">{children}</div>
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

    const { data, isLoading, error } = useFetchList('articles')
    useEffect(() => {
        if (data && data.count) setTotalPages(Math.max(1, Math.ceil(data.count / pageSize)));
    }, [data, pageSize]);

    const [filteredArticles, setFilteredArticles] = useState([]);
    useEffect(() => {
        if (!data || !data.results) return setFilteredArticles([]);
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

    const allArticles = data?.results || [];
    const events = allArticles.filter(article => article.type === 'event');

    const SkeletonCard = ({ viewType }) => (
        viewType === "grid" ? (
            <div className="bg-white rounded-xl shadow h-full">
                <div className="h-32 sm:h-40 w-full bg-gray-200 rounded-t-xl" />
                <div className="p-4 space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                    <div className="h-3 w-full bg-gray-200 rounded" />
                    <div className="h-3 w-1/2 bg-gray-200 rounded" />
                </div>
            </div>
        ) : (
            <div className="flex bg-white rounded-xl shadow overflow-hidden">
                <div className="w-1/3 md:w-1/4 bg-gray-200 h-24" />
                <div className="p-4 flex-1 space-y-2">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                    <div className="h-3 w-full bg-gray-200 rounded" />
                    <div className="h-3 w-1/2 bg-gray-200 rounded" />
                </div>
            </div>
        )
    );

    const Pagination = () => (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 bg-white px-4 py-3 mt-6 rounded-xl text-xs sm:text-sm gap-2">
            <div className="text-gray-600">
                Hiển thị <span className="font-semibold">{((page - 1) * pageSize) + 1}</span>
                {" – "}
                <span className="font-semibold">{Math.min(page * pageSize, data?.count || 0)}</span>
                {" trong "}
                <span className="font-semibold">{data?.count || 0}</span> bài viết
            </div>
            <div className="flex items-center gap-2">
                <select
                    value={pageSize}
                    onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                    className="rounded border-gray-300 bg-gray-50 px-2 py-1 text-xs sm:text-sm"
                >
                    {[5, 10, 20, 50, 100].map(size => (
                        <option key={size} value={size}>{size}/trang</option>
                    ))}
                </select>
                <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-1 rounded font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50"
                >Trước</button>
                <span className="mx-1 sm:mx-2 font-semibold">{page}/{totalPages}</span>
                <button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-3 py-1 rounded font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50"
                >Sau</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-6 sm:pb-12 text-gray-800 font-sans">
            <div className="w-full h-40 sm:h-64 md:h-96 relative overflow-hidden shadow mb-6 sm:mb-10">
                <img
                    src="https://fileapidulich.surelrn.vn/Upload/Banner/undefined/30/Picture/R637946840470742404.png"
                    alt="Cà Mau"
                    className="w-full h-full object-cover object-center"
                    draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-gray-700">Tin tức & Bài viết</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="mt-5 mb-6 sm:mb-10">
                    <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-6 md:mb-8 flex items-center gap-2">
                        <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-500 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="white" />
                            <line x1="7" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="2" />
                            <line x1="7" y1="13" x2="14" y2="13" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        Tin tức & Sự kiện
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-lg">
                        Cập nhật những thông tin và sự kiện mới nhất về du lịch, văn hóa và đời sống Cà Mau.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                    <aside className="hidden md:block w-full md:w-1/4">
                        <div className="sticky top-24 space-y-6">
                            <ArticleFilter
                                activeType={activeFilter}
                                onTypeChange={setActiveFilter}
                            />
                            <LatestArticles articles={allArticles} />
                            <FeaturedEvent events={events} />
                        </div>
                    </aside>

                    <main className="w-full md:w-3/4">
                        <div className="md:hidden flex justify-end mb-4">
                            <button
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition"
                                onClick={() => setDrawerOpen(true)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                Bộ lọc
                            </button>
                        </div>

                        <MobileFilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                            <ArticleFilter
                                activeType={activeFilter}
                                onTypeChange={type => {
                                    setActiveFilter(type);
                                    setDrawerOpen(false);
                                }}
                            />
                            <div className="mt-6 space-y-6">
                                <LatestArticles articles={allArticles} />
                                <FeaturedEvent events={events} />
                            </div>
                        </MobileFilterDrawer>

                        <div className="mb-3">
                            <FilterBar
                                onViewChange={setView}
                                count={filteredArticles.length}
                                view={view}
                                onSearch={setSearchQuery}
                                searchValue={searchQuery}
                            />
                        </div>

                        {isLoading ? (
                            <div className={`grid gap-4 ${view === "grid" ? "grid-cols-1 xs:grid-cols-2 sm:grid-cols-3" : "grid-cols-1"}`}>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <SkeletonCard key={i} viewType={view} />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="bg-red-100 text-red-700 p-6 rounded-lg text-center font-medium mt-6">
                                {error.message || "Đã xảy ra lỗi. Vui lòng thử lại."}
                            </div>
                        ) : filteredArticles.length === 0 ? (
                            <div className="bg-white p-7 rounded-xl shadow text-center mt-6">
                                <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-800">Không tìm thấy kết quả</h3>
                                <p className="text-gray-600 text-base mb-3">
                                    Vui lòng thử từ khóa khác hoặc xóa bộ lọc hiện tại.
                                </p>
                                {(activeFilter || searchQuery) && (
                                    <button
                                        onClick={() => { setActiveFilter(null); setSearchQuery(""); }}
                                        className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                                    >
                                        Xóa bộ lọc
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div>
                                <div className={`grid gap-4 ${view === "grid" ? "grid-cols-1 xs:grid-cols-2 sm:grid-cols-3" : "grid-cols-1"}`}>
                                    {filteredArticles.map(article => (
                                        <ArticleCard key={article.id} article={article} viewType={view} />
                                    ))}
                                </div>
                                <Pagination />
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}