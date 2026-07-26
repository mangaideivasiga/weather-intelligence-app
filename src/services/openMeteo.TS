import { GeocodingResult, OpenMeteoForecastData } from '../types/weather';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`
    );

    if (!response.ok) {
      throw new Error(`Geocoding server responded with status ${response.status}`);
    }

    const data = await response.json();
    return (data.results as GeocodingResult[]) || [];
  } catch (error) {
    console.error('Error fetching geocoding results:', error);
    throw error;
  }
}

export async function fetchWeatherForecast(
  latitude: number,
  longitude: number,
  timezone: string = 'auto'
): Promise<OpenMeteoForecastData> {
  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'rain',
    'showers',
    'snowfall',
    'weather_code',
    'cloud_cover',
    'pressure_msl',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
  ].join(',');

  const hourlyParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'dew_point_2m',
    'apparent_temperature',
    'precipitation_probability',
    'precipitation',
    'rain',
    'showers',
    'snowfall',
    'weather_code',
    'pressure_msl',
    'surface_pressure',
    'cloud_cover',
    'visibility',
    'wind_speed_10m',
    'wind_direction_10m',
    'uv_index',
  ].join(',');

  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'sunrise',
    'sunset',
    'uv_index_max',
    'precipitation_sum',
    'rain_sum',
    'showers_sum',
    'snowfall_sum',
    'precipitation_hours',
    'precipitation_probability_max',
    'wind_speed_10m_max',
    'wind_gusts_10m_max',
    'wind_direction_10m_dominant',
  ].join(',');

  const url = `${FORECAST_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=${currentParams}&hourly=${hourlyParams}&daily=${dailyParams}&timezone=${encodeURIComponent(
    timezone
  )}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather forecast server responded with status ${response.status}`);
    }

    const data = (await response.json()) as OpenMeteoForecastData;
    return data;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
}

export async function reverseGeocodeLocation(
  latitude: number,
  longitude: number
): Promise<{ name: string; country?: string; admin1?: string }> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Current Location';
      return {
        name: city,
        country: data.countryName,
        admin1: data.principalSubdivision,
      };
    }
  } catch (err) {
    console.warn('Reverse geocode failed, using fallback:', err);
  }

  return {
    name: `Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
  };
}
