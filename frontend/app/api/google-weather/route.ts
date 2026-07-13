import { NextResponse } from "next/server";
import type { WeatherInputs } from "../../lib/weatherAssessment";

type GoogleGeocodeResponse = {
  results?: Array<{
    geometry?: {
      location?: {
        lat: number;
        lng: number;
      };
    };
  }>;
  status?: string;
  error_message?: string;
};

type GoogleWeatherResponse = {
  weatherCondition?: {
    description?: {
      text?: string;
    };
  };
  temperature?: {
    degrees?: number;
  };
  relativeHumidity?: number;
  uvIndex?: number;
  precipitation?: {
    probability?: {
      percent?: number;
    };
    qpf?: {
      quantity?: number;
    };
  };
  thunderstormProbability?: number;
  wind?: {
    speed?: {
      value?: number;
    };
    gust?: {
      value?: number;
    };
  };
  visibility?: {
    distance?: number;
  };
};

type GoogleAirQualityResponse = {
  indexes?: Array<{
    aqi?: number;
    code?: string;
  }>;
};

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: "GOOGLE_MAPS_API_KEY is not configured." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as { location?: string };
  if (!body.location?.trim()) {
    return NextResponse.json({ message: "Location is required." }, { status: 400 });
  }

  const coordinates = await geocodeLocation(body.location, apiKey);
  const [weather, airQuality] = await Promise.all([
    fetchGoogleWeather(coordinates, apiKey),
    fetchGoogleAirQuality(coordinates, apiKey),
  ]);

  const mappedWeather: WeatherInputs = {
    temperatureF: weather.temperature?.degrees,
    rainProbability: weather.precipitation?.probability?.percent,
    expectedRainfallIn: weather.precipitation?.qpf?.quantity,
    windSpeedMph: weather.wind?.speed?.value,
    windGustMph: weather.wind?.gust?.value,
    thunderstormRisk: mapThunderstormRisk(weather.thunderstormProbability),
    snowIceRisk: mapSnowIceRisk(weather.weatherCondition?.description?.text),
    humidityPercent: weather.relativeHumidity,
    aqi: airQuality.indexes?.find((index) => index.code === "usa_epa")?.aqi ?? airQuality.indexes?.[0]?.aqi,
    uvIndex: weather.uvIndex,
    visibilityMiles: weather.visibility?.distance,
    weatherAlerts: weather.weatherCondition?.description?.text,
  };

  return NextResponse.json({
    coordinates,
    source: "Google Weather API + Google Air Quality API",
    weather: mappedWeather,
  });
}

async function geocodeLocation(location: string, apiKey: string) {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", location);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);
  const data = (await response.json()) as GoogleGeocodeResponse;
  const coordinates = data.results?.[0]?.geometry?.location;

  if (!response.ok || !coordinates) {
    throw new Error(data.error_message ?? `Unable to geocode location: ${location}`);
  }

  return {
    latitude: coordinates.lat,
    longitude: coordinates.lng,
  };
}

async function fetchGoogleWeather(
  coordinates: { latitude: number; longitude: number },
  apiKey: string,
) {
  const url = new URL("https://weather.googleapis.com/v1/currentConditions:lookup");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("location.latitude", String(coordinates.latitude));
  url.searchParams.set("location.longitude", String(coordinates.longitude));
  url.searchParams.set("unitsSystem", "IMPERIAL");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Unable to fetch Google Weather conditions.");
  }

  return response.json() as Promise<GoogleWeatherResponse>;
}

async function fetchGoogleAirQuality(
  coordinates: { latitude: number; longitude: number },
  apiKey: string,
) {
  const url = new URL("https://airquality.googleapis.com/v1/currentConditions:lookup");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      universalAqi: true,
      location: coordinates,
    }),
  });

  if (!response.ok) {
    return {};
  }

  return response.json() as Promise<GoogleAirQualityResponse>;
}

function mapThunderstormRisk(probability?: number): WeatherInputs["thunderstormRisk"] {
  if (probability == null) return "None";
  if (probability >= 60) return "High";
  if (probability >= 30) return "Moderate";
  if (probability > 0) return "Low";
  return "None";
}

function mapSnowIceRisk(description?: string): WeatherInputs["snowIceRisk"] {
  const normalized = description?.toLowerCase() ?? "";
  if (normalized.includes("ice") || normalized.includes("snow")) return "Moderate";
  return "None";
}
