import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDetail } from "../../api/user_api";
import ReviewForm from "../../components/Review_Rating/ReviewForm";
import ReviewList from "../../components/Review_Rating/ReviewList";

export default function CuisineDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { data: cuisine, isLoading, isError, error } = useQuery({
        queryKey: ["cuisine", slug],
        queryFn: () => getDetail("cuisines", slug),
        enabled: !!slug,
        retry: false,
    });

    const [descExpanded, setDescExpanded] = useState(false);
    const [descMaxHeight, setDescMaxHeight] = useState(300);
    const descRef = useRef();
    const [reviewsExpanded, setReviewsExpanded] = useState(false);
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [activeImage, setActiveImage] = useState(null);
    const [extraExpand, setExtraExpand] = useState(false);
    useLayoutEffect(() => {
        if (descExpanded && descRef.current) {
            setDescMaxHeight(descRef.current.scrollHeight);
        } else {
            setDescMaxHeight(300);
        }
    }, [descExpanded, cuisine?.description]);

    useEffect(() => {
        if (cuisine?.image) setActiveImage(cuisine.image);
    }, [cuisine]);

    const handleReviewAdded = () => {
        setReviewsExpanded(true);
        setTimeout(() => {
            document.getElementById("reviews-section")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 100);
    };

    useLayoutEffect(() => {
        if (extraExpand && descRef.current) {
            setDescMaxHeight(descRef.current.scrollHeight);
        } else {
            setDescMaxHeight(500);
        }
    }, [extraExpand, cuisine?.description]);
    const gallery =
        cuisine?.gallery?.length > 0
            ? cuisine.gallery
            : Array(4).fill(cuisine?.image || "https://placehold.co/300/amber/white?text=Ảnh");

    if (isLoading) {
        return (
            <div className="flex flex-col items-center py-28 text-cyan-600 font-bold text-xl">
                <div className="relative w-20 h-20 mb-6">
                    <div className="absolute top-0 left-0 w-full h-full border-8 border-cyan-200 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-8 border-t-transparent border-cyan-500 rounded-full animate-spin"></div>
                </div>
                <p className="animate-pulse">Đang chuẩn bị món ăn</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-20 bg-red-50">
                <div className="bg-white rounded-xl p-10 text-center shadow-xl max-w-md mx-auto">
                    <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-xl font-bold text-red-700 mb-2">Đã xảy ra lỗi</h3>
                    <p className="text-red-600 mb-6">{error?.message || "Có lỗi xảy ra khi tải thông tin món ăn"}</p>
                    <button
                        onClick={() => navigate("/am-thuc")}
                        className="px-5 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
                    >
                        Quay lại danh sách món ăn
                    </button>
                </div>
            </div>
        );
    }

    if (!cuisine) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-20 bg-amber-50">
                <div className="bg-white rounded-xl p-10 text-center shadow-xl max-w-md mx-auto">
                    <svg className="w-16 h-16 mx-auto text-amber-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-bold text-amber-700 mb-2">Không tìm thấy món ăn</h3>
                    <p className="text-amber-600 mb-6">Món ăn bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                    <button
                        onClick={() => navigate("/am-thuc")}
                        className="px-5 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
                    >
                        Xem danh sách món ăn khác
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="w-full h-[50vh] relative overflow-hidden">
                <img
                    src={cuisine.image || "https://placehold.co/1200x800/amber/white?text=Ẩm+Thực+Cà+Mau"}
                    alt={cuisine.name}
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <div className="max-w-7xl mx-auto">
                        <button
                            onClick={() => navigate("/am-thuc")}
                            className="mb-4 flex items-center text-white hover:text-amber-300 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Quay lại danh sách món ăn
                        </button>
                        <div className="flex items-center gap-2 mb-2">
                            {cuisine.tags?.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-amber-500 text-black text-xs font-medium rounded-full"
                                >
                                    {tag === "seafood" ? "Hải sản" : tag === "specialty" ? "Đặc sản" : tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
                            {cuisine.name}
                        </h1>
                        <div className="flex items-center text-white/90 text-sm md:text-base gap-4 mt-4">
                            <div className="flex items-center gap-1">
                                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span>Cà Mau, Việt Nam</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-12 -mt-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 bg-white rounded-2xl">
                        <div className="mb-12">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-1 bg-amber-500 rounded-full"></div>
                                <h2 className="text-2xl font-bold text-gray-800">Giới thiệu</h2>
                            </div>
                            <div
                                className="prose max-w-none prose-p:text-gray-600 prose-headings:text-gray-800 prose-img:rounded-lg prose-img:shadow-sm prose-a:text-blue-600 transition-all duration-300 overflow-hidden"
                                ref={descRef}
                                style={{
                                    maxHeight: `${descMaxHeight}px`
                                }}
                                dangerouslySetInnerHTML={{ __html: cuisine.description || "" }}
                            />
                            {!extraExpand && (
                                <div className="h-20 bg-gradient-to-t from-white to-transparent w-full -mt-20 relative pointer-events-none"></div>
                            )}

                            <div className="text-center mt-2">
                                <button
                                    onClick={() => setExtraExpand(!extraExpand)}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-all"
                                >
                                    {!extraExpand ? `Xem thêm` : `Thu gọn`}
                                    <svg className={`ml-1.5 w-4 h-4 transition-transform ${extraExpand ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div id="reviews-section" className="mt-8 pt-4">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-lg font-bold text-cyan-900">Đánh giá về địa điểm</h2>
                                <button
                                    onClick={() => setReviewsExpanded(v => !v)}
                                    className="text-cyan-600 hover:text-cyan-800 flex items-center text-sm"
                                >
                                    {reviewsExpanded ? "Thu gọn" : "Xem tất cả"}
                                    <svg className={`ml-1 w-4 h-4 transition-transform ${reviewsExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                            <ReviewForm entityType="food" entityId={cuisine.id || slug} onReviewAdded={handleReviewAdded} />
                            <div className={`mt-4 transition-all duration-300 overflow-hidden ${reviewsExpanded ? "max-h-[2000px]" : "max-h-[600px]"}`}>
                                <ReviewList entityType="food" entityId={cuisine.id || slug} />
                            </div>
                            {!reviewsExpanded && (
                                <div className="h-20 bg-gradient-to-t from-white to-transparent w-full -mt-20 relative pointer-events-none"></div>
                            )}
                            {!reviewsExpanded && (
                                <div className="text-center mt-2">
                                    <button
                                        onClick={() => setReviewsExpanded(true)}
                                        className="text-cyan-600 hover:text-cyan-800 text-sm font-medium inline-flex items-center"
                                    >
                                        Xem tất cả đánh giá
                                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-1 space-y-8">
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Hình ảnh</h3>
                                {(gallery.length > 4) && (
                                    <button
                                        className="text-amber-500 hover:text-amber-600 text-sm font-medium flex items-center gap-1"
                                        onClick={() => setShowImageViewer(true)}
                                    >
                                        Xem tất cả
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {gallery.slice(0, 4).map((image, idx) => (
                                    <div
                                        key={idx}
                                        className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                                        onClick={() => {
                                            setActiveImage(image);
                                            setShowImageViewer(true);
                                        }}
                                    >
                                        <img
                                            src={image || `https://placehold.co/300/amber/white?text=${idx + 1}`}
                                            alt={`${cuisine.name} ${idx + 1}`}
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Thông tin thêm</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                                    <span className="text-gray-600">Vùng miền</span>
                                    <span className="font-medium text-gray-800">Miền Tây Nam Bộ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showImageViewer && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <button
                        onClick={() => setShowImageViewer(false)}
                        className="absolute top-4 right-4 text-white hover:text-amber-400 transition-colors z-10"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="max-w-4xl w-full">
                        <div className="w-full aspect-[4/3] relative">
                            <img
                                src={activeImage || cuisine.image}
                                alt={cuisine.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="mt-6 flex justify-center">
                            <div className="grid grid-cols-6 gap-2">
                                {gallery.map((image, idx) => (
                                    <div
                                        key={idx}
                                        className={`aspect-square rounded overflow-hidden cursor-pointer border-2 ${activeImage === image ? "border-amber-500" : "border-transparent"}`}
                                        onClick={() => setActiveImage(image)}
                                    >
                                        <img
                                            src={image || `https://placehold.co/200/amber/white?text=${idx + 1}`}
                                            alt={`${cuisine.name} ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}