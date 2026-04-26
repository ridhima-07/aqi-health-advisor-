export function aqiBase(aqiValue) {
  if (aqiValue <= 50) return 10;
  if (aqiValue <= 100) return 25;
  if (aqiValue <= 150) return 45;
  if (aqiValue <= 200) return 65;
  if (aqiValue <= 300) return 82;
  return 92;
}

export function calcExposureScore(aqiValue, health_profile) {
  let profileScore = 0;

  if (health_profile.isSmoker) profileScore += 10;
  if (health_profile.hasAllergy) profileScore += 5;
  if (health_profile.hasAsthma) profileScore += 15;
  if (health_profile.hasHeartCondition) profileScore += 15;
  if (health_profile.hasCOPD) profileScore += 20;

  return Math.min(100, aqiBase(aqiValue) + profileScore);
}

export function calcExposureLabel(exp_score) {
    if (exp_score <= 20) return "Safe";
    if (exp_score <= 40) return "Slight risk";
    if (exp_score <= 60) return "Moderate risk";
    if (exp_score <= 80) return "High risk";
    return "Dangerous";
}