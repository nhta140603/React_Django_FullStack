import React, { useEffect, useState } from 'react';
import { WiCloudy, WiDaySunny, WiRain, WiThunderstorm, WiDayHaze, WiNightClear } from 'weather-icons-react';

const apiKey = window.configs.API_KEY;
const LAT = 9.1755247;
const LON = 105.1047692;

function SkeletonWeather() {
  return (
    <section className="w-full relative z-2 top-[-25.9px] animate-pulse">
      <div className="max-w-2xl mx-auto h-[178px] rounded-2xl bg-gray-300/70 backdrop-blur-md shadow-lg p-6 flex flex-col justify-center">
        <div className="flex flex-col md:flex-row items-center md:items-stretch h-full">
          <div className="flex-1 flex flex-col justify-between h-full">
            <div className="flex justify-between items-center mb-2">
              <div className="h-6 w-32 bg-gray-400 rounded"></div>
              <div className="h-5 w-28 bg-gray-400 rounded"></div>
            </div>
            <div className="flex items-center gap-4 mb-2">
              <div className="h-12 w-12 bg-gray-400 rounded-full"></div>
              <div className="h-10 w-20 bg-gray-400 rounded"></div>
            </div>
            <div className="h-5 w-36 bg-gray-400 rounded"></div>
          </div>
          <div className="flex-1 flex items-center h-full">
            <div className="w-full grid grid-cols-2 gap-2 text-xs md:text-sm">
              {[...Array(8)].map((_, idx) => (
                <div key={idx} className="px-2 py-1 flex flex-row items-start space-x-1">
                  <div className="h-4 w-16 bg-gray-400 rounded"></div>
                  <div className="h-4 w-8 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WeatherPostCast() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    const getWeatherIcon = (code, isDay) => {
        if (code === 1000) {
            return isDay ? <WiDaySunny className="text-yellow-400 text-5xl md:text-6xl drop-shadow-md" /> : 
                          <WiNightClear className="text-blue-200 text-5xl md:text-6xl drop-shadow-md" />;
        } else if (code >= 1063 && code <= 1189) {
            return <WiRain className="text-blue-400 text-5xl md:text-6xl drop-shadow-md" />;
        } else if (code >= 1192 && code <= 1282) {
            return <WiThunderstorm className="text-gray-500 text-5xl md:text-6xl drop-shadow-md" />;
        } else if (code >= 1030 && code <= 1039) {
            return <WiDayHaze className="text-gray-400 text-5xl md:text-6xl drop-shadow-md" />;
        } else {
            return <WiCloudy className="text-white text-5xl md:text-6xl drop-shadow-md" />;
        }
    };

    const getBackgroundColor = (temp) => {
        if (temp >= 32) return 'bg-gradient-to-br from-orange-400 to-orange-600';
        if (temp >= 28) return 'bg-gradient-to-br from-yellow-400 to-orange-400';
        if (temp >= 24) return 'bg-gradient-to-br from-green-400 to-teal-500';
        return 'bg-gradient-to-br from-blue-400 to-cyan-500';
    };

    useEffect(() => {
        async function fetchWeather() {
            try {
                const res = await fetch(
                    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${LAT},${LON}&lang=vi`
                );
                const data = await res.json();
                setWeather(data);
            } catch (e) {
                setWeather(null);
            }
            setLoading(false);
        }
        fetchWeather();
    }, []);

    if (loading) return <SkeletonWeather/>
    if (!weather || !weather.current) return <div>Lỗi lấy dữ liệu thời tiết.</div>;

    const current = weather.current;
    const location = weather.location;
    const now = new Date(location.localtime);
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('vi-VN');
    const bgColor = getBackgroundColor(current.temp_c);

    let airQualityStatus = "Tốt";
    let airQualityColor = "text-green-400";
    if (current.humidity > 85 || current.cloud > 80) {
        airQualityStatus = "Trung bình";
        airQualityColor = "text-yellow-400";
    }
    if (current.humidity > 95 || current.cloud > 95) {
        airQualityStatus = "Kém";
        airQualityColor = "text-orange-400";
    }

    return (
        <section className="w-full relative z-2 top-[-25.9px]">
            <div className={`max-w-2xl mx-auto h-auto min-h-[178px] rounded-2xl ${bgColor} backdrop-blur-md shadow-xl p-6 flex flex-col justify-center`}>
                <div className="flex flex-col md:flex-row items-center md:items-stretch h-full">
                    <div className="flex-1 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-white text-lg md:text-xl flex basis-1/2 font-semibold drop-shadow-lg">
                                {location.name}, {location.country}
                            </div>
                            <div className="text-white text-sm md:text-base font-medium opacity-90 drop-shadow-lg text-wrap">
                                {timeStr}, {dateStr}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mb-2">
                            {getWeatherIcon(current.condition.code, current.is_day)}
                            <div className="flex items-end">
                                <span className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                                    {current.temp_c}
                                </span>
                                <span className="text-xl md:text-2xl text-white ml-1 mb-1 drop-shadow-lg">
                                    °C
                                </span>
                            </div>
                        </div>
                        <div className="text-white font-semibold text-sm md:text-base drop-shadow-lg">
                            {current.condition.text}
                        </div>
                        <div className={`${airQualityColor} font-semibold text-xs md:text-sm mt-1 drop-shadow-md`}>
                            Chất lượng không khí: {airQualityStatus}
                        </div>
                    </div>
                    <div className="flex-1 flex items-center h-full mt-4 md:mt-0">
                        <div className="w-full grid grid-cols-2 gap-2 text-white text-xs md:text-sm">
                            <div className="px-2 py-1 flex flex-row items-start space-x-1 bg-white/10 rounded-md">
                                <span className="font-medium text-nowrap">Độ ẩm:</span>
                                <span className="font-bold text-nowrap">{current.humidity}%</span>
                            </div>
                            <div className="px-2 py-1 flex flex-row items-start space-x-1 bg-white/10 rounded-md">
                                <span className="font-medium text-nowrap">Áp suất:</span>
                                <span className="font-bold text-nowrap">{current.pressure_mb} mb</span>
                            </div>
                            <div className="px-2 py-1 flex flex-row items-start space-x-1 bg-white/10 rounded-md">
                                <span className="font-medium text-nowrap">Gió:</span>
                                <span className="font-bold text-nowrap">{current.wind_kph} km/h</span>
                            </div>
                            <div className="px-2 py-1 flex flex-row items-start space-x-1 bg-white/10 rounded-md">
                                <span className="font-medium text-nowrap">Gió giật:</span>
                                <span className="font-bold text-nowrap">{current.gust_kph} km/h</span>
                            </div>
                            <div className="px-2 py-1 flex flex-row items-start space-x-1 bg-white/10 rounded-md">
                                <span className="font-medium text-nowrap">Mây:</span>
                                <span className="font-bold text-nowrap">{current.cloud}%</span>
                            </div>
                            <div className="px-2 py-1 flex flex-row items-start space-x-1 bg-white/10 rounded-md">
                                <span className="font-medium text-nowrap">Tầm nhìn:</span>
                                <span className="font-bold text-nowrap">{current.vis_km} km</span>
                            </div>
                            <div className="px-2 py-1 flex flex-row items-start space-x-1 bg-white/10 rounded-md">
                                <span className="font-medium text-nowrap">Chỉ số UV:</span>
                                <span className="font-bold text-nowrap">{current.uv}</span>
                            </div>
                            <div className="px-2 py-1 flex flex-row items-start space-x-1 bg-white/10 rounded-md">
                                <span className="font-medium text-nowrap">Cảm giác:</span>
                                <span className="font-bold text-nowrap">{current.feelslike_c}°C</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-white text-xs mt-3 text-center font-medium italic opacity-80">
                    Dữ liệu thời tiết Cà Mau - Cập nhật lúc {timeStr}
                </div>
            </div>
        </section>
    );
}

export default WeatherPostCast;