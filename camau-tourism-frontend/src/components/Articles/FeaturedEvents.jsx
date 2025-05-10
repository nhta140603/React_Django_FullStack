import { Link, useSearchParams } from "react-router-dom";

export default function FeaturedEvent({ events }){
    const upcomingEvents = events
      .filter(event => new Date(event.event_date) >= new Date())
      .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Sự kiện sắp diễn ra</h3>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.slice(0, 3).map(event => (
              <div key={event.id} className="border-b pb-3 last:border-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {format(new Date(event.event_date), 'dd/MM/yyyy', { locale: vi })}
                  </div>
                  <p className="text-xs text-gray-500">
                    {format(new Date(event.event_date), 'HH:mm', { locale: vi })}
                  </p>
                </div>
                <Link 
                  to={`/article/${event.slug}`}
                  className="text-sm font-medium hover:text-blue-600"
                >
                  {event.title}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Hiện không có sự kiện sắp diễn ra</p>
        )}
      </div>
    );
  };
  