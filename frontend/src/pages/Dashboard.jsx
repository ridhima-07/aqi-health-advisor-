import React, { useEffect, useState } from "react";
import { getDashboardData, fetchLatestAqi } from "../services/dashboardServices";
import "../styles/Dashboard.css";

// ─── Placeholder Data ──────────────────────────────────────────────────────
// Replace with real API data or props when ready.
// const DATA = {
//   location:      'Mumbai, Bandra West',
//   updatedAt:     'Updated 4 min ago',

//   // AQI
//   aqiValue:      143,
//   aqiLabel:      'Moderate',    // 'Good' | 'Fair' | 'Moderate' | 'Poor'

//   // Decision strip
//   exposureScore: 68,
//   riskLevel:     'Moderate Risk',
//   action:        'Stay indoors',
//   actionDetail:  'if sensitive',  // appended in severity color

//   // Health advisory (max 4 bullets)
//   advisory: [
//     'Avoid prolonged outdoor exertion.',
//     'Keep windows closed; run air purifier if available.',
//     'Wear N95 mask if going outside.',
//     'Sensitive groups (asthma, elderly) should stay indoors.',
//   ],

//   // Pollutants
//   pollutants: [
//     { name: 'PM2.5',  value: 58.4, unit: 'µg/m³', pct: 78, level: 'moderate' },
//     { name: 'PM10',   value: 92.1, unit: 'µg/m³', pct: 62, level: 'moderate' },
//     { name: 'NO₂',   value: 34.2, unit: 'ppb',    pct: 45, level: 'fair'     },
//     { name: 'O₃',    value: 18.7, unit: 'ppb',    pct: 28, level: 'good'     },
//     { name: 'CO',     value: 0.9,  unit: 'ppm',    pct: 18, level: 'good'     },
//   ],

//   // Trend — last 8 readings (oldest → newest), 0–500
//   trend: [88, 101, 119, 134, 128, 143, 156, 143],
//   trendHours: ['6h', '5h', '4h', '3h', '2h', '1h', '30m', 'Now'],
// };



// ─── Helpers ───────────────────────────────────────────────────────────────

function severityClass(aqiValue) {
  if (aqiValue <= 50)  return 'sev-good';
  if (aqiValue <= 100) return 'sev-fair';
  if (aqiValue <= 200) return 'sev-moderate';
  return 'sev-poor';
}

// AQI 0–500 → thumb position % on the scale bar
function aqiToPercent(value) {
  return Math.min(100, Math.max(0, (value / 500) * 100));
}

// ─── Sub-components ────────────────────────────────────────────────────────

function RefreshIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.65 2.35A8 8 0 1 0 15 8h-2a6 6 0 1 1-1.05-3.39L10 6.5h5V1.5l-1.35.85z"
        fill="currentColor"
      />
    </svg>
  );
}

// CHANGE 1 — Circular exposure ring for the hero right column
function ExposureRing({ score, label }) {
  const RADIUS = 51;                        // was 44 — scaled for 136px container
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const dashOffset = CIRCUMFERENCE * (1 - score / 100);

  return (
    <div className="hero-exposure" aria-label={`Exposure score ${score} out of 100, ${label}`}>
      <div className="exposure-ring-wrap">
        <svg
          className="exposure-ring-svg"
          viewBox="0 0 136 136"              /* was 104 104 */
          aria-hidden="true"
        >
          <defs>
            <filter id="exp-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Track */}
          <circle
            cx="68" cy="68" r={RADIUS}     /* was cx/cy 52 */
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="8.5"              /* was 7 — thicker stroke */
          />
          {/* Progress arc */}
          <circle
            cx="68" cy="68" r={RADIUS}
            fill="none"
            stroke="var(--sev, #fb923c)"
            strokeWidth="8.5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 68 68)"  /* was rotate(-90 52 52) */
            filter="url(#exp-glow)"
          />
        </svg>

        {/* Center text */}
        <div className="exposure-ring-center">
          <span className="exposure-ring-score">{score}</span>
          <span className="exposure-ring-denom">/ 100</span>
        </div>
      </div>

      {/* Label below ring */}
      <div className="exposure-ring-meta">
        <span className="exposure-ring-heading">Exposure</span>
        <span className="exposure-ring-label">{label}</span>
      </div>
    </div>
  );
}

// ─── Section 1: Hero ───────────────────────────────────────────────────────
function Hero({ location, updatedAt, aqiValue, aqiLabel, exposureScore, exposureLabel, onFetch }) {
  const thumbLeft = aqiToPercent(aqiValue);

  return (
    <section className="hero" aria-label="Current AQI">

      {/* Top bar — location only (fetch btn moved to right column) */}
      <div className="hero-bar">
        <div className="hero-location-group">
          <span className="hero-location">{location}</span>
          <span className="hero-updated">{updatedAt}</span>
        </div>

        <button className="fetch-btn" onClick={onFetch} aria-label="Fetch latest AQI">
          <RefreshIcon />
          Fetch Latest
        </button>
      </div>

      {/* Main body: AQI left, right vertical stack */}
      <div className="hero-body">

        {/* Left: AQI number + scale */}
        <div className="hero-aqi-block">
          <div className="hero-aqi">
            <span className="aqi-number" aria-label={`AQI ${aqiValue}`}>
              {aqiValue}
            </span>
            <div className="aqi-label-group">
              <span className="aqi-label">{aqiLabel}</span>
            </div>
          </div>

          <div className="aqi-scale">
            <div className="scale-track">
              <div
                className="scale-thumb"
                style={{ left: `${thumbLeft}%` }}
                role="img"
                aria-label={`${aqiValue} on scale of 0 to 500`}
              />
            </div>
            <div className="scale-labels">
              <span>Good</span>
              <span>Fair</span>
              <span>Moderate</span>
              <span>Poor</span>
            </div>
          </div>
        </div>

        {/* Right: fetch button on top, exposure ring below — vertical stack */}
        <div className="hero-right-col">
          <ExposureRing score={exposureScore} label={exposureLabel} />
        </div>

      </div>

    </section>
  );
}

// ─── Section 2: Decision Strip ─────────────────────────────────────────────
// CHANGE 2 — Exposure Score removed; only Risk Level + Best Action remain
// CHANGE 3 — "View all recommendations" link added under Best Action
function DecisionStrip({ riskLevel, action, actionDetail }) {
  return (
    <div className="strip" role="region" aria-label="Decision summary">

      <div className="strip-item">
        <span className="strip-label">Risk Level</span>
        <span className="strip-value">{riskLevel}</span>
      </div>

      <div className="strip-item strip-item--action">
        <span className="strip-label">Best Action</span>
        <span className="strip-value">
          {action}{' '}
          <span>{actionDetail}</span>
        </span>
        {/* CHANGE 3 — subtle "View all recommendations" link */}
        <a href="#advisory" className="view-all-link">
          View all recommendations →
        </a>
      </div>

    </div>
  );
}

// CHANGE 4 — Bold the leading action word in each advisory bullet
// Words to bold: Avoid, Keep, Wear, Stay
const ACTION_WORDS = ['Avoid', 'Keep', 'Wear', 'Stay'];

function BoldActionWord({ text }) {
  for (const word of ACTION_WORDS) {
    if (text.startsWith(word)) {
      return (
        <>
          <strong className="advisory-keyword">{word}</strong>
          {text.slice(word.length)}
        </>
      );
    }
  }
  return <>{text}</>;
}

// ─── Section 3A: Health Advisory ──────────────────────────────────────────
function HealthAdvisory({ items }) {
  return (
    // CHANGE 3 — id="advisory" so the "View all recommendations" anchor scrolls here
    <div className="panel" id="advisory">
      <h2 className="panel-title">Health Advisory</h2>
      <ul className="advisory-list" aria-label="Health advisory points">
        {items.map((text, i) => (
          <li key={i} className="advisory-item">
            <span className="advisory-dot" aria-hidden="true" />
            {/* CHANGE 4 — bold leading action word */}
            <BoldActionWord text={text} />
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Section 3B: Pollutant Breakdown ──────────────────────────────────────
function PollutantBreakdown({ pollutants }) {
  return (
    <div className="panel">
      <h2 className="panel-title">Pollutant Breakdown</h2>
      <div className="pollutant-list">
        {pollutants.map((p) => (
          <div key={p.name} className="pollutant-row">
            <div className="pollutant-header">
              <span className="pollutant-name">{p.name}</span>
              <div className="pollutant-meta">
                <span className="pollutant-value">{p.value} {p.unit}</span>
                <span className={`pollutant-badge badge-${p.level}`}>{p.level}</span>
              </div>
            </div>
            <div className="pollutant-bar-track">
              <div
                className={`pollutant-bar-fill fill-${p.level}`}
                style={{ width: `${p.pct}%` }}
                role="progressbar"
                aria-valuenow={p.pct}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section 4: Trend Sparkline ────────────────────────────────────────────
function TrendPanel({ values, labels, sevClass }) {
  // Map values (0–500 scale) to SVG Y coordinates (72px tall, reversed)
  const W = 800;
  const H = 72;
  const PAD = 10;
  const max = 500;

  const points = values.map((v, i) => {
    const x = PAD + (i / (values.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((v / max) * (H - PAD * 2));
    return `${x},${y}`;
  });

  const polyline = points.join(' ');

  // Build closed path for area fill
  const firstX = PAD;
  const lastX  = W - PAD;
  const areaPath = `M${firstX},${H} ${points.map((p) => `L${p}`).join(' ')} L${lastX},${H} Z`;

  return (
    <div className="trend-panel" role="region" aria-label="AQI trend">
      <div className="trend-header">
        <span className="trend-title">AQI Trend · Last 8 Readings</span>
        <span className="trend-legend">Current: {values[values.length - 1]}</span>
      </div>

      <svg
        className="trend-chart"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="trend-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--sev, #fb923c)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--sev, #fb923c)" stopOpacity="0"    />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path className="trend-area" d={areaPath} />

        {/* Line */}
        <polyline className="trend-line" points={polyline} />

        {/* Dots at each data point */}
        {points.map((pt, i) => {
          const [x, y] = pt.split(',').map(Number);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i === points.length - 1 ? 4 : 2.5}
              fill={i === points.length - 1 ? 'var(--sev, #fb923c)' : '#252b36'}
              stroke="var(--sev, #fb923c)"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>

      <div className="trend-labels">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Dashboard (root export) ───────────────────────────────────────────────
export default function Dashboard() {
  // const sevClass = severityClass(DATA.aqiValue);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      // temporary hardcoded user id for now
      const userId = 1;

      const result = await getDashboardData(userId);
      setDashboardData(result.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  loadDashboard();
}, []);

  async function handleFetch() {
  try {
    if (!dashboardData?.location?.id) return;

    const latestAqiResponse = await fetchLatestAqi(dashboardData.location.id);
    const latestAqi = latestAqiResponse.data;

    setDashboardData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        aqi: latestAqi,
        aqiLabel: prev.aqiLabel, // temporary until recalculated below
      };
    });

    // reload complete dashboard so exposure, advisory, and other derived fields stay correct
    const refreshed = await getDashboardData(dashboardData.user.id);
    setDashboardData(refreshed.data);
  } catch (err) {
    console.error(err);
    setError("Failed to fetch latest AQI.");
  }
}

  const currentData = dashboardData || null;

  if (loading) {
    return (
      <main className="dashboard">
        <header className="dashboard-page-header">
          <h1 className="dashboard-page-title">DASHBOARD</h1>
        </header>
        <p style={{ color: "#9BA4B5" }}>Loading dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard">
        <header className="dashboard-page-header">
          <h1 className="dashboard-page-title">DASHBOARD</h1>
        </header>
        <p style={{ color: "#f87171" }}>{error}</p>
      </main>
    );
  }

  if (!currentData) {
          return null;
        }

  const trendValues =
  currentData.aqiHistory?.length
    ? currentData.aqiHistory.map((item) => item.aqi_value || item.aqiValue || 0)
    : [currentData.aqi.aqiValue];

  const trendLabels =
    currentData.aqiHistory?.length
      ? currentData.aqiHistory.map((_, index) => `${currentData.aqiHistory.length - index}h`)
      : ["Now"];

  const sevClass = currentData?.aqi?.aqiValue
  ? severityClass(currentData.aqi.aqiValue)
  : "sev-moderate";

  const pollutantData = [
          {
            name: "PM2.5",
            value: currentData.aqi.pollutants.pm2_5,
            unit: "µg/m³",
            pct: Math.min((currentData.aqi.pollutants.pm2_5 / 100) * 100, 100),
            level:
              currentData.aqi.pollutants.pm2_5 <= 15
                ? "good"
                : currentData.aqi.pollutants.pm2_5 <= 35
                ? "fair"
                : "moderate",
          },
          {
            name: "PM10",
            value: currentData.aqi.pollutants.pm10,
            unit: "µg/m³",
            pct: Math.min((currentData.aqi.pollutants.pm10 / 180) * 100, 100),
            level:
              currentData.aqi.pollutants.pm10 <= 50
                ? "good"
                : currentData.aqi.pollutants.pm10 <= 100
                ? "fair"
                : "moderate",
          },
          {
            name: "NO₂",
            value: currentData.aqi.pollutants.no2,
            unit: "µg/m³",
            pct: Math.min((currentData.aqi.pollutants.no2 / 100) * 100, 100),
            level:
              currentData.aqi.pollutants.no2 <= 25
                ? "good"
                : currentData.aqi.pollutants.no2 <= 50
                ? "fair"
                : "moderate",
          },
          {
            name: "O₃",
            value: currentData.aqi.pollutants.o3,
            unit: "µg/m³",
            pct: Math.min((currentData.aqi.pollutants.o3 / 100) * 100, 100),
            level:
              currentData.aqi.pollutants.o3 <= 30
                ? "good"
                : currentData.aqi.pollutants.o3 <= 60
                ? "fair"
                : "moderate",
          },
          {
            name: "CO",
            value: currentData.aqi.pollutants.co,
            unit: "µg/m³",
            pct: Math.min((currentData.aqi.pollutants.co / 10) * 100, 100),
            level:
              currentData.aqi.pollutants.co <= 2
                ? "good"
                : currentData.aqi.pollutants.co <= 6
                ? "fair"
                : "moderate",
          },
        ];

  return (
    <main className={`dashboard ${sevClass}`}>
      <header className="dashboard-page-header">
        <h1 className="dashboard-page-title">DASHBOARD</h1>
      </header>
      {/* ── Section 1: Hero ─────────────────────────── */}
      <Hero
        location={`${currentData.location.city}, ${currentData.location.state}`}
        updatedAt={new Date(currentData.aqi.fetchedAt).toLocaleString()}
        aqiValue={currentData.aqi.aqiValue}
        aqiLabel={currentData.aqiLabel}
        exposureScore={currentData.exposureScore}
        exposureLabel={currentData.exposureLabel}
        onFetch={handleFetch}
      />

      {/* ── Section 2: Decision Strip ────────────────── */}
      {/* CHANGE 2: exposureScore removed — now lives in hero */}
      <DecisionStrip
        riskLevel={currentData.riskLevel}
        action={currentData.nextBestAction?.message || "No action available"}
        actionDetail=""
      />

      {/* ── Section 3: Content Grid ──────────────────── */}
      <div className="content-grid">
        <HealthAdvisory
          items={currentData.healthAdvisory?.doNext || []}
        />
        
        <PollutantBreakdown pollutants={pollutantData} />
      </div>

      {/* ── Section 4: Trend ─────────────────────────── */}
      <TrendPanel
        values={trendValues.length ? trendValues : [0]}
        labels={trendLabels.length ? trendLabels : ["Now"]}
        sevClass={sevClass}
      />

    </main>
  );
}