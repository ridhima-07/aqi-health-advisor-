export function aqiBase(aqi_level) {
    switch (aqi_level) {
        case 1: return 10;
        case 2: return 25;
        case 3: return 45;
        case 4: return 70;
        case 5: return 90;
        default: return 0;
    }
}

export function calcExposureScore(aqi_level, health_profile) {
    let score2 = 0;

    if (health_profile.isSmoker) score2 += 10;
    if (health_profile.hasAllergy) score2 += 5;
    if (health_profile.hasAsthma) score2 += 15;
    if (health_profile.hasHeartCondition) score2 += 15;
    if (health_profile.hasCOPD) score2 += 20;

    let exp_score = aqiBase(aqi_level) + score2;
    if (exp_score > 100) exp_score = 100;

    return exp_score;
}

export function calcExposureLabel(exp_score) {
    if (exp_score <= 20) return "Safe";
    if (exp_score <= 40) return "Slight risk";
    if (exp_score <= 60) return "Moderate risk";
    if (exp_score <= 80) return "High risk";
    return "Dangerous";
}