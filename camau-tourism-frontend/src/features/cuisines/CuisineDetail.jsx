import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDetail } from "../../api/user_api";
import ReviewForm from "../../components/Review_Rating/ReviewForm";
import ReviewList from "../../components/Review_Rating/ReviewList";
import { useDescriptionExpand } from "../../hooks/useDescriptionExpand";
import {DataLoader} from "../../hooks/useDataLoader"
export default function CuisineDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { data: cuisine, isLoading, isError, error } = useQuery({
        queryKey: ["cuisine", slug],
        queryFn: () => getDetail("cuisines", slug),
        enabled: !!slug,
        retry: false,
    });
    const [extraExpand, setExtraExpand] = useState(false);
    const { descRef, descMaxHeight } = useDescriptionExpand(
        extraExpand,
        cuisine?.description,
        300
    );

    const [reviewsExpanded, setReviewsExpanded] = useState(false);
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [activeImage, setActiveImage] = useState(null);

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

    const gallery =
        cuisine?.gallery?.length > 0
            ? cuisine.gallery
            : Array(4).fill(
                cuisine?.image ||
                "https://placehold.co/300/amber/white?text=Ảnh"
            );

    return (
        <DataLoader
            isLoading={isLoading}
            isError={isError}
        >
        <div className="min-h-screen bg-gray-50">
            <div className="w-full h-[38vh] md:h-[54vh] relative overflow-hidden">
                <img
                    src={cuisine?.image || "https://placehold.co/1200x800/amber/white?text=Ẩm+Thực+Cà+Mau"}
                    alt={cuisine?.name}
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full px-5 md:px-12 pb-7 md:pb-14">
                    <div className="max-w-7xl mx-auto space-y-2">
                        <button
                            onClick={() => navigate("/am-thuc")}
                            className="mb-2 flex items-center text-white hover:text-amber-300 text-base font-medium"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Quay lại danh sách món ăn
                        </button>
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                            {cuisine?.tags?.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-amber-500 text-black text-xs font-semibold rounded-full tracking-wide"
                                >
                                    {tag === "seafood" ? "Hải sản" : tag === "specialty" ? "Đặc sản" : tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg leading-tight mb-1">
                            {cuisine?.name}
                        </h1>
                        <div className="flex items-center text-white/90 text-sm md:text-base gap-5 mt-2">
                            <div className="flex items-center gap-1">
                                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Cà Mau, Việt Nam</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-3 md:px-7 py-8 md:py-16 -mt-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6 md:p-10">
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-1 bg-amber-500 rounded-full"></div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">Giới thiệu</h2>
                            </div>
                            <div
                                className="prose max-w-none prose-p:text-gray-700 prose-headings:text-gray-800 prose-img:rounded-lg prose-img:shadow-sm prose-a:text-blue-500 prose-a:font-normal transition-all duration-300 overflow-hidden text-base md:text-lg leading-relaxed"
                                ref={descRef}
                                style={{
                                    maxHeight: `${descMaxHeight}px`
                                }}
                                dangerouslySetInnerHTML={{ __html: cuisine?.description || "" }}
                            />
                            {!extraExpand && (
                                <div className="h-16 bg-gradient-to-t from-white to-transparent w-full -mt-16 relative pointer-events-none"></div>
                            )}
                            <div className="text-center mt-3">
                                <button
                                    onClick={() => setExtraExpand(!extraExpand)}
                                    className="inline-flex items-center px-5 py-2 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 transition"
                                >
                                    {!extraExpand ? `Xem thêm` : `Thu gọn`}
                                    <svg className={`ml-2 w-4 h-4 transition-transform ${extraExpand ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                            </div>
                        </section>

                        <section id="reviews-section" className="mt-12 pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl md:text-2xl font-bold text-cyan-900">Đánh giá về địa điểm</h2>
                                <button
                                    onClick={() => setReviewsExpanded(v => !v)}
                                    className="text-cyan-600 hover:text-cyan-800 flex items-center text-sm font-semibold"
                                >
                                    {reviewsExpanded ? "Thu gọn" : "Xem tất cả"}
                                    <svg className={`ml-1 w-4 h-4 transition-transform ${reviewsExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                            <ReviewForm entityType="food" entityId={cuisine?.id || slug} onReviewAdded={handleReviewAdded} />
                            <div className={`mt-5 transition-all duration-300 overflow-hidden ${reviewsExpanded ? "max-h-[2000px]" : "max-h-[440px]"}`}>
                                <ReviewList entityType="food" entityId={cuisine?.id || slug} />
                            </div>
                            {!reviewsExpanded && (
                                <>
                                    <div className="h-16 bg-gradient-to-t from-white to-transparent w-full -mt-16 relative pointer-events-none"></div>
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
                                </>
                            )}
                        </section>
                    </div>

                    <div className="md:col-span-1 space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg md:text-xl font-bold text-gray-900">Hình ảnh</h3>
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
                                        className="aspect-square rounded-lg overflow-hidden cursor-pointer border border-gray-100 hover:border-amber-400 transition"
                                        onClick={() => {
                                            setActiveImage(image);
                                            setShowImageViewer(true);
                                        }}
                                    >
                                        <img
                                            src={image || `https://placehold.co/300/amber/white?text=${idx + 1}`}
                                            alt={`${cuisine?.name} ${idx + 1}`}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Thông tin thêm</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                                    <span className="text-gray-600 font-medium">Vùng miền</span>
                                    <span className="font-semibold text-gray-800">Miền Tây Nam Bộ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showImageViewer && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
                    <button
                        onClick={() => setShowImageViewer(false)}
                        className="absolute top-5 right-5 text-white hover:text-amber-400 transition-colors z-10"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="max-w-4xl w-full">
                        <div className="w-full aspect-[4/3] relative bg-black/20 rounded-lg overflow-hidden shadow-lg">
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
        </DataLoader>
    );
}