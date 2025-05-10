import { format } from "date-fns";
import { Link, useSearchParams } from "react-router-dom";
import { vi } from "date-fns/locale";
export default function ArticleCard({ article, viewType = "grid" }) {
  if (viewType === "grid") {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden h-full flex flex-col">
        <div className="h-48 w-full">
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${article.type === 'news' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
              }`}>
              {article.type === 'news' ? 'Tin tức' : 'Sự kiện'}
            </span>
            <span className="text-xs text-gray-500">
              {format(new Date(article.created_at), 'dd/MM/yyyy', { locale: vi })}
            </span>
          </div>

          <Link
            to={`/article/${article.slug}`}
            className="text-lg font-semibold hover:text-blue-600 mb-2"
          >
            {article.title}
          </Link>

          <div
            className="text-sm text-gray-600 line-clamp-3 mb-3"
            dangerouslySetInnerHTML={{
              __html: article.content.substring(0, 150) + '...'
            }}
          />

          {article.type === 'event' && article.event_date && (
            <div className="mt-auto bg-blue-50 p-2 rounded flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-blue-700">
                {format(new Date(article.event_date), 'dd/MM/yyyy - HH:mm', { locale: vi })}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden flex">
        <div className="w-1/3 md:w-1/4">
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-4 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${article.type === 'news' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
              }`}>
              {article.type === 'news' ? 'Tin tức' : 'Sự kiện'}
            </span>
            <span className="text-xs text-gray-500">
              {format(new Date(article.created_at), 'dd/MM/yyyy', { locale: vi })}
            </span>
          </div>
          {article.type === "event" ? (
            <Link
              to={`/su-kien/${article.slug}`}
              className="text-lg font-semibold hover:text-blue-600 mb-2 block"
            >
              {article.title}
            </Link>
          ) : (
            <Link
              to={`/tin-tuc/${article.slug}`}
              className="text-lg font-semibold hover:text-blue-600 mb-2 block"
            >
              {article.title}
            </Link>
          )}

          <div
            className="text-sm text-gray-600 line-clamp-3 mb-3"
            dangerouslySetInnerHTML={{
              __html: article.content.substring(0, 200) + '...'
            }}
          />

          {article.type === 'event' && article.event_date && (
            <div className="bg-blue-50 p-2 rounded inline-flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-blue-700">
                {format(new Date(article.event_date), 'dd/MM/yyyy - HH:mm', { locale: vi })}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
};
