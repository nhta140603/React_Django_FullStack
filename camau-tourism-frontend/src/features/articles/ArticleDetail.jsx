import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getDetail } from "../../api/user_api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/ui/drawer"

function ReadingProgress() {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateReadingProgress = () => {
      const currentPosition = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const percentage = (currentPosition / scrollHeight) * 100;
      setReadingProgress(percentage);
    };
    window.addEventListener("scroll", updateReadingProgress);
    return () => window.removeEventListener("scroll", updateReadingProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 z-50">
      <div
        className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all shadow-sm"
        style={{ width: `${readingProgress}%` }}
      ></div>
    </div>
  );
}

function ArticleHeading({ title, date, type, readTime }) {
  return (
    <div className="mb-6 sm:mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          type === 'news' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {type === 'news' ? 'Tin tức' : 'Sự kiện'}
        </span>
        <span className="text-gray-500 text-xs sm:text-sm flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {date}
        </span>
        <span className="text-gray-500 text-xs sm:text-sm flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {readTime} phút đọc
        </span>
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
        {title}
      </h1>
    </div>
  );
}

function SocialShareButtons() {
  return (
    <div className="flex items-center space-x-2 mt-4">
      <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
        </svg>
      </button>
      <button className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
        </svg>
      </button>
      <button className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.051 15.856c-1.034 0-2-.3-2.886-.859l-3.099 1.425.918-2.835c-.642-.935-1.034-2.075-1.034-3.324 0-3.155 2.705-5.715 6.051-5.715s6.051 2.56 6.051 5.715c0 3.154-2.705 5.715-6.051 5.715zm0-13.256c-4.45 0-8.051 3.536-8.051 7.715 0 1.699.546 3.324 1.559 4.667l-1.877 5.76 6-2.741c.785.412 1.604.714 2.455.851.303.034.605.051.914.051 4.45 0 8.051-3.535 8.051-7.715s-3.601-7.713-8.051-7.713zm3.5 9.715h-7c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h7c.276 0 .5.224.5.5s-.224.5-.5.5zm0-3h-7c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h7c.276 0 .5.224.5.5s-.224.5-.5.5z" />
        </svg>
      </button>
      <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7.5 5.6l-5 2v3.5l5-2v-3.5zm13 0l-5 2v3.5l5-2v-3.5z"></path>
          <path d="M23 8c0 1.1-.9 2-2 2-1.1 0-2-.9-2-2s.9-2 2-2c1.1 0 2 .9 2 2zm-15-1l5-2 5 2v11l-5 2-5-2v-11z"></path>
        </svg>
      </button>
      <button className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors ml-auto">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
        </svg>
      </button>
    </div>
  );
}

function RelatedArticles({ articles }) {
  return (
    <div className="mt-10 sm:mt-12 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        Bài viết liên quan
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/articles/${article.id}`}
            className="group flex flex-col h-full overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
          >
            <div className="relative h-40 sm:h-36 overflow-hidden">
              <img
                src={article.cover_image_url || "/default-article.jpg"}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-3">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                  article.type === 'news' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                }`}>
                  {article.type === 'news' ? 'Tin tức' : 'Sự kiện'}
                </span>
              </div>
            </div>
            <div className="p-4 bg-white flex-grow flex flex-col">
              <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors flex-grow">
                {article.title}
              </h3>
              <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100">
                <span>{new Date(article.created_at).toLocaleDateString('vi-VN')}</span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {Math.floor(Math.random() * 1000) + 100}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function TableOfContents({ mobileMode, onClickLink }) {
  const [toc, setToc] = useState([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll('.article-content h2, .article-content h3'));
    const tocItems = headings.map((heading) => ({
      id: heading.id,
      text: heading.textContent,
      level: heading.tagName === 'H2' ? 2 : 3,
    }));

    setToc(tocItems);
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );
    headings.forEach((heading) => observer.observe(heading));
    return () => headings.forEach((heading) => observer.unobserve(heading));
  }, []);

  if (toc.length === 0) return null;

  return (
    <div className={`${mobileMode ? '' : 'sticky top-5'}`}>
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Mục lục
        </h3>
        <ul className="space-y-1 border-l border-gray-100">
          {toc.map((item) => (
            <li
              key={item.id}
              className={`text-sm transition-all duration-200 ${item.level === 3 ? 'ml-3' : ''}`}
            >
              <a
                href={`#${item.id}`}
                className={`block py-1.5 px-3 rounded-r-md ${
                  activeId === item.id
                    ? 'text-orange-600 font-medium border-l-2 border-orange-500 -ml-[1px]'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
                onClick={onClickLink}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ArticleSidebarInfo({ article, eventDate, categoryLink, authorAvatar, authorName }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center">
          <img
            src={authorAvatar || "https://ui-avatars.com/api/?name=Admin&background=random"}
            alt={authorName}
            className="w-12 h-12 rounded-full mr-4 shadow-sm border-2 border-white"
          />
          <div>
            <p className="text-sm font-medium text-gray-500">Tác giả</p>
            <h3 className="font-bold text-gray-900 text-lg">{authorName || "Admin"}</h3>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 flex items-center mb-1">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Đăng tải: {format(new Date(article.created_at), 'HH:mm - dd/MM/yyyy', { locale: vi })}
          </p>
          {article.updated_at && article.updated_at !== article.created_at && (
            <p className="text-sm text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Cập nhật: {format(new Date(article.updated_at), 'HH:mm - dd/MM/yyyy', { locale: vi })}
            </p>
          )}
        </div>
      </div>

      {article.type === 'event' && eventDate && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-purple-100">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Thời gian diễn ra
          </h3>
          <div className="flex items-center justify-between bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-3 shadow-sm">
            <div className="text-center w-1/4">
              <div className="text-2xl font-bold text-purple-700">
                {format(new Date(eventDate), 'dd', { locale: vi })}
              </div>
              <div className="text-xs text-gray-500">
                {format(new Date(eventDate), 'MMM', { locale: vi })}
              </div>
            </div>
            <div className="text-center w-1/2">
              <div className="text-sm font-medium text-gray-800">
                {format(new Date(eventDate), 'EEEE', { locale: vi })}
              </div>
              <div className="text-base font-bold text-purple-700">
                {format(new Date(eventDate), 'HH:mm', { locale: vi })}
              </div>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white py-1.5 px-3 text-xs rounded-lg transition-colors shadow-sm flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Thêm lịch
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Danh mục
        </h3>
        <Link
          to={categoryLink || "#"}
          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg transition-colors border border-gray-100"
        >
          <span className="font-medium text-gray-700 text-base flex items-center">
            {article.type === 'news' ? (
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-6a2 2 0 00-2 2v12a2 2 0 002 2h6z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            {article.type === 'news' ? 'Tin tức' : 'Sự kiện'}
          </span>
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          Chia sẻ bài viết
        </h3>
        <div className="flex items-center justify-between">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
            </svg>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
            </svg>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
            </svg>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function QuickNavButtons() {
  return (
    <div className="fixed bottom-5 left-5 z-[100] flex flex-col space-y-2 lg:hidden">
      <button 
        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        className="bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-orange-600 transition-colors border border-gray-200"
        aria-label="Lên đầu trang"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
      </button>
    </div>
  );
}

function ArticleSidebar({ article, eventDate, categoryLink, authorAvatar, authorName }) {
  return (
    <div className="hidden lg:block lg:col-span-1">
      <div className="sticky top-5 space-y-6">
        <ArticleSidebarInfo
          article={article}
          eventDate={eventDate}
          categoryLink={categoryLink}
          authorAvatar={authorAvatar}
          authorName={authorName}
        />
        <TableOfContents />
      </div>
    </div>
  );
}

export default function ArticleDetailPage() {
  const { slug, id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const contentRef = useRef(null);

  const calculateReadingTime = (content) => {
    const text = content.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).length;
    const readingTime = Math.ceil(words / 200);
    return readingTime < 1 ? 1 : readingTime;
  };

  useEffect(() => {
    setLoading(true);
    getDetail("articles", slug)
      .then((data) => {
        setArticle(data);

        setTimeout(() => {
          if (contentRef.current) {
            const headings = contentRef.current.querySelectorAll("h2, h3");
            headings.forEach((heading, index) => {
              heading.id = `heading-${index}`;
            });
          }
        }, 100);

        fetch(`/api/articles?type=${data.type}&limit=3&exclude=${id}`)
          .then((res) => res.json())
          .then(setRelatedArticles)
          .catch(() => {
            setRelatedArticles([
              {
                id: 101,
                title: "Bài viết liên quan 1",
                type: data.type,
                cover_image_url: "https://source.unsplash.com/random/300x200?sig=1",
                created_at: new Date().toISOString(),
              },
              {
                id: 102,
                title: "Bài viết liên quan 2",
                type: data.type,
                cover_image_url: "https://source.unsplash.com/random/300x200?sig=2",
                created_at: new Date().toISOString(),
              },
              {
                id: 103,
                title: "Bài viết liên quan 3",
                type: data.type,
                cover_image_url: "https://source.unsplash.com/random/300x200?sig=3",
                created_at: new Date().toISOString(),
              },
            ]);
          });
      })
      .catch(() => toast.error("Không tìm thấy bài viết!"))
      .finally(() => setLoading(false));

    window.scrollTo(0, 0);
  }, [slug, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute top-0 left-0 w-full h-full border-8 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-8 border-orange-500 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="text-gray-600 font-medium">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 mb-6 text-gray-300">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Không tìm thấy bài viết</h1>
        <p className="text-gray-600 mb-6">Bài viết này có thể đã bị xóa hoặc không tồn tại.</p>
        <Link to="/news" className="px-5 py-2 bg-orange-600 text-white rounded-lg shadow-sm hover:bg-orange-700 transition-colors">
          Quay lại trang tin tức
        </Link>
      </div>
    );
  }

  const formattedDate = article.created_at
    ? format(new Date(article.created_at), "dd/MM/yyyy", { locale: vi })
    : "";
  const readTime = calculateReadingTime(article.content);
  const categoryLink = article.type === "news" ? "/tin-tuc-su-kien" : "/tin-tuc-su-kien";
  const eventDate = article.event_date ? new Date(article.event_date) : null;

  return (
    <div className="min-h-screen pb-16">
      <ReadingProgress />
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <button
            className="fixed bottom-5 right-5 z-[110] bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center transition-all lg:hidden"
            aria-label="Thông tin bài viết"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
            <DrawerTitle className="text-lg font-bold text-gray-800">Thông tin bài viết</DrawerTitle>
            <DrawerClose asChild>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Đóng"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </DrawerClose>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <ArticleSidebarInfo
              article={article}
              eventDate={eventDate}
              categoryLink={categoryLink}
              authorAvatar="https://ui-avatars.com/api/?name=Admin&background=f97316"
              authorName="Admin"
            />
            <div className="mt-4">
              <TableOfContents mobileMode onClickLink={() => setDrawerOpen(false)} />
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <QuickNavButtons />

      <div className="max-w-7xl mx-auto px-4 pt-5 sm:px-6 lg:px-8">
        <div className="sticky top-[68px] bg-white py-2 z-20">
          <Link
            to={categoryLink}
            className="inline-flex items-center text-sm text-gray-600 hover:text-orange-600 mb-2 transition-colors bg-white px-3 py-1 rounded-full shadow-sm"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại {article.type === "news" ? "tin tức" : "sự kiện"}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <ArticleHeading title={article.title} date={formattedDate} type={article.type} readTime={readTime} />

            {article.cover_image_url && (
              <div className="w-full rounded-xl overflow-hidden shadow-md bg-white p-2">
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={article.cover_image_url}
                    alt={article.title}
                    className="w-full object-cover h-[180px] sm:h-[320px] md:h-[450px] transition-all"
                    style={{ objectPosition: "center" }}
                  />
                </div>
                <SocialShareButtons />
              </div>
            )}

            <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-6 md:p-8">
                <div
                  ref={contentRef}
                  className="article-content prose prose-base sm:prose-lg max-w-none prose-headings:text-gray-800 prose-headings:font-bold prose-p:text-gray-700 prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t">
                  <span className="text-sm font-medium text-gray-700 mr-2 flex items-center">
                    <svg className="w-5 h-5 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Tags:
                  </span>
                  {["tin-tuc", "su-kien", "noi-bat"].map((tag) => (
                    <Link
                      key={tag}
                      to={`/tags/${tag}`}
                      className="px-3 py-1 hover:bg-orange-100 rounded-full text-sm text-gray-700 hover:text-orange-700 transition-colors border border-orange-100"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            </article>

            <RelatedArticles articles={relatedArticles} />
          </div>
          
          <ArticleSidebar
            article={article}
            eventDate={eventDate}
            categoryLink={categoryLink}
            authorAvatar="https://ui-avatars.com/api/?name=Admin&background=f97316"
            authorName="Admin"
          />
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}