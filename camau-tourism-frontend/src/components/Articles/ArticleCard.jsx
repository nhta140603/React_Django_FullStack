import { format } from "date-fns";
import { Link } from "react-router-dom";
import { vi } from "date-fns/locale";
import formatDateFullVN from "../../utils/formatDate";
export default function ArticleCard({ article, viewType = "grid" }) {
  const articleUrl =
    article.type === "news"
      ? `/tin-tuc/${article.slug}`
      : `/su-kien/${article.slug}`;

  if (viewType === "grid") {
    return (
      <Link
        to={articleUrl}
        className="block h-full focus:outline-none group"
        aria-label={article.title}
        tabIndex={0}
      >
        <div className="bg-white rounded-lg shadow overflow-hidden h-full flex flex-col transition-transform group-hover:-translate-y-0.5">
          <div className="h-28 sm:h-48 w-full">
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-2 sm:p-4 flex-1 flex flex-col">
            <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <span
                className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[11px] sm:text-xs font-medium ${article.type === "news"
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                  }`}
              >
                {article.type === "news" ? "Tin tức" : "Sự kiện"}
              </span>
              <span className="text-[11px] sm:text-xs text-gray-500">
                {formatDateFullVN(article.created_at)}
              </span>
            </div>

            <div className="text-base sm:text-lg font-semibold group-hover:text-blue-600 mb-1 sm:mb-2">
              {article.title}
            </div>

            <div
              className="text-xs sm:text-sm text-gray-600 line-clamp-3 mb-2 sm:mb-3"
              dangerouslySetInnerHTML={{
                __html: article.content.substring(0, 120) + "...",
              }}
            />

            {article.type === "event" && article.event_date && (
              <div className="mt-auto bg-blue-50 p-1.5 sm:p-2 rounded flex items-center gap-1 sm:gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs sm:text-sm text-blue-700">
                  {formatDateFullVN(article.event_date)}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  } else {
    return (
      <Link
        to={articleUrl}
        className="block h-full focus:outline-none group"
        aria-label={article.title}
        tabIndex={0}
      >
        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-row transition-transform group-hover:-translate-y-0.5">
          <div className="w-1/3 md:w-1/4 min-h-[80px] sm:min-h-[112px]">
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-2 sm:p-4 flex-1 flex flex-col">
            <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <span
                className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[11px] sm:text-xs font-medium ${article.type === "news"
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                  }`}
              >
                {article.type === "news" ? "Tin tức" : "Sự kiện"}
              </span>
              <span className="text-[11px] sm:text-xs text-gray-500">
                {formatDateFullVN(article.created_at)}
              </span>
            </div>
            <div className="text-base sm:text-lg font-semibold group-hover:text-blue-600 mb-1 sm:mb-2 block">
              {article.title}
            </div>
            <div
              className="text-xs sm:text-sm text-gray-600 line-clamp-3 mb-2 sm:mb-3"
              dangerouslySetInnerHTML={{
                __html: article.content.substring(0, 160) + "...",
              }}
            />

            {article.type === "event" && article.event_date && (
              <div className="bg-blue-50 p-1.5 sm:p-2 rounded inline-flex items-center gap-1 sm:gap-2 mt-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs sm:text-sm text-blue-700">
                  {formatDateFullVN(article.event_date)}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }
}