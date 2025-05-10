import { Link, useSearchParams } from "react-router-dom";
import { getList } from "../../api/user_api";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
export default function LatestArticles({ articles }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-5">
      <h3 className="text-lg font-semibold mb-3">Bài viết mới nhất</h3>
      <div className="space-y-4">
        {articles.slice(0, 5).map(article => (
          <div key={article.id} className="flex items-start gap-3">
            <div className="h-14 w-20 flex-shrink-0">
              <img
                src={article.cover_image_url}
                alt={article.title}
                className="h-full w-full object-cover rounded"
              />
            </div>
            <div>
              {article.type === "event" ? (
                <Link
                  to={`/su-kien/${article.slug}`}
                  className="text-sm font-medium hover:text-blue-600 line-clamp-2"
                >
                  {article.title}
                </Link>
              ) : (
                <Link
                  to={`/tin-tuc/${article.slug}`}
                  className="text-sm font-medium hover:text-blue-600 line-clamp-2"
                >
                  {article.title}
                </Link>
              )}

              <p className="text-xs text-gray-500 mt-1">
                {format(new Date(article.created_at), 'dd/MM/yyyy', { locale: vi })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};