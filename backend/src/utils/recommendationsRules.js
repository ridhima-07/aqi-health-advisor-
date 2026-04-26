
export const recommendationRules = [
  {
    id: "AQI_HIGH_GENERAL",
    priority: 10,
    category: "general",
    condition: (ctx) => ctx.aqiValue > 150,
    message: (ctx) => `Air quality is ${ctx.aqi_label}. Avoid outdoor activity if possible.`
  },

  {
    id: "ASTHMA_ALERT",
    priority: 10,
    category: "health_profile",
    condition: (ctx) => ctx.health_profile.hasAsthma && ctx.aqiValue > 100,
    message: () => "Asthma risk is higher today. Carry your inhaler and avoid outdoor exertion."
  },

  {
    id: "COPD_ALERT",
    priority: 10,
    category: "health_profile",
    condition: (ctx) => ctx.health_profile.hasCOPD && ctx.aqiValue > 100,
    message: () => "COPD risk is higher today. Avoid outdoor exposure and stay indoors if possible."
  },

  {
    id: "HEART_ALERT",
    priority: 9,
    category: "health_profile",
    condition: (ctx) => ctx.health_profile.hasHeartCondition && ctx.aqiValue > 100,
    message: () => "Heart condition risk is higher today. Avoid stress, heavy walking, and polluted areas."
  },

  {
    id: "SMOKER_ALERT",
    priority: 8,
    category: "health_profile",
    condition: (ctx) => ctx.health_profile.isSmoker && ctx.aqiValue > 100,
    message: () => "Avoid smoking outdoors today. Pollution + smoking increases respiratory strain."
  },

  {
    id: "HIGH_PM25",
    priority: 9,
    category: "pollution",
    condition: (ctx) => ctx.pollutants.pm2_5 > 60,
    message: () => "PM2.5 is very high. Wear an N95 mask if you must go outside."
  },

  {
    id: "HIGH_PM10",
    priority: 7,
    category: "pollution",
    condition: (ctx) => ctx.pollutants.pm10 > 100,
    message: () => "PM10 levels are high. Avoid dusty areas and outdoor exercise."
  },

  {
    id: "HIGH_CO",
    priority: 7,
    category: "pollution",
    condition: (ctx) => ctx.pollutants.co > 1200,
    message: () => "CO levels are high. Avoid traffic-heavy roads and closed parking areas."
  },

  {
    id: "HIGH_O3",
    priority: 7,
    category: "pollution",
    condition: (ctx) => ctx.pollutants.o3 > 100,
    message: () => "Ozone levels are high. Avoid outdoor exercise in the afternoon."
  },

  {
    id: "SAFE_DAY",
    priority: 3,
    category: "general",
    condition: (ctx) => ctx.aqiValue <= 100,
    message: () => "Air quality is good today. Outdoor activity is generally safe."
  }
];