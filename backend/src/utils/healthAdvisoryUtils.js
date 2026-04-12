function getAdvisorySeverity ( exp_score )
{
    if ( exp_score <= 20 ) return "safe";
    if ( exp_score <= 40 ) return "slight";
    if ( exp_score <= 60 ) return "moderate";
    if ( exp_score <= 80 ) return "high";
    return "dangerous";
};

function buildSummary ( aqiLabel, exposureLabel, severity )
{
    if ( severity === "safe" )
        return `Air quality is ${aqiLabel.toLowerCase()} today, and your current exposure risk is ${exposureLabel.toLowerCase()}. Normal activity is generally safe.`;
    if ( severity === "slight" )
        return `Air quality is ${aqiLabel.toLowerCase()} today, and your exposure risk is slightly elevated. Sensitive users should stay aware of symptoms.`;
    if ( severity === "moderate" )
        return `Air quality is ${aqiLabel.toLowerCase()} today, and your health profile raises your sensitivity to pollutant exposure. Be cautious with outdoor activity.`;
    if ( severity === "high" )
        return `Air quality is ${aqiLabel.toLowerCase()} today, and your health profile increases your exposure risk. Limit outdoor activity and follow protective recommendations.`;
    return `Air quality is ${aqiLabel.toLowerCase()} today, and your current health profile places you at high risk from pollutant exposure. Avoid unnecessary outdoor activity and take protective measures.`;
};

function buildReasons ( pollutants, health_profile )
{
    const reasons = [];
    if (pollutants.pm2_5 > 35) {
    reasons.push("PM2.5 levels are elevated today.");
  }

  if (pollutants.pm10 > 100) {
    reasons.push("Particulate pollution is contributing to poor air quality.");
  }

  if (health_profile.hasAsthma) {
    reasons.push("Your profile indicates increased airway sensitivity.");
  }

  if (health_profile.hasCOPD) {
    reasons.push("Respiratory conditions may worsen under current air conditions.");
  }

  if (health_profile.hasHeartCondition) {
    reasons.push("Current pollution may increase cardiovascular strain.");
  }

  if (health_profile.isSmoker) {
    reasons.push("Smoking history can increase sensitivity to polluted air.");
  }

  if (health_profile.hasAllergy) {
    reasons.push("Airborne irritants may aggravate allergy symptoms.");
  }

  return reasons.slice(0, 3);
};

function buildDoNext ( severity, health_profile )
{
    const steps = [];

    if (severity === "safe") {
    steps.push("Normal activity is generally fine.");
    steps.push("Keep monitoring updates if conditions change.");
  } else if (severity === "slight") {
    steps.push("Reduce prolonged outdoor exertion if possible.");
    steps.push("Monitor symptoms during outdoor activity.");
  } else if (severity === "moderate") {
    steps.push("Limit prolonged outdoor activity.");
    steps.push("Avoid heavy exercise outdoors.");
    steps.push("Use a mask if conditions feel irritating.");
  } else if (severity === "high") {
    steps.push("Limit outdoor activity as much as possible.");
    steps.push("Wear an N95 mask if you need to go outside.");
    steps.push("Avoid outdoor workouts today.");
  } else {
    steps.push("Avoid unnecessary outdoor exposure.");
    steps.push("Stay indoors with windows closed if possible.");
    steps.push("Follow your highest-priority recommendation immediately.");
  }

  if ((health_profile.hasAsthma || health_profile.hasCOPD) && steps.length < 4) {
    steps.push("Keep prescribed respiratory medication accessible.");
  }

  if (health_profile.hasHeartCondition && steps.length < 4) {
    steps.push("Avoid strenuous physical activity today.");
  }

  return steps.slice(0, 3);
};

export function generateHealthAdvisory({
  aqiValue,
  aqiLabel,
  pollutants,
  health_profile,
  exposureScore,
  exposureLabel,
}) {
  const severity = getAdvisorySeverity(exposureScore);

  return {
    severity,
    title: "Health Advisory",
    summary: buildSummary(aqiLabel, exposureLabel, severity),
    reasons: buildReasons(pollutants, health_profile),
    doNext: buildDoNext(severity, health_profile),
  };
}
