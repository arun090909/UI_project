export type WeatherInputs = {
  temperatureF?: number;
  rainProbability?: number;
  expectedRainfallIn?: number;
  windSpeedMph?: number;
  windGustMph?: number;
  thunderstormRisk?: "None" | "Low" | "Moderate" | "High";
  snowIceRisk?: "None" | "Low" | "Moderate" | "High";
  humidityPercent?: number;
  aqi?: number;
  uvIndex?: number;
  visibilityMiles?: number;
  weatherAlerts?: string;
};

export type EventContext = {
  eventType: string;
  eventMode: string;
  capacity?: number;
  durationHours?: number;
};

export type WeatherAssessment = {
  score: number;
  status: "Safe to Host" | "Host with Precautions" | "Move Indoors/Postpone" | "Cancel";
  reasons: string[];
  precautions: string[];
};

export function assessEventWeather(weather: WeatherInputs, context: EventContext): WeatherAssessment {
  if (context.eventMode === "Virtual") {
    return {
      score: 100,
      status: "Safe to Host",
      reasons: ["Virtual events are not directly affected by venue weather conditions."],
      precautions: ["Monitor travel weather only for speakers or staff using an in-person studio."],
    };
  }

  let score = 100;
  const reasons: string[] = [];
  const precautions = new Set<string>();
  const crowdMultiplier = context.capacity && context.capacity >= 250 ? 1.2 : 1;
  const longEventMultiplier = context.durationHours && context.durationHours >= 4 ? 1.15 : 1;
  const riskMultiplier = crowdMultiplier * longEventMultiplier;

  score -= scoreTemperature(weather.temperatureF, reasons, precautions) * riskMultiplier;
  score -= scoreRain(weather.rainProbability, weather.expectedRainfallIn, reasons, precautions) * riskMultiplier;
  score -= scoreWind(weather.windSpeedMph, weather.windGustMph, reasons, precautions) * riskMultiplier;
  score -= scoreRisk("Thunderstorm/lightning", weather.thunderstormRisk, reasons, precautions);
  score -= scoreRisk("Snow/ice", weather.snowIceRisk, reasons, precautions);
  score -= scoreHumidity(weather.humidityPercent, reasons, precautions);
  score -= scoreAqi(weather.aqi, reasons, precautions);
  score -= scoreUv(weather.uvIndex, context.eventType, reasons, precautions);
  score -= scoreVisibility(weather.visibilityMiles, reasons, precautions);

  if (weather.weatherAlerts?.trim()) {
    score -= 25;
    reasons.push(`Active weather alert: ${weather.weatherAlerts.trim()}.`);
    precautions.add("Confirm emergency communication and evacuation plans before opening gates.");
  }

  const finalScore = Math.max(0, Math.round(score));

  return {
    score: finalScore,
    status: getStatus(finalScore, weather),
    reasons: reasons.length ? reasons : ["No major weather risks were entered for this event."],
    precautions: Array.from(precautions).length ? Array.from(precautions) : ["Continue monitoring forecast updates before event start."],
  };
}

function scoreTemperature(value: number | undefined, reasons: string[], precautions: Set<string>) {
  if (value == null) return 0;
  if (value >= 105 || value <= 20) {
    reasons.push(`Extreme temperature expected at ${value}F.`);
    precautions.add(value >= 105 ? "Move indoors or provide cooling centers and medical standby." : "Move indoors or provide heaters and warming areas.");
    return 30;
  }
  if (value >= 95 || value <= 35) {
    reasons.push(`Challenging temperature expected at ${value}F.`);
    precautions.add(value >= 95 ? "Add hydration stations, shade, cooling fans, and heat illness monitoring." : "Add heaters, wind breaks, and warm rest areas.");
    return 18;
  }
  return 0;
}

function scoreRain(probability: number | undefined, rainfall: number | undefined, reasons: string[], precautions: Set<string>) {
  let penalty = 0;
  if ((probability ?? 0) >= 70 || (rainfall ?? 0) >= 1) {
    reasons.push(`High rain risk entered: ${probability ?? 0}% chance, ${rainfall ?? 0} in expected.`);
    precautions.add("Use covered areas, tents, drainage planning, umbrellas, and indoor backup space.");
    penalty += 24;
  } else if ((probability ?? 0) >= 40 || (rainfall ?? 0) >= 0.25) {
    reasons.push(`Moderate rain risk entered: ${probability ?? 0}% chance, ${rainfall ?? 0} in expected.`);
    precautions.add("Prepare tents, ponchos, covered queues, and slip-resistant walkways.");
    penalty += 12;
  }
  return penalty;
}

function scoreWind(speed: number | undefined, gust: number | undefined, reasons: string[], precautions: Set<string>) {
  const maxWind = Math.max(speed ?? 0, gust ?? 0);
  if (maxWind >= 45) {
    reasons.push(`Dangerous wind or gusts expected up to ${maxWind} mph.`);
    precautions.add("Cancel outdoor structures, stages, tents, and temporary signage unless engineered for wind load.");
    return 28;
  }
  if (maxWind >= 25) {
    reasons.push(`Elevated wind or gusts expected up to ${maxWind} mph.`);
    precautions.add("Secure tents, banners, stages, and temporary equipment.");
    return 14;
  }
  return 0;
}

function scoreRisk(label: string, risk: WeatherInputs["thunderstormRisk"], reasons: string[], precautions: Set<string>) {
  if (risk === "High") {
    reasons.push(`${label} risk is high.`);
    precautions.add("Postpone, move indoors, or cancel if lightning or hazardous conditions are present.");
    return 35;
  }
  if (risk === "Moderate") {
    reasons.push(`${label} risk is moderate.`);
    precautions.add("Prepare indoor shelter and stop-event procedures.");
    return 18;
  }
  if (risk === "Low") {
    reasons.push(`${label} risk is low but should be monitored.`);
    precautions.add("Assign staff to monitor official alerts during the event.");
    return 6;
  }
  return 0;
}

function scoreHumidity(value: number | undefined, reasons: string[], precautions: Set<string>) {
  if (value == null) return 0;
  if (value >= 80) {
    reasons.push(`High humidity expected at ${value}%.`);
    precautions.add("Increase hydration, shaded rest areas, and heat-stress checks.");
    return 8;
  }
  return 0;
}

function scoreAqi(value: number | undefined, reasons: string[], precautions: Set<string>) {
  if (value == null) return 0;
  if (value > 200) {
    reasons.push(`Very unhealthy AQI entered at ${value}.`);
    precautions.add("Move indoors with filtration or cancel outdoor activity.");
    return 28;
  }
  if (value > 150) {
    reasons.push(`Unhealthy AQI entered at ${value}.`);
    precautions.add("Limit outdoor exertion and provide indoor filtered areas.");
    return 18;
  }
  if (value > 100) {
    reasons.push(`AQI may affect sensitive groups at ${value}.`);
    precautions.add("Notify attendees and provide indoor rest areas for sensitive groups.");
    return 8;
  }
  return 0;
}

function scoreUv(value: number | undefined, eventType: string, reasons: string[], precautions: Set<string>) {
  if (value == null) return 0;
  if (value >= 8) {
    reasons.push(`High UV index entered at ${value}.`);
    precautions.add("Provide shade, sunscreen stations, and covered waiting areas.");
    return eventType === "Sports" ? 12 : 8;
  }
  return 0;
}

function scoreVisibility(value: number | undefined, reasons: string[], precautions: Set<string>) {
  if (value == null) return 0;
  if (value < 1) {
    reasons.push(`Unsafe travel visibility entered at ${value} miles.`);
    precautions.add("Delay arrival windows or postpone until travel visibility improves.");
    return 22;
  }
  if (value < 3) {
    reasons.push(`Reduced travel visibility entered at ${value} miles.`);
    precautions.add("Warn attendees about travel conditions and increase traffic control.");
    return 10;
  }
  return 0;
}

function getStatus(score: number, weather: WeatherInputs): WeatherAssessment["status"] {
  if (weather.thunderstormRisk === "High" || weather.snowIceRisk === "High" || score < 40) return "Cancel";
  if (score < 60) return "Move Indoors/Postpone";
  if (score < 80) return "Host with Precautions";
  return "Safe to Host";
}
