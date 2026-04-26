// ============================================================
// Recommendations.jsx — AQI IQ | Action Plan
//
// Props (from App.jsx routing):
//   userId  — string | number
//
// Fetches from: GET /dashboard/:userId   (same as Dashboard)
// Backend response shape (result.data):
//   aqi.aqiValue            — number
//   aqiLabel                — string  ("Good" | "Fair" | "Moderate" | "Poor")
//   riskLevel               — string
//   nextBestAction.message  — string
//   healthAdvisory.doNext   — string[]
//   location.city / .state  — string
//   recommendations         — { category, priority, message }[]
//     (new field — falls back to derived items if absent from backend)
// ============================================================

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getDashboardData } from "../services/dashboardService";
import "../styles/Recommendations.css";

// ─── Helpers ────────────────────────────────────────────────

function severityClass(v) {
  if (v <= 50)  return "sev-good";
  if (v <= 100) return "sev-fair";
  if (v <= 150) return "sev-moderate";
  return "sev-poor";
}

function aqiColor(v) {
  if (v <= 50)  return "#4ade80";
  if (v <= 100) return "#facc15";
  if (v <= 150) return "#fb923c";
  return "#f87171";
}

// Priority sort order — High first
const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

function sortByPriority(items) {
  return [...items].sort((a, b) => Number(b.priority ?? 0) - Number(a.priority ?? 0));
}

function normalizePriority(priority) {
  const value = Number(priority);

  if (value >= 9) return "High";
  if (value >= 6) return "Medium";
  return "Low";
}

function normalizeCategory(category) {
  switch (category) {
    case "health_profile":
      return "Health";
    case "pollution":
      return "Pollution";
    case "general":
      return "General";
    default:
      return category || "General";
  }
}

function deriveRecommendations(healthAdvisory, aqiValue) {
  const items = healthAdvisory?.doNext ?? [];
  return items.map((message, i) => ({
    category: ["Outdoor", "Health", "Lifestyle"][i % 3],
    priority: aqiValue > 150 ? "High" : aqiValue > 100 ? "Medium" : "Low",
    message,
  }));
}

// Insight paragraph 
function buildInsight(aqiValue, city) {
  const place = city || "your area";
  if (aqiValue <= 50)
    return `Air quality in ${place} is good today. Most activities carry minimal risk, though those with respiratory sensitivities should stay alert to any changes.`;
  if (aqiValue <= 100)
    return `Today's air quality in ${place} is fair. Sensitive individuals — including those with asthma or heart conditions — may want to moderate prolonged outdoor activity.`;
  if (aqiValue <= 150)
    return `Air quality in ${place} is elevated. Breathing discomfort is possible during extended outdoor exertion, particularly if you have a pre-existing health condition.`;
  return `Air quality in ${place} is poor right now. Outdoor exposure should be minimised for everyone — not just sensitive groups. Follow the guidance below carefully.`;
}

// ─── Config ──────────────────────────────────────────────────

const PRIORITY_CONFIG = {
  High:   { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
  Medium: { color: "#fb923c", bg: "rgba(251,146,60,0.12)"  },
  Low:    { color: "#4ade80", bg: "rgba(74,222,128,0.12)"  },
};

const CATEGORY_CONFIG = {
  General:   { color: "#60a5fa", bg: "rgba(96,165,250,0.10)" },
  Health:    { color: "#c084fc", bg: "rgba(192,132,252,0.10)" },
  Pollution: { color: "#34d399", bg: "rgba(52,211,153,0.10)" },
};

function getPriorityStyle(priority) {
  return PRIORITY_CONFIG[priority] ?? { color: "#9BA4B5", bg: "rgba(155,164,181,0.10)" };
}

function getCategoryStyle(category) {
  return CATEGORY_CONFIG[category] ?? { color: "#9BA4B5", bg: "rgba(155,164,181,0.10)" };
}

// ─── Sub-components ──────────────────────────────────────────

function Badge({ label, color, bg }) {
  return (
    <span className="rec-badge" style={{ color, background: bg }}>
      {label}
    </span>
  );
}

// A single card in the vertical feed
function RecCard({ item, index }) {
  const displayPriority = normalizePriority(item.priority);
  const pri = getPriorityStyle(displayPriority);
  const displayCategory = normalizeCategory(item.category);
  const cat = getCategoryStyle(displayCategory);

  return (
    <li
      className="rec-card"
      style={{ "--card-accent": pri.color, animationDelay: `${index * 45}ms` }}
    >
      {/* Left color bar encodes priority */}
      <div className="rec-card-bar" />

      <div className="rec-card-body">
        <div className="rec-card-top">
          <div className="rec-card-badges">
            <Badge label={displayCategory} color={cat.color} bg={cat.bg} />
            <Badge label={displayPriority} color={pri.color} bg={pri.bg} />
          </div>
        </div>
        <p className="rec-card-message">{item.message}</p>
      </div>
    </li>
  );
}

// Compact priority breakdown 
function PriorityBreakdown({ items }) {
  const counts = items.reduce((acc, r) => {
    const key = normalizePriority(r.priority);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const entries = ["High", "Medium", "Low"]
    .filter((k) => counts[k])
    .map((k) => ({ key: k, count: counts[k], ...getPriorityStyle(k) }));

  if (!entries.length) return null;

  return (
    <div className="rec-breakdown">
      {entries.map((e, i) => (
        <span key={e.key} className="rec-breakdown-item">
          <span className="rec-breakdown-dot" style={{ background: e.color }} />
          <span className="rec-breakdown-text" style={{ color: e.color }}>
            {e.count} {e.key}
          </span>
          {i < entries.length - 1 && (
            <span className="rec-breakdown-sep">·</span>
          )}
        </span>
      ))}
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────

export default function Recommendations({ userId, onLogout }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!userId) return;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const result = await getDashboardData(userId);
        setData(result.data);
      } catch (err) {
        setError("Could not load recommendations. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  // ── Loading state ────────────────────────────────────────
  if (loading) {
    return (
      <main className="rec-page">
        <Navbar userId={userId} onLogout={onLogout} />
        <div className="rec-shell">
          <header className="rec-page-header">
            <h1 className="rec-page-title">RECOMMENDATIONS</h1>
          </header>
          <p className="rec-status">Loading your recommendations…</p>
        </div>
      </main>
    );
  }

  // ── Error state ──────────────────────────────────────────
  if (error || !data) {
    return (
      <main className="rec-page">
        <Navbar userId={userId} onLogout={onLogout} />
        <div className="rec-shell">
          <header className="rec-page-header">
            <h1 className="rec-page-title">RECOMMENDATIONS</h1>
          </header>
          <p className="rec-status rec-status--error">
            {error || "No data available."}
          </p>
        </div>
      </main>
    );
  }

  // ── Derived display values ───────────────────────────────
  const aqiValue    = data.aqi?.aqiValue ?? 0;
  const aqiLabel    = data.aqiLabel      ?? "—";
  const riskLevel   = data.riskLevel     ?? "—";
  const city        = data.location?.city  ?? "";
  const state       = data.location?.state ?? "";
  const locationStr = [city, state].filter(Boolean).join(", ") || "Your location";
  const mainAction  = data.nextBestAction?.message ?? "Follow today's guidance below";
  const sevClass    = severityClass(aqiValue);
  const color       = aqiColor(aqiValue);
  const insight     = buildInsight(aqiValue, city);

  const rawRecs =
    Array.isArray(data.recommendations) && data.recommendations.length > 0
      ? data.recommendations
      : deriveRecommendations(data.healthAdvisory, aqiValue);

  const recommendations = sortByPriority(rawRecs);

  return (
    <main className={`rec-page ${sevClass}`}>
      <Navbar userId={userId} onLogout={onLogout} />

      <div className="rec-shell">

        {/* Page title */}
        <header className="rec-page-header">
          <h1 className="rec-page-title">RECOMMENDATIONS</h1>
        </header>

        {/* ══════════════════════════════════════════════
            1. AQI SUMMARY CARD
        ══════════════════════════════════════════════ */}
        <section
          className="rec-summary"
          style={{ "--sev-color": color }}
          aria-label="Current AQI summary"
        >
          {/* AQI number + label */}
          <div className="rec-summary-left">
            <span className="rec-summary-number">{aqiValue}</span>
            <div className="rec-summary-meta">
              <span className="rec-summary-label">{aqiLabel}</span>
              <span className="rec-summary-location">📍 {locationStr}</span>
            </div>
          </div>

          <div className="rec-summary-divider" />

          {/* Risk + action */}
          <div className="rec-summary-right">
            <p className="rec-summary-risk-eyebrow">Risk Level</p>
            <p className="rec-summary-risk-value">{riskLevel}</p>
            <p className="rec-summary-action">{mainAction}</p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            2. PERSONALISED INSIGHT
        ══════════════════════════════════════════════ */}
        <section className="rec-insight" aria-label="Today's context">
          <p className="rec-insight-eyebrow">Today's Context</p>
          <p className="rec-insight-text">{insight}</p>
        </section>

        {/* ══════════════════════════════════════════════
            3. RECOMMENDATION FEED
        ══════════════════════════════════════════════ */}
        <section className="rec-feed" aria-label="Recommendations">
          <div className="rec-feed-header">
            <div className="rec-feed-header-left">
              <p className="rec-feed-eyebrow">Action Plan</p>
              <h2 className="rec-feed-title">
                {recommendations.length} recommendation
                {recommendations.length !== 1 ? "s" : ""} for today
              </h2>
            </div>
            <PriorityBreakdown items={recommendations} />
          </div>

          {recommendations.length > 0 ? (
            <ul className="rec-feed-list">
              {recommendations.map((item, i) => (
                <RecCard key={i} item={item} index={i} />
              ))}
            </ul>
          ) : (
            <div className="rec-feed-empty">
              <p>No recommendations available for today's conditions.</p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}