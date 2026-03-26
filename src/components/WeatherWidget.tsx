import React, { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, Loader2, MapPin, Droplets, CloudLightning, Clock, CalendarDays } from 'lucide-react';
import { useWeatherStore } from '../store/weatherStore';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

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

  const [activeView, setActiveView] = useState<'hourly' | 'daily'>('hourly');

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  if (isLoading && !currentWeather) {
    return (
      <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-[2rem] bg-white border border-emerald-100 shadow-sm p-6">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-500 mb-2" />
        <span className="text-xs font-medium text-stone-500">Memuat cuaca...</span>
      </div>
    );
  }

  const weatherInfo = weatherCodes[currentWeather?.weathercode || 0] || weatherCodes[0];
  const currentPrecip = hourlyForecast[0]?.precipitation_probability || 0;

  return (
    <div className="flex flex-col h-full bg-white border border-emerald-100 rounded-[2rem] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-white z-10 shrink-0 border-b border-stone-50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600">
            {React.cloneElement(weatherInfo.icon as React.ReactElement, { size: 24 })}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-black text-stone-800 text-2xl tracking-tighter">{Math.round(currentWeather?.temperature || 0)}°</span>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">{weatherInfo.label}</span>
            </div>
            <div className="text-[10px] font-medium text-stone-400 flex items-center gap-1 mt-0.5">
              <MapPin size={10} /> {locationName || 'Lokasi'}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end justify-center">
          <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold mb-0.5">Hujan</span>
          <span className="text-sm font-black text-emerald-600 flex items-center gap-1">
            <Droplets size={14} /> {currentPrecip}%
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 pt-3 pb-2 gap-2 bg-stone-50/50 shrink-0">
        <button
          onClick={() => setActiveView('hourly')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl transition-all ${
            activeView === 'hourly' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Clock size={14} /> 15 Jam
        </button>
        <button
          onClick={() => setActiveView('daily')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl transition-all ${
            activeView === 'daily' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <CalendarDays size={14} /> 7 Hari
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-stone-50/50 overflow-y-auto p-4 custom-scrollbar relative">
        {error && !currentWeather ? (
          <div className="bg-red-50 p-3 rounded-xl text-center text-xs font-medium text-red-500">
            {error}
          </div>
        ) : activeView === 'hourly' ? (
          <div className="grid grid-cols-5 gap-y-4 gap-x-2">
            {hourlyForecast.map((hour, idx) => {
              const info = weatherCodes[hour.weathercode] || weatherCodes[0];
              const time = hour.time ? format(parseISO(hour.time), 'HH:mm') : '';
              const precip = hour.precipitation_probability || 0;
              
              return (
                <div key={idx} className="flex flex-col items-center justify-center gap-1.5 bg-white py-3 rounded-xl border border-stone-100 shadow-sm">
                  <span className="text-[10px] font-bold text-stone-400">{idx === 0 ? 'Sekarang' : time}</span>
                  {React.cloneElement(info.icon as React.ReactElement, { size: 18 })}
                  <div className="flex flex-col items-center mt-1">
                    <span className="text-[10px] font-black text-emerald-600">{precip}%</span>
                    <span className="text-[11px] font-bold text-stone-700">{Math.round(hour.temperature)}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {dailyForecast.map((day, idx) => {
              const info = weatherCodes[day.weathercode] || weatherCodes[0];
              const dayName = idx === 0 ? 'Hari Ini' : format(parseISO(day.time), 'EEEE', { locale: id });
              const precip = day.precipitation_probability_max || 0;
              
              return (
                <div key={idx} className="flex items-center justify-between text-sm p-3 bg-white rounded-xl border border-stone-100 shadow-sm">
                  <span className="w-24 font-bold text-stone-700 text-xs">{dayName}</span>
                  <div className="flex items-center gap-2 flex-1 justify-center">
                    {React.cloneElement(info.icon as React.ReactElement, { size: 16 })}
                    <span className="text-stone-500 text-[11px] font-medium hidden sm:inline">{info.label}</span>
                  </div>
                  <div className="flex items-center gap-3 w-32 justify-end">
                    <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px] w-12 justify-end">
                      <Droplets size={10} /> {precip}%
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold w-12 justify-end">
                      <span className="text-stone-400">{Math.round(day.temperature_2m_min)}°</span>
                      <span className="text-stone-700">{Math.round(day.temperature_2m_max)}°</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e7e5e4;
          border-radius: 20px;
        }
      `}} />
    </div>
  );
}
