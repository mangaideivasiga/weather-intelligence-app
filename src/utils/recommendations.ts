import { OpenMeteoForecastData, PlanningRecommendation, ActivityScore } from '../types/weather';
import { getWmoCodeInfo } from './wmoCodes';

export function generatePlanningRecommendations(data: OpenMeteoForecastData): PlanningRecommendation {
  const current = data.current;
  const hourly = data.hourly;
  const daily = data.daily;

  const temp = current?.temperature_2m ?? 20;
  const apparentTemp = current?.apparent_temperature ?? temp;
  const humidity = current?.relative_humidity_2m ?? 50;
  const windSpeed = current?.wind_speed_10m ?? 10;
  const weatherCode = current?.weather_code ?? 0;
  const isDay = current?.is_day ?? 1;

  const codeInfo = getWmoCodeInfo(weatherCode, isDay);

  // Today max rain prob & UV
  const todayRainProb = daily?.precipitation_probability_max?.[0] ?? (codeInfo.isRainy ? 80 : 10);
  const todayUv = daily?.uv_index_max?.[0] ?? (isDay ? 5 : 0);
  const maxWind = daily?.wind_speed_10m_max?.[0] ?? windSpeed;

  // 1. Calculate overall outdoor event feasibility (0-100)
  let score = 100;

  // Rain penalty
  if (todayRainProb > 70) score -= 40;
  else if (todayRainProb > 40) score -= 25;
  else if (todayRainProb > 20) score -= 10;

  // Weather code severity penalty
  if (codeInfo.isStormy) score -= 50;
  else if (codeInfo.isSnowy) score -= 30;
  else if (codeInfo.isRainy) score -= 30;

  // Temp comfort penalty
  if (temp < 0) score -= 35;
  else if (temp < 10) score -= 20;
  else if (temp > 35) score -= 30;
  else if (temp > 30) score -= 15;

  // Wind penalty
  if (maxWind > 45) score -= 30;
  else if (maxWind > 30) score -= 15;

  score = Math.max(0, Math.min(100, Math.round(score)));

  let overallVerdict = 'Ideal conditions for outdoor plans.';
  if (score < 40) {
    overallVerdict = 'Outdoor events not recommended today due to weather conditions.';
  } else if (score < 70) {
    overallVerdict = 'Fair outdoor conditions; keep a backup plan for changing weather.';
  } else if (score < 85) {
    overallVerdict = 'Good outdoor conditions with minimal weather risks.';
  }

  // 2. Outfit Advice
  let outfitTitle = 'Comfortable Casual Layers';
  let outfitDesc = 'Balanced weather today. Standard everyday clothing with versatile layering is ideal.';
  let outfitIcon = 'Shirt';
  const items: string[] = [];

  if (temp >= 28) {
    outfitTitle = 'Hot Weather Essentials';
    outfitDesc = 'Warm conditions ahead. Wear light, breathable fabrics and stay hydrated.';
    outfitIcon = 'Sun';
    items.push('Light Cotton / Linen T-Shirt', 'Shorts or Breathable Pants', 'Sunglasses', 'Wide-brim Hat');
  } else if (temp >= 20) {
    outfitTitle = 'Mild & Pleasant Outfit';
    outfitDesc = 'Pleasant temperatures for comfortable outdoor movement.';
    outfitIcon = 'Shirt';
    items.push('Short or Long Sleeve Top', 'Chinos or Jeans', 'Light Sneakers');
  } else if (temp >= 12) {
    outfitTitle = 'Cool Weather Layering';
    outfitDesc = 'Chilly breezes expected. A medium layer will keep you comfortable.';
    outfitIcon = 'Jacket';
    items.push('Light Sweater or Hoodie', 'Windbreaker / Denim Jacket', 'Long Trousers', 'Enclosed Shoes');
  } else if (temp >= 4) {
    outfitTitle = 'Chilly Weather Outerwear';
    outfitDesc = 'Cold temperatures require effective insulation.';
    outfitIcon = 'Coat';
    items.push('Warm Puffer Coat / Heavy Jacket', 'Thermal Underlayer', 'Woolen Scarf', 'Insulated Boots');
  } else {
    outfitTitle = 'Freezing Weather Protection';
    outfitDesc = 'Freezing conditions. Layer up heavily with windproof & thermal insulation.';
    outfitIcon = 'Snowflake';
    items.push('Heavy Insulated Winter Parka', 'Thermal Baselayers', 'Beanie & Gloves', 'Waterproof Winter Boots');
  }

  if (codeInfo.isRainy || todayRainProb >= 40) {
    items.push('Compact Umbrella ☔', 'Waterproof Rain Coat / Shell');
  }
  if (todayUv >= 5) {
    items.push('UV-400 Sunglasses 🕶️', 'Broad Spectrum SPF 30+ Sunscreen');
  }

  // 3. Health & Comfort Advisories
  const healthAdvisories: PlanningRecommendation['healthAdvisories'] = [];

  if (todayUv >= 8) {
    healthAdvisories.push({
      title: 'Very High UV Warning',
      message: `Max UV Index reaches ${todayUv}. Unprotected skin can burn quickly. Apply SPF 30+ every 2 hours and seek shade 11 AM - 4 PM.`,
      level: 'alert',
      iconName: 'SunAlert',
    });
  } else if (todayUv >= 5) {
    healthAdvisories.push({
      title: 'Moderate UV Exposure',
      message: `Max UV Index is ${todayUv}. Sun protection recommended during peak afternoon hours.`,
      level: 'warning',
      iconName: 'Sun',
    });
  }

  if (humidity >= 85 && temp > 24) {
    healthAdvisories.push({
      title: 'High Humidity & Mugginess',
      message: `Relative humidity at ${humidity}%. It will feel warmer than actual temperature (${Math.round(apparentTemp)}°C feel). Drink extra water.`,
      level: 'info',
      iconName: 'Droplet',
    });
  }

  if (maxWind >= 40) {
    healthAdvisories.push({
      title: 'High Wind Advisory',
      message: `Peak wind gusts around ${Math.round(maxWind)} km/h. Secure lightweight outdoor furniture and take care while driving tall vehicles.`,
      level: 'warning',
      iconName: 'Wind',
    });
  }

  if (codeInfo.isStormy) {
    healthAdvisories.push({
      title: 'Thunderstorm Hazard',
      message: 'Lightning hazards and heavy downpours detected. Stay indoors during storm activity.',
      level: 'alert',
      iconName: 'Zap',
    });
  }

  if (healthAdvisories.length === 0) {
    healthAdvisories.push({
      title: 'Optimal Comfort Conditions',
      message: 'No active weather advisories. Air quality, humidity, and temperatures are in a comfortable range.',
      level: 'success',
      iconName: 'CheckCircle2',
    });
  }

  // 4. Activity Scores
  const calculateActivityScore = (
    name: string,
    iconName: string,
    category: string,
    evaluator: () => { s: number; reason: string }
  ): ActivityScore => {
    const { s, reason } = evaluator();
    const finalScore = Math.max(0, Math.min(100, Math.round(s)));
    let rating: ActivityScore['rating'] = 'Poor';
    let colorClass = 'text-rose-500 bg-rose-500/10 border-rose-500/20';

    if (finalScore >= 80) {
      rating = 'Excellent';
      colorClass = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    } else if (finalScore >= 60) {
      rating = 'Good';
      colorClass = 'text-sky-500 bg-sky-500/10 border-sky-500/20';
    } else if (finalScore >= 40) {
      rating = 'Fair';
      colorClass = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }

    return { name, iconName, category, score: finalScore, rating, reason, colorClass };
  };

  const activities: ActivityScore[] = [
    calculateActivityScore('Running & Outdoor Fitness', 'Footprints', 'Fitness', () => {
      let s = 100;
      let reason = 'Great temperature and mild winds for outdoor workouts.';
      if (temp < 5) {
        s -= 30;
        reason = 'Chilly temperatures; wear warm athletic layers.';
      } else if (temp > 28) {
        s -= 35;
        reason = 'Warm temperatures — run early morning or late evening.';
      }
      if (todayRainProb > 50) {
        s -= 40;
        reason = 'Rain expected — slippery paths likely.';
      }
      if (windSpeed > 30) {
        s -= 20;
        reason = 'Strong headwinds expected.';
      }
      return { s, reason };
    }),

    calculateActivityScore('Outdoor Dining & Cafes', 'Utensils', 'Leisure', () => {
      let s = 100;
      let reason = 'Ideal ambient temperature and dry conditions.';
      if (temp < 16) {
        s -= 35;
        reason = 'Too chilly for open-air patio dining without heaters.';
      } else if (temp > 32) {
        s -= 30;
        reason = 'Heat index is high; opt for air-conditioned indoor dining.';
      }
      if (todayRainProb > 30 || codeInfo.isRainy) {
        s -= 60;
        reason = 'Rain risk; outdoor seating is discouraged.';
      }
      if (windSpeed > 22) {
        s -= 25;
        reason = 'Breezy winds may disrupt patio umbrella setup.';
      }
      return { s, reason };
    }),

    calculateActivityScore('Cycling & Commuting', 'Bike', 'Transport', () => {
      let s = 100;
      let reason = 'Dry pavement and manageable winds.';
      if (todayRainProb > 40 || codeInfo.isRainy) {
        s -= 50;
        reason = 'Wet roads reduce tire traction & visibility.';
      }
      if (windSpeed > 28) {
        s -= 35;
        reason = 'High wind resistance makes riding demanding.';
      }
      if (temp < 3) {
        s -= 40;
        reason = 'Risk of icy patches on roads.';
      }
      return { s, reason };
    }),

    calculateActivityScore('Hiking & Trails', 'Mountain', 'Adventure', () => {
      let s = 100;
      let reason = 'Favorable weather for scenic outdoor trail hikes.';
      if (codeInfo.isStormy) {
        s = 0;
        reason = 'Hazardous storm risk on exposed mountain trails.';
      } else if (todayRainProb > 50) {
        s -= 45;
        reason = 'Muddy trails and potential downpours.';
      } else if (temp > 32) {
        s -= 35;
        reason = 'High heat stress risk on unshaded trails.';
      }
      return { s, reason };
    }),

    calculateActivityScore('Beach & Swimming', 'Waves', 'Recreation', () => {
      let s = 100;
      let reason = 'Sunny, warm, and inviting beach weather.';
      if (temp < 23) {
        s -= 50;
        reason = 'Water & air temperatures are too cool for comfortable swimming.';
      }
      if (todayRainProb > 30 || !codeInfo.isSunny) {
        s -= 35;
        reason = 'Cloudy or rainy conditions reduce beach enjoyment.';
      }
      if (windSpeed > 30) {
        s -= 30;
        reason = 'Choppy waves and blowing sand.';
      }
      return { s, reason };
    }),

    calculateActivityScore('Stargazing', 'Moon', 'Nightlife', () => {
      let s = 100;
      let reason = 'Clear dark skies with low cloud coverage.';
      const avgCloud = hourly?.cloud_cover ? hourly.cloud_cover.slice(20, 24).reduce((a, b) => a + b, 0) / 4 : 50;
      if (avgCloud > 60) {
        s -= 60;
        reason = 'Heavy night cloud cover obscures stars and planets.';
      } else if (avgCloud > 30) {
        s -= 30;
        reason = 'Partly cloudy night sky.';
      }
      if (todayRainProb > 40) {
        s -= 50;
        reason = 'High chance of night precipitation.';
      }
      return { s, reason };
    }),
  ];

  // 5. Best Time Window Today
  let bestTimeWindow: PlanningRecommendation['bestTimeWindow'];
  if (hourly?.time && hourly.time.length >= 24) {
    let bestStartIndex = -1;
    let lowestPenalty = 999;

    // Scan hours 7 AM to 9 PM (index 7 to 21)
    for (let i = 7; i <= 18; i++) {
      const hTemp = hourly.temperature_2m[i] ?? 20;
      const hRain = hourly.precipitation_probability[i] ?? 0;
      const hWind = hourly.wind_speed_10m[i] ?? 10;

      // Penalty formula
      const tempPenalty = Math.abs(hTemp - 22); // Ideal ~22C
      const rainPenalty = hRain * 1.5;
      const windPenalty = hWind > 20 ? (hWind - 20) * 1.2 : 0;

      const totalP = tempPenalty + rainPenalty + windPenalty;
      if (totalP < lowestPenalty) {
        lowestPenalty = totalP;
        bestStartIndex = i;
      }
    }

    if (bestStartIndex !== -1) {
      const endHour = Math.min(23, bestStartIndex + 3);
      const startStr = `${bestStartIndex % 12 === 0 ? 12 : bestStartIndex % 12}:00 ${bestStartIndex >= 12 ? 'PM' : 'AM'}`;
      const endStr = `${endHour % 12 === 0 ? 12 : endHour % 12}:00 ${endHour >= 12 ? 'PM' : 'AM'}`;
      const bestTemp = Math.round(hourly.temperature_2m[bestStartIndex] ?? temp);
      const bestRain = hourly.precipitation_probability[bestStartIndex] ?? 0;

      bestTimeWindow = {
        timeRange: `${startStr} - ${endStr}`,
        reason: `Mild temp (~${bestTemp}°C) with ${bestRain}% rain probability.`,
        temp: bestTemp,
      };
    }
  }

  return {
    overallScore: score,
    overallVerdict,
    outfitAdvice: {
      title: outfitTitle,
      description: outfitDesc,
      items,
      iconName: outfitIcon,
    },
    bestTimeWindow,
    healthAdvisories,
    activities,
  };
}
