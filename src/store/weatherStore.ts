import { create } from 'zustand';

export interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  is_day: number;
  precipitation_probability?: number;
  time?: string;
}

export interface DailyWeather {
  time: string;
  weathercode: number;
  temperature_2m_max: number;
  temperature_2m_min: number;
  precipitation_probability_max?: number;
}

interface WeatherState {
  currentWeather: WeatherData | null;
  hourlyForecast: WeatherData[];
  dailyForecast: DailyWeather[];
  locationName: string | null;
  lastFetched: number | null;
  isLoading: boolean;
  error: string | null;
  
  fetchWeather: (force?: boolean) => Promise<void>;
}

export const useWeatherStore = create<WeatherState>((set, get) => ({
  currentWeather: null,
  hourlyForecast: [],
  dailyForecast: [],
  locationName: null,
  lastFetched: null,
  isLoading: false,
  error: null,

  fetchWeather: async (force = false) => {
    const { lastFetched, isLoading } = get();
    
    // Don't fetch if already loading
    if (isLoading) return;
    
    // Cache for 30 minutes (1800000 ms) unless forced
    if (!force && lastFetched && Date.now() - lastFetched < 1800000) {
      return;
    }

    set({ isLoading: true, error: null });

    const fetchFromApi = async (lat: number, lon: number) => {
      try {
        // Fetch weather data
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,weathercode,windspeed_10m,is_day,precipitation_probability&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
        );
        
        if (!weatherRes.ok) throw new Error('Gagal memuat data cuaca');
        const data = await weatherRes.json();

        // Process hourly (next 15 hours)
        const currentHourIndex = data.hourly.time.findIndex((t: string) => new Date(t) >= new Date());
        const startIndex = currentHourIndex !== -1 ? currentHourIndex : 0;
        
        const hourlyForecast: WeatherData[] = [];
        for (let i = startIndex; i < startIndex + 15; i++) {
          if (data.hourly.time[i]) {
            hourlyForecast.push({
              time: data.hourly.time[i],
              temperature: data.hourly.temperature_2m[i],
              weathercode: data.hourly.weathercode[i],
              windspeed: data.hourly.windspeed_10m[i],
              is_day: data.hourly.is_day[i],
              precipitation_probability: data.hourly.precipitation_probability[i],
            });
          }
        }

        // Process daily (next 7 days)
        const dailyForecast: DailyWeather[] = [];
        for (let i = 0; i < 7; i++) {
          if (data.daily.time[i]) {
            dailyForecast.push({
              time: data.daily.time[i],
              weathercode: data.daily.weathercode[i],
              temperature_2m_max: data.daily.temperature_2m_max[i],
              temperature_2m_min: data.daily.temperature_2m_min[i],
              precipitation_probability_max: data.daily.precipitation_probability_max[i],
            });
          }
        }

        // Fetch location name (Reverse Geocoding)
        let locName = 'Lokasi Tidak Diketahui';
        try {
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`
          );
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            locName = geoData.locality || geoData.city || geoData.principalSubdivision || 'Lokasi Terkini';
          }
        } catch (e) {
          console.error('Gagal memuat nama lokasi', e);
        }

        set({
          currentWeather: data.current_weather,
          hourlyForecast,
          dailyForecast,
          locationName: locName,
          lastFetched: Date.now(),
          isLoading: false,
        });

      } catch (err) {
        set({ error: 'Terjadi kesalahan saat memuat cuaca.', isLoading: false });
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchFromApi(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.warn('Izin lokasi ditolak, menggunakan default (Jakarta).');
          fetchFromApi(-6.2088, 106.8456); // Default Jakarta
        },
        { timeout: 10000 }
      );
    } else {
      fetchFromApi(-6.2088, 106.8456);
    }
  }
}));
