import React, { useEffect, useState } from 'react';
import { getList } from "../api/user_api";
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { MotionItem } from "../components/MotionItem";
function ArticleSection({ limit }) {

  const { data: articles = [], isLoading: loading, error } = useQuery({
    queryKey: ['articles'],
    queryFn: () => getList('articles'),
    staleTime: 5 * 60 * 1000,
    retry: 2
  })

  const navigate = useNavigate();

  const skeletonCount = limit || 3;
  function SkeletonCard() {
    return (
      <div
        className="rounded-xl overflow-hidden shadow-xl animate-pulse bg-gray-100"
        style={{ minHeight: 320 }}
        aria-hidden="true"
      >
        <div className="w-full h-96 lg:h-80 bg-gray-300"></div>
      </div>
    );
  }
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-cyan-50 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <MotionItem>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Có gì mới tại Cà Mau</h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Khám phá những trải nghiệm độc đáo và đáng nhớ chỉ có tại vùng đất Cà Mau. Từ thiên nhiên hoang dã đến văn hóa bản địa và ẩm thực đặc sắc.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: skeletonCount }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))
              : error
                ? <div className="col-span-full text-center text-red-600">{error}</div>
                : (articles.results || []).slice(0, limit).map((article) => (
                  <div
                    key={article.id}
                    tabIndex={0}
                    role="button"
                    aria-label={`Xem chi tiết ${article.title}`}
                    onClick={() => {
                      if (article.type === "news") navigate(`/tin-tuc/${article.slug}`);
                      else navigate(`/su-kien/${article.slug}`);
                    }}
                    onKeyDown={e => {
                      if (e.key === "Enter" || e.key === " ") {
                        if (article.type === "news") navigate(`/tin-tuc/${article.slug}`);
                        else navigate(`/su-kien/${article.slug}`);
                      }
                    }}
                    className="group relative rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer outline-none focus:ring-4 focus:ring-cyan-200"
                    style={{ minHeight: 320 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                    <img
                      src={article.cover_image_url}
                      alt={article.title}
                      className="w-full h-96 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6 z-20">
                      <h3 className="text-2xl font-bold text-white mb-2">{article.title}</h3>
                      <p className="text-gray-200 opacity-90 mb-4 line-clamp-3">{article.description}</p>
                      <div className="text-white font-semibold flex items-center group-hover:text-cyan-300 transition-colors duration-200 pointer-events-none select-none">
                        Khám phá ngay
                        <svg className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </MotionItem>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </section>
  );
}

export default ArticleSection;