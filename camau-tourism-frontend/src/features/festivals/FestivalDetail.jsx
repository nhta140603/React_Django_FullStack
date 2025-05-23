import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetail } from "../../api/user_api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "../../components/ui/sheet";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "../../components/ui/accordion";

function EventHeroSection({ title, image, children }) {
  return (
    <div className="relative min-h-[240px] sm:min-h-[280px] md:min-h-[360px] rounded-xl overflow-hidden shadow-lg flex items-end">
      <img
        src={image || "/default-event-banner.jpg"}
        alt={title}
        className="absolute inset-0 object-cover w-full h-full z-0"
        style={{ filter: "brightness(0.75)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
      <div className="relative z-20 px-4 py-6 sm:py-8 w-full">
        <div className="flex items-center justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-block bg-cyan-600 text-white text-xs px-2 py-1 rounded-full shadow">
                Sự kiện nổi bật
              </span>
              <span className="inline-block bg-amber-500 text-white text-xs px-2 py-1 rounded-full shadow">
                Lễ hội & Văn hóa
              </span>
            </div>
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg mb-2 leading-tight">
              {title}
            </h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function CountdownTimer({ eventDate }) {
  const [timeLeft, setTimeLeft] = useState({});
  useEffect(() => {
    try {
      const calculateTimeLeft = () => {
        const targetDate = new Date(eventDate.split("-")[0].trim());
        const now = new Date();
        if (isNaN(targetDate.getTime())) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
        }
        const difference = targetDate - now;
        const isPast = difference < 0;
        if (isPast) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
        }
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          isPast: false,
        };
      };
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      setTimeLeft(calculateTimeLeft());
      return () => clearInterval(timer);
    } catch (error) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }
  }, [eventDate]);

  if (!eventDate || timeLeft.isPast) return null;

  return (
    <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
      <h3 className="text-base sm:text-lg text-white mb-3 font-medium">Sự kiện bắt đầu sau:</h3>
      <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
        {["Ngày", "Giờ", "Phút", "Giây"].map((label, idx) => (
          <div
            key={label}
            className="bg-gradient-to-br from-cyan-600 to-cyan-700 p-2 sm:p-3 rounded-lg shadow-lg"
          >
            <div className="text-xl sm:text-2xl font-bold text-white">
              {[
                timeLeft.days,
                timeLeft.hours,
                timeLeft.minutes,
                timeLeft.seconds,
              ][idx]}
            </div>
            <div className="text-xs text-cyan-100">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventInfoCard({ icon, title, value }) {
  return (
    <div className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
      <div className="bg-cyan-100 p-3 rounded-full mr-4 text-cyan-700">{icon}</div>
      <div>
        <h3 className="text-xs sm:text-sm text-gray-500 mb-1">{title}</h3>
        <p className="font-medium text-gray-800 text-sm sm:text-base break-words">{value}</p>
      </div>
    </div>
  );
}

function EventMobileSheet({ event, formattedDate, address, handleAddToCalendar, handleShareEvent }) {
  return (
    <SheetContent side="bottom" className="p-0 rounded-t-xl">
      <SheetHeader className="px-4 pt-4 pb-2 border-b">
        <SheetTitle className="text-xl text-cyan-800">Thông tin sự kiện</SheetTitle>
      </SheetHeader>
      <div className="px-4 py-4">
        <div className="flex flex-col gap-3">
          <EventInfoCard
            icon={
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
            title="Thời gian"
            value={formattedDate}
          />
          <EventInfoCard
            icon={
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            }
            title="Địa điểm"
            value={address || "Đang cập nhật"}
          />
          <div className="flex gap-3 mt-2">
            <button
              onClick={handleAddToCalendar}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg shadow-md text-sm font-medium transition-all"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Thêm vào lịch
            </button>
            <button
              onClick={handleShareEvent}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white rounded-lg shadow-md text-sm font-medium transition-all"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Chia sẻ
            </button>
          </div>
        </div>
      </div>
    </SheetContent>
  );
}

export default function FestivalDetail() {
  const { id, slug } = useParams();
  const [openSheet, setOpenSheet] = useState(false);

  const {
    data: event,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["festivalDetail", slug],
    queryFn: () => getDetail("festivals", slug),
    enabled: !!slug,
    retry: false,
    onError: () => toast.error("Không tìm thấy sự kiện!"),
  });

  const handleShareEvent = () => {
    if (!event) return;
    if (navigator.share) {
      navigator
        .share({
          title: event.title,
          text: `Khám phá sự kiện: ${event.title}`,
          url: window.location.href,
        })
        .catch((error) => toast.error("Không thể chia sẻ: " + error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép liên kết vào clipboard!");
    }
  };

  const handleAddToCalendar = () => {
    try {
      if (!event) return;
      let dateStr = event.event_date;
      let dateObj = null;

      const dateMatch = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
      if (dateMatch) {
        dateObj = new Date(`${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`);
      }

      let timeStr = "";
      const timeMatch = dateStr.match(/(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        timeStr = `T${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}:00`;
      } else {
        timeStr = "T090000";
      }

      if (dateObj && !isNaN(dateObj)) {
        const formattedDate =
          dateObj.toISOString().split("T")[0] + timeStr;
        const endTime =
          new Date(dateObj.getTime() + 2 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0] +
          timeStr.replace(/\d{2}:/, (h) => {
            const hour = parseInt(h) + 2;
            return `${hour.toString().padStart(2, "0")}:`;
          });

        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
          event.title
        )}&dates=${formattedDate.replace(/[-:]/g, "")}/${endTime.replace(
          /[-:]/g,
          ""
        )}&details=${encodeURIComponent(
          event.description ? event.description.replace(/<[^>]*>/g, "") : ""
        )}&location=${encodeURIComponent(event.address || "")}`;
        window.open(calendarUrl, "_blank");
      } else {
        toast.warning(
          "Không thể xác định ngày chính xác. Vui lòng thêm thủ công vào lịch."
        );
      }
    } catch (error) {
      toast.error("Không thể thêm vào lịch!");
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64 bg-gradient-to-r from-cyan-50 to-blue-50">
        <div className="flex flex-col items-center">
          <span className="animate-spin rounded-full h-10 w-10 border-4 border-cyan-600 border-t-transparent"></span>
          <p className="mt-4 text-cyan-800 font-medium">Đang tải thông tin sự kiện...</p>
        </div>
      </div>
    );

  if (isError || !event)
    return (
      <div className="text-center py-16 md:py-24 bg-gradient-to-r from-cyan-50 to-blue-50">
        <div className="inline-block p-5 rounded-full bg-red-100 mb-4 animate-pulse">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-2">Không tìm thấy sự kiện</h2>
        <p className="text-gray-600 mx-auto max-w-md">Sự kiện có thể đã bị xóa hoặc không tồn tại. Vui lòng kiểm tra lại đường dẫn hoặc quay lại trang chính.</p>
      </div>
    );

  const eventImage = event.image_url || "/default-event-image.jpg";
  const address = event.address || "";
  const hasAddress = address && address.trim().length > 4;
  const mapSrc = hasAddress
    ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=16&output=embed`
    : null;

  let formattedDate = event.event_date || "Đang cập nhật";
  if (formattedDate.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}/)) {
  } else if (formattedDate.match(/\d{4}-\d{2}-\d{2}/)) {
    const parts = formattedDate.split("-");
    formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-cyan-50 py-8">
      <div className="max-w-2xl md:max-w-7xl mx-auto px-3 sm:px-4 md:px-5">
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/danh-sach-dia-diem">Lễ Hội</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{event.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="py-4 md:py-6 relative">
          <EventHeroSection title={event.title} image={eventImage}>
            <div className="hidden md:block">
              <CountdownTimer eventDate={formattedDate} />
            </div>
            <div className="block md:hidden">
              <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                <SheetTrigger asChild>
                  <button
                    className="ml-2 flex items-center px-3 py-2 bg-white/90 border border-cyan-100 rounded-full shadow-md text-cyan-700 text-xs font-bold hover:bg-white backdrop-blur-sm transition-all"
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    Thông tin
                  </button>
                </SheetTrigger>
                <EventMobileSheet
                  event={event}
                  formattedDate={formattedDate}
                  address={address}
                  handleAddToCalendar={handleAddToCalendar}
                  handleShareEvent={handleShareEvent}
                />
              </Sheet>
            </div>
          </EventHeroSection>
        </div>

        <div className="md:hidden mt-4 mb-6">
          <div className="mb-5 bg-gradient-to-r from-cyan-600 to-cyan-700 p-4 rounded-xl shadow-lg">
            <CountdownTimer eventDate={formattedDate} />
          </div>

          <Accordion type="multiple" defaultValue={["time", "desc"]} className="rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white">
            <AccordionItem value="time" className="border-b border-gray-200">
              <AccordionTrigger className="px-4 py-3 hover:bg-cyan-50 transition-colors">
                <span className="font-semibold text-cyan-800 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Thời gian & địa điểm
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3">
                <div className="py-2 space-y-3">
                  <EventInfoCard
                    icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
                    title="Thời gian"
                    value={formattedDate}
                  />
                  <EventInfoCard
                    icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>}
                    title="Địa điểm"
                    value={address || "Đang cập nhật"}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="desc" className="border-b border-gray-200">
              <AccordionTrigger className="px-4 py-3 hover:bg-cyan-50 transition-colors">
                <span className="font-semibold text-cyan-800 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Chi tiết sự kiện
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-2 py-3">
                <div
                  className="prose max-w-none prose-img:rounded-xl prose-headings:text-cyan-700 prose-headings:font-semibold prose-a:text-cyan-600 prose-a:no-underline prose-table:rounded-lg prose-p:text-gray-600 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: event.description || "<p>Chưa có thông tin chi tiết.</p>",
                  }}
                />
              </AccordionContent>
            </AccordionItem>

            {mapSrc &&
              <AccordionItem value="map">
                <AccordionTrigger className="px-4 py-3 hover:bg-cyan-50 transition-colors">
                  <span className="font-semibold text-cyan-800 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Vị trí sự kiện
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-3 py-3">
                  <div className="rounded-xl overflow-hidden shadow-md mb-2 border border-gray-200">
                    <div className="w-full h-64">
                      <iframe
                        src={mapSrc}
                        className="w-full h-full border-0"
                        frameBorder="0"
                        allowFullScreen
                        aria-hidden="false"
                        tabIndex="0"
                        title="Google Map"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            }

            <AccordionItem value="note">
              <AccordionTrigger className="px-4 py-3 hover:bg-cyan-50 transition-colors">
                <span className="font-semibold text-cyan-800 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Lưu ý khi tham gia
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4">
                <ul className="text-sm text-gray-600 space-y-3 bg-amber-50 p-4 rounded-lg">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Kiểm tra thời gian sự kiện trước khi đi để không bỏ lỡ các hoạt động chính</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    <span>Đến sớm để tránh đông đúc và có vị trí thuận lợi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Sự kiện có thể thay đổi nếu có thông báo từ ban tổ chức</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddToCalendar}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg shadow-md text-sm font-medium transition-all"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Thêm vào lịch
            </button>
            <button
              onClick={handleShareEvent}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white rounded-lg shadow-md text-sm font-medium transition-all"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Chia sẻ
            </button>
          </div>
        </div>

        <div className="hidden md:block pb-10">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
            <div className="grid grid-cols-3 gap-0">
              <div className="col-span-2 p-6 border-r border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-amber-50 p-3 rounded-full text-amber-600">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Thời gian diễn ra</h3>
                    <p className="font-semibold text-lg text-gray-800">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-cyan-50 p-3 rounded-full text-cyan-600">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Địa điểm</h3>
                    <p className="font-semibold text-lg text-gray-800">{address || "Đang cập nhật"}</p>
                  </div>
                </div>
              </div>
              <div className="col-span-1 flex flex-col justify-center items-center p-6">
                <div className="flex gap-3 w-full mb-4">
                  <button
                    onClick={handleAddToCalendar}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg shadow-md text-sm font-medium transition-all"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Thêm vào lịch
                  </button>
                </div>
                <button
                  onClick={handleShareEvent}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white rounded-lg shadow-md text-sm font-medium transition-all"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  Chia sẻ sự kiện
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-6">
                <div className="border-b border-gray-100">
                  <h2 className="text-xl font-bold text-cyan-800 p-5 flex items-center">
                    <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Chi tiết sự kiện
                  </h2>
                </div>
                <div className="p-5">
                  <div
                    className="prose max-w-none prose-img:rounded-xl prose-img:shadow-md prose-headings:text-cyan-700 prose-headings:font-semibold prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline prose-table:rounded-lg prose-p:text-gray-600 text-base"
                    dangerouslySetInnerHTML={{
                      __html: event.description || "<p>Chưa có thông tin chi tiết.</p>",
                    }}
                  />
                </div>
              </div>

              <div className="bg-cyan-50 rounded-xl shadow-md overflow-hidden border border-cyan-100 p-5">
                <h3 className="font-bold text-cyan-800 mb-4 flex items-center text-lg">
                  <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Lưu ý quan trọng
                </h3>
                <ul className="text-cyan-700 space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-cyan-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Kiểm tra thời gian sự kiện trước khi đi để không bỏ lỡ các hoạt động chính</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-cyan-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Đến sớm để tránh đông đúc và có vị trí thuận lợi nhất</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-cyan-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Đăng ký thông tin để nhận cập nhật mới nhất về sự kiện</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-cyan-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Sự kiện có thể thay đổi nếu có thông báo từ ban tổ chức</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="md:sticky md:top-6 space-y-6">
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <img
                    src={eventImage}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-500">{formattedDate}</p>
                  </div>
                </div>

                {mapSrc && (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="border-b border-gray-100">
                      <h2 className="text-lg font-semibold text-cyan-800 p-4 flex items-center">
                        <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Vị trí sự kiện
                      </h2>
                    </div>
                    <div className="w-full h-48">
                      <iframe
                        src={mapSrc}
                        className="w-full h-full border-0"
                        frameBorder="0"
                        allowFullScreen
                        aria-hidden="false"
                        tabIndex="0"
                        title="Google Map"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                      <p className="text-sm text-gray-600">{address}</p>
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-md overflow-hidden text-white p-4">
                  <h3 className="font-bold mb-3 flex items-center text-lg">
                    <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Thông tin liên hệ
                  </h3>
                  <p className="text-white/90 mb-3">Có thắc mắc về sự kiện? Liên hệ với chúng tôi:</p>
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                    <div className="flex items-center mb-2">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">support@example.com</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm">0123 456 789</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}