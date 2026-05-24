import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getDashboardData, fetchLatestAqi } from "../services/dashboardService";
import "../styles/Dashboard.css";

function severityClass(aqiValue) {
  if (aqiValue <= 50)  return 'sev-good';
  if (aqiValue <= 100) return 'sev-fair';
  if (aqiValue <= 200) return 'sev-moderate';
  return 'sev-poor';
}

function aqiToPercent(value) {
  return Math.min(100, Math.max(0, (value / 500) * 100));
}

function formatTrendTime(dateValue) {
  if (!dateValue) return "Now";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Now";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

function ExposureRing({ score, label }) {
  const RADIUS = 51;                        
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const dashOffset = CIRCUMFERENCE * (1 - score / 100);

  return (
    <div className="hero-exposure" aria-label={`Exposure score ${score} out of 100, ${label}`}>
      <div className="exposure-ring-wrap">
        <svg
          className="exposure-ring-svg"
          viewBox="0 0 136 136"              
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
            cx="68" cy="68" r={RADIUS}     
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="8.5"              
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
            transform="rotate(-90 68 68)"  
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

function Hero({ location, updatedAt, aqiValue, aqiLabel, exposureScore, exposureLabel, cigaretteEquivalent, onFetch, fetching, dominantPollutant }) {
  const thumbLeft = aqiToPercent(aqiValue);

  const pollutantMap = {
    pm2_5: "PM2.5",
    pm10: "PM10",
    no2: "NO₂",
    o3: "O₃",
    co: "CO",
    so2: "SO₂",
  };

  return (
    <section className="hero" aria-label="Current AQI">

      {/* Top bar */}
      <div className="hero-bar">
        <div className="hero-location-group">
          <span className="hero-location">{location}</span>
          <span className="hero-updated">{updatedAt}</span>
        </div>

        <button className="fetch-btn" onClick={onFetch} disabled={fetching} aria-label="Fetch latest AQI">
          <RefreshIcon />
          {fetching ? "Fetching..." : "Fetch Latest"}
        </button>
      </div>

      {/* Main body */}
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
            {dominantPollutant && (
              <p className="dominant">
                Dominant pollutant:{" "}
                {pollutantMap[dominantPollutant] || dominantPollutant}
              </p>
            )}
          </div>

          <div className="aqi-scale">
            <div className="scale-track">
              <div
                className="scale-thumb"
                style={{ left: `${thumbLeft}%` }}
                role="img"
                aria-label={`${aqiValue} on scale of 0 to 500`}
              />
              {cigaretteEquivalent && (
                <p className="aqi-fact">
                  ⚠️ Roughly comparable to smoking {cigaretteEquivalent} today
                </p>
              )}
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

function DecisionStrip({ riskLevel, action, actionDetail }) {
  return (
    <div className="strip" role="region" aria-label="Decision summary">

      <div className="strip-item">
        <span className="strip-label">Risk Level</span>
        <span className="strip-value">{riskLevel}</span>
      </div>

      <div className="strip-item strip-item--action">
        <span className="strip-label">Today’s Priority</span>
        <span className="strip-value">
          {action}{' '}
          <span>{actionDetail}</span>
        </span>
        <Link to="/recommendations" className="view-all-link">
          Open full action plan →
        </Link>
      </div>

    </div>
  );
}

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

function HealthAdvisory({ items }) {
  return (
    <div className="panel" id="advisory">
      <h2 className="panel-title">Health Advisory</h2>
      <ul className="advisory-list" aria-label="Health advisory points">
        {items.map((text, i) => (
          <li key={i} className="advisory-item">
            <span className="advisory-dot" aria-hidden="true" />
            <BoldActionWord text={text} />
          </li>
        ))}
      </ul>
    </div>
  );
}

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
                <span className="pollutant-value">
                  {p.key === "co"
                    ? (p.value / 1000).toFixed(3)
                    : p.value?.toFixed(2)}{" "}
                  {p.unit}
                </span>
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

function TrendPanel({ values, labels }) {
  const W = 800;
  const H = 72;
  const PAD = 10;
  const numericValues = values.map(Number);
  const max = Math.max(...numericValues);
  const min = Math.min(...numericValues);

  const rawRange = max - min;
  const padding = Math.max(8, rawRange * 0.25);

  const chartMin = Math.max(0, min - padding);
  const chartMax = Math.min(500, max + padding);
  const chartRange = chartMax - chartMin || 1;

  const points = values.map((v, i) => {
    const x =
      values.length === 1
        ? W / 2
        : PAD + (i / (values.length - 1)) * (W - PAD * 2);

    const y = H - PAD - (((v - chartMin) / chartRange) * (H - PAD * 2));
    return `${x},${y}`;
  });

  const polyline = points.join(' ');
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

        <path className="trend-area" d={areaPath} />

        <polyline className="trend-line" points={polyline} />

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
        {labels.map((label, index) => {
          const left =
            labels.length === 1
              ? 50
              : (index / (labels.length - 1)) * 100;

          const shouldShow =
            index === 0 || index === labels.length - 1 || index % 2 === 0;

          return (
            <span
              key={`${label}-${index}`}
              className="trend-label"
              style={{ left: `${left}%` }}
            >
              {shouldShow ? label : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard({userId, onLogout}) {

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aqiHistory, setAqiHistory] = useState([]);
  const [fetching, setFetching] = useState(false);

  const currentData = dashboardData || null;

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const result = await getDashboardData(userId);
        setDashboardData(result.data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      loadDashboard();
    }
  }, [userId]);

  useEffect(() => {
    if (!currentData) return;

    const backendHistory = currentData.aqiHistory || [];

    if (backendHistory.length) {
      setAqiHistory(
        backendHistory.slice(-8).map((item) => ({
          label: formatTrendTime(item.fetchedAt || item.created_at || item.timestamp),
          value: item.aqiValue || item.aqi_value || 0,
        }))
      );
    } else if (currentData.aqi?.aqiValue) {
      setAqiHistory([
        {
          label: formatTrendTime(currentData.aqi.fetchedAt || new Date()),
          value: currentData.aqi.aqiValue,
        },
      ]);
    }
  }, [currentData]);

  async function handleFetch() {
    try {
      if (!dashboardData?.location?.id || fetching) return;

      setFetching(true);
      setError("");

      await fetchLatestAqi(dashboardData.location.id);

      const refreshed = await getDashboardData(dashboardData.user.id);
      setDashboardData(refreshed.data);
    } catch (err) {
      setError("Failed to fetch latest AQI.");
    } finally {
      setFetching(false);
    }
  }

  if (loading) {
  return (
    <main className="dashboard">
      <Navbar userId={userId} onLogout={onLogout} />
      <div className="dashboard-state-card">
        Loading your dashboard...
      </div>
    </main>
  );
}

  if (error) {
  return (
    <main className="dashboard">
      <Navbar userId={userId} onLogout={onLogout} />
      <div className="dashboard-state-card dashboard-state-card--error">
        <p>{error}</p>
        <button className="dashboard-state-btn" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    </main>
  );
}

  if (!currentData) {
          return null;
        }

  const effectiveHistory =
    aqiHistory.length > 0
      ? aqiHistory
      : [
          {
            label: "Now",
            value: currentData.aqi.aqiValue,
          },
        ];

  const trendValues = effectiveHistory.map((item) => item.value);
  const trendLabels = effectiveHistory.map((item) => item.label);
  const coMg = currentData.aqi.pollutants.co / 1000;

  const sevClass = currentData?.aqi?.aqiValue
  ? severityClass(currentData.aqi.aqiValue)
  : "sev-moderate";

  const pollutantData = [
          {
            key: "pm2_5",
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
            key: "pm10",
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
            key: "no2",
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
            key: "o3",
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
            key: "co",
            name: "CO",
            value: currentData.aqi.pollutants.co,
            unit: "mg/m³",
            pct: Math.min((coMg / 10) * 100, 100),
            level:
              coMg <= 2
                ? "good"
                : coMg <= 6
                ? "fair"
                : "moderate",
          },
        ];

  return (
    <main className={`dashboard ${sevClass}`}>
      <Navbar userId={userId} onLogout={onLogout} />
      <header className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">DASHBOARD</h1>
          <p className="dashboard-page-subtitle">
            Your personalized air quality overview
          </p>
        </div>
      </header>
      <Hero
        location={`${currentData.location.city}${currentData.location.state ? `, ${currentData.location.state}` : ""}`}
        updatedAt={new Date(currentData.aqi.fetchedAt).toLocaleString()}
        aqiValue={currentData.aqi.aqiValue}
        aqiLabel={currentData.aqiLabel}
        exposureScore={currentData.exposureScore}
        exposureLabel={currentData.exposureLabel}
        cigaretteEquivalent={currentData.cigaretteEquivalent}
        dominantPollutant={dashboardData?.aqi?.dominantPollutant}
        onFetch={handleFetch}
        fetching={fetching}
      />

      {/* ── Section 2: Decision Strip ────────────────── */}
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
      />

      <div className="dashboard-links-grid">
        <Link to="/recommendations" className="dashboard-link-card">
          <span className="dashboard-link-label">Action Plan</span>
          <strong>View full recommendations</strong>
          <p>
            See personalized actions based on your current AQI, exposure score, and health profile.
          </p>
        </Link>

        <Link to="/aqi-info" className="dashboard-link-card">
          <span className="dashboard-link-label">AQI Guide</span>
          <strong>Learn and check any city</strong>
          <p>
            Understand AQI levels, pollutants, and search live air quality for another location.
          </p>
        </Link>
      </div>

    </main>
  );
}