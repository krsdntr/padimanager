import React, { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, Loader2, MapPin, ChevronDown, ChevronUp, Droplets, CloudLightning } from 'lucide-react';
import { useWeatherStore } from '../store/weatherStore';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';

const weatherCodes: Record<number, { label: string; icon: React.ReactNode }> = {
  0: { label: 'Cerah', icon: <Sun className="text-amber-500" /> },
  1: { label: 'Cerah Berawan', icon: <Cloud className="text-sky-400" /> },
  2: { label: 'Berawan', icon: <Cloud className="text-stone-400" /> },
  3: { label: 'Mendung', icon: <Cloud className="text-stone-500" /> },
  45: { label: 'Kabut', icon: <Cloud className="text-stone-400" /> },
  51: { label: 'Gerimis', icon: <CloudRain className="text-sky-500" /> },
  61: { label: 'Hujan Ringan', icon: <CloudRain className="text-sky-500" /> },
  63: { label: 'Hujan Sedang', icon: <CloudRain className="text-blue-500" /> },
  80: { label: 'Hujan Deras', icon: <CloudRain className="text-blue-600" /> },
  95: { label: 'Badai Petir', icon: <CloudLightning className="text-indigo-600" /> },
};

export default function WeatherWidget() {
  const { 
    currentWeather, 
    hourlyForecast, 
    dailyForecast, 
    locationName, 
    isLoading, 
    error, 
    fetchWeather 
  } = useWeatherStore();

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  if (isLoading && !currentWeather) {
    return (
      <div className="flex items-center justify-center rounded-full bg-white border border-emerald-100 p-4 shadow-sm mb-6">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
        <span className="ml-2 text-sm text-stone-500">Memuat cuaca...</span>
      </div>
    );
  }

  const weatherInfo = weatherCodes[currentWeather?.weathercode || 0] || weatherCodes[0];
  const currentPrecip = hourlyForecast[0]?.precipitation_probability || 0;

  return (
    <div className="mb-8 bg-white border border-emerald-100 rounded-[2rem] shadow-sm overflow-hidden transition-all">
      {/* Capsule Header */}
      <div 
        className="p-3 flex items-center justify-between cursor-pointer hover:bg-emerald-50/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 bg-emerald-50 rounded-full">
            {React.cloneElement(weatherInfo.icon as React.ReactElement, { size: 24 })}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-stone-800 text-lg">{Math.round(currentWeather?.temperature || 0)}°C</span>
              <span className="text-sm font-medium text-stone-600">{weatherInfo.label}</span>
            </div>
            <div className="text-xs text-stone-400 flex items-center gap-1">
              <MapPin size={10} /> {locationName || 'Lokasi'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pr-2">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Hujan</span>
            <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
              <Droplets size={14} /> {currentPrecip}%
            </span>
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-50 text-stone-400">
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-emerald-50 bg-stone-50/50"
          >
            <div className="p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">Prakiraan Presipitasi (15 Jam)</h4>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {hourlyForecast.map((hour, idx) => {
                  const info = weatherCodes[hour.weathercode] || weatherCodes[0];
                  const time = hour.time ? format(parseISO(hour.time), 'HH:mm') : '';
                  const precip = hour.precipitation_probability || 0;
                  
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 min-w-[50px] snap-center">
                      <span className="text-xs text-stone-500">{idx === 0 ? 'Sek' : time}</span>
                      {React.cloneElement(info.icon as React.ReactElement, { size: 20 })}
                      <div className="flex flex-col items-center mt-1">
                        <span className="text-xs font-bold text-emerald-600">{precip}%</span>
                        <span className="text-[10px] text-stone-400">{Math.round(hour.temperature)}°</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 mt-2">7 Hari Kedepan</h4>
              <div className="flex flex-col gap-2">
                {dailyForecast.map((day, idx) => {
                  const info = weatherCodes[day.weathercode] || weatherCodes[0];
                  const dayName = idx === 0 ? 'Hari Ini' : format(parseISO(day.time), 'EEEE', { locale: id });
                  const precip = day.precipitation_probability_max || 0;
                  
                  return (
                    <div key={idx} className="flex items-center justify-between text-sm p-2 rounded-xl hover:bg-white transition-colors">
                      <span className="w-24 font-medium text-stone-700">{dayName}</span>
                      <div className="flex items-center gap-2 flex-1 justify-center">
                        {React.cloneElement(info.icon as React.ReactElement, { size: 18 })}
                        <span className="text-stone-500 text-xs hidden sm:inline">{info.label}</span>
                      </div>
                      <div className="flex items-center gap-4 w-32 justify-end">
                        <span className="text-emerald-600 font-bold flex items-center gap-1 text-xs w-12 justify-end">
                          <Droplets size={12} /> {precip}%
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-medium w-12 justify-end">
                          <span className="text-stone-400">{Math.round(day.temperature_2m_min)}°</span>
                          <span className="text-stone-700">{Math.round(day.temperature_2m_max)}°</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && !currentWeather && (
        <div className="bg-red-50 p-3 text-center text-xs text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}
