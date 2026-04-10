import { Box, Typography, Button } from "@mui/material";
import "../styles/Dashboard.css";

// ══════════════════════════════════════════════════════════════════════════════
// PLACEHOLDER DATA
// Replace these values with real props or API responses later.
// Each variable is clearly named so you know what to wire up.
// ══════════════════════════════════════════════════════════════════════════════
const PLACEHOLDER = {
  location:      "Mumbai, Maharashtra",
  updatedAt:     "Today at 9:41 AM",

  // AQI card
  aqiValue:      156,
  aqiLabel:      "Poor",
  aqiLevel:      "poor",          // "good" | "fair" | "moderate" | "poor"

  // Exposure score card
  exposureScore: 72,
  exposureLabel: "High Risk",
  exposureLevel: "poor",          // same scale as aqiLevel

  // Recommendation card
  nextBestAction:  "Stay indoors and keep windows closed.",
  actionReason:    "AQI is in the Poor range and your respiratory profile raises your personal risk.",

  // Health advisory card
  advisoryText:
    "Air quality is poor today, and your respiratory sensitivity increases your exposure risk significantly. Limit all prolonged outdoor activity. If you must go outside, wear a well-fitted N95 mask and keep exposure under 30 minutes.",

  // Pollutants (value + unit + level)
  pollutants: [
    { name: "PM2.5", value: 89,   unit: "µg/m³", level: "poor"     },
    { name: "PM10",  value: 134,  unit: "µg/m³", level: "poor"     },
    { name: "CO",    value: 1.4,  unit: "mg/m³", level: "moderate" },
    { name: "NO₂",   value: 42,   unit: "µg/m³", level: "fair"     },
    { name: "O₃",    value: 68,   unit: "µg/m³", level: "moderate" },
  ],

  // AQI trend — last 7 readings (replace with real data later)
  trend: [
    { label: "Mon", value: 98  },
    { label: "Tue", value: 112 },
    { label: "Wed", value: 88  },
    { label: "Thu", value: 145 },
    { label: "Fri", value: 162 },
    { label: "Sat", value: 156 },
    { label: "Sun", value: 156 },
  ],
};

// ══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════════════

// Returns the CSS class suffix for a given AQI level string
const levelClass = (level) => `level-${level}`;

// AQI severity scale steps used in the AQI card
const AQI_SCALE = [
  { label: "Good",     max: 50  },
  { label: "Fair",     max: 100 },
  { label: "Moderate", max: 150 },
  { label: "Poor",     max: 200 },
  { label: "Severe",   max: 300 },
];

// Which step is currently active based on aqiValue
const activeScaleIndex = (value) =>
  AQI_SCALE.findIndex((s) => value <= s.max);

// ══════════════════════════════════════════════════════════════════════════════
// MINI COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

// Circular arc showing exposure score (pure SVG — no library needed)
function ExposureRing({ score, level }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;

  return (
    <svg className="exposure-ring-svg" viewBox="0 0 128 128" width="128" height="128">
      {/* track */}
      <circle
        cx="64" cy="64" r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="9"
      />
      {/* filled arc */}
      <circle
        cx="64" cy="64" r={r}
        fill="none"
        className={`ring-arc ${levelClass(level)}`}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circ}`}
        transform="rotate(-90 64 64)"
      />
      {/* center score */}
      <text
        x="64" y="58"
        textAnchor="middle"
        className={`ring-score-num ${levelClass(level)}`}
        fontSize="26"
        fontWeight="800"
        fontFamily="Inter, sans-serif"
      />
      <text
        x="64" y="78"
        textAnchor="middle"
        fill="#9BA4B5"
        fontSize="11"
        fontWeight="500"
        fontFamily="Inter, sans-serif"
      >
        / 100
      </text>
    </svg>
  );
}

// Inline sparkline bar chart for trend (no charting library)
function TrendChart({ trend }) {
  const max = Math.max(...trend.map((t) => t.value));
  const min = Math.min(...trend.map((t) => t.value));
  const chartH = 72;

  // Normalize a value to a 0–chartH pixel height
  const barH = (v) =>
    Math.round(((v - min) / (max - min + 1)) * (chartH - 12) + 12);

  // Color each bar based on its AQI value
  const barLevel = (v) => {
    if (v <= 50)  return "good";
    if (v <= 100) return "fair";
    if (v <= 150) return "moderate";
    return "poor";
  };

  return (
    <div className="trend-chart">
      {trend.map((t, i) => (
        <div key={i} className="trend-col">
          <div className="trend-bar-wrap" style={{ height: chartH }}>
            <div
              className={`trend-bar ${levelClass(barLevel(t.value))}`}
              style={{ height: barH(t.value) }}
            >
              <span className="trend-bar-value">{t.value}</span>
            </div>
          </div>
          <span className="trend-day">{t.label}</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
export default function Dashboard({ data = PLACEHOLDER }) {
  const {
    location, updatedAt,
    aqiValue, aqiLabel, aqiLevel,
    exposureScore, exposureLabel, exposureLevel,
    nextBestAction, actionReason,
    advisoryText,
    pollutants,
    trend,
  } = data;

  const scaleActive = activeScaleIndex(aqiValue);

  return (
    <div className="dashboard">

      {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
      <header className="dash-header">
        <div className="dash-header-left">
          <Typography className="dash-page-title">Dashboard</Typography>
          <Typography className="dash-subtitle">
            Personalized air quality insights for your location
          </Typography>
        </div>
        <div className="dash-header-right">
          <div className="dash-location-chip">
            <span className="location-dot" />
            {location}
          </div>
          <span className="dash-updated">Updated {updatedAt}</span>
        </div>
      </header>

      {/* ── ROW 1: AQI + EXPOSURE ───────────────────────────────────────── */}
      <div className="dash-row row-primary">

        {/* ── AQI CARD ──────────────────────────────────────────────────── */}
        <div className={`dash-card aqi-card ${levelClass(aqiLevel)}`}>
          {/* corner glow based on severity */}
          <div className="card-corner-glow" />

          <div className="card-top-row">
            <span className="card-location-label">{location}</span>
            <span className="card-time-label">{updatedAt}</span>
          </div>

          {/* central AQI number */}
          <div className="aqi-center">
            <Typography className={`aqi-big-number ${levelClass(aqiLevel)}`}>
              {aqiValue}
            </Typography>
            <span className={`aqi-status-pill ${levelClass(aqiLevel)}`}>
              {aqiLabel}
            </span>
          </div>

          {/* AQI severity scale */}
          <div className="aqi-scale">
            {AQI_SCALE.map((step, i) => (
              <div key={step.label} className="scale-step">
                <div
                  className={`scale-seg ${i === scaleActive ? "scale-active" : ""}`}
                  data-level={
                    ["good","fair","moderate","poor","poor"][i]
                  }
                />
                {i === scaleActive && (
                  <span className="scale-marker">▲</span>
                )}
                <span
                  className={`scale-label ${i === scaleActive ? "scale-label-active" : ""}`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── EXPOSURE SCORE CARD ───────────────────────────────────────── */}
        <div className={`dash-card exposure-card ${levelClass(exposureLevel)}`}>
          <div className="card-corner-glow" />

          <div className="exposure-header">
            <Typography className="card-section-title">Exposure Score</Typography>
            <span className={`aqi-status-pill ${levelClass(exposureLevel)}`}>
              {exposureLabel}
            </span>
          </div>

          <div className="exposure-body">
            {/* ring with score */}
            <div className="ring-wrapper">
              <ExposureRing score={exposureScore} level={exposureLevel} />
              {/* overlay the number since SVG foreignObject is tricky */}
              <div className="ring-center-overlay">
                <span className={`ring-score-text ${levelClass(exposureLevel)}`}>
                  {exposureScore}
                </span>
                <span className="ring-max">/100</span>
              </div>
            </div>

            <div className="exposure-meta">
              <p className="exposure-explain">
                Your exposure score combines AQI with your personal health profile.
                A score of <strong style={{ color: "inherit" }}>{exposureScore}</strong> means
                today carries a significantly elevated breathing risk for your profile.
              </p>
              <div className="exposure-bar-track">
                <div
                  className={`exposure-bar-fill ${levelClass(exposureLevel)}`}
                  style={{ width: `${exposureScore}%` }}
                />
              </div>
              <div className="exposure-bar-labels">
                <span>Safe</span>
                <span>Moderate</span>
                <span>High Risk</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 2: ACTION + ADVISORY ────────────────────────────────────── */}
      <div className="dash-row row-secondary">

        {/* ── NEXT BEST ACTION ──────────────────────────────────────────── */}
        <div className="dash-card action-card">
          <div className="action-tag">Next Best Action</div>
          <Typography className="action-headline">{nextBestAction}</Typography>
          <Typography className="action-reason">{actionReason}</Typography>
          <Button className="see-all-btn" variant="text">
            See all recommendations →
          </Button>
        </div>

        {/* ── HEALTH ADVISORY ───────────────────────────────────────────── */}
        <div className="dash-card advisory-card">
          <div className="advisory-tag">Health Advisory</div>
          <Typography className="advisory-label">Personalized for your profile</Typography>
          <Typography className="advisory-body">{advisoryText}</Typography>
        </div>
      </div>

      {/* ── ROW 3: POLLUTANTS ───────────────────────────────────────────── */}
      <section className="dash-section">
        <div className="section-header">
          <Typography className="section-title">Pollutant Breakdown</Typography>
          <span className="section-note">Live readings · {updatedAt}</span>
        </div>
        <div className="pollutants-grid">
          {pollutants.map((p) => (
            <div key={p.name} className={`pollutant-card ${levelClass(p.level)}`}>
              <div className={`pollutant-bar ${levelClass(p.level)}`} />
              <div className="pollutant-name">{p.name}</div>
              <div className={`pollutant-value ${levelClass(p.level)}`}>
                {p.value}
                <span className="pollutant-unit">{p.unit}</span>
              </div>
              <span className={`pollutant-pill ${levelClass(p.level)}`}>
                {p.level.charAt(0).toUpperCase() + p.level.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROW 4: AQI TREND ────────────────────────────────────────────── */}
      <section className="dash-section">
        <div className="section-header">
          <Typography className="section-title">7-Day AQI Trend</Typography>
          <span className="section-note">Placeholder — replace with backend data</span>
        </div>
        <div className="dash-card trend-card">
          <TrendChart trend={trend} />
        </div>
      </section>

    </div>
  );
}