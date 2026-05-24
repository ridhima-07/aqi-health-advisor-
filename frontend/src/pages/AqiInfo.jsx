import "../styles/AqiInfo.css";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { getAqiByCity } from "../services/aqi";

const AQI_LEVELS = [
  {
    range: "0 – 50",
    label: "Good",
    color: "#3DDC84",
    bg: "rgba(61,220,132,0.08)",
    description: "Air quality is satisfactory. Little or no risk for the general population.",
  },
  {
    range: "51 – 100",
    label: "Fair",
    color: "#F5C842",
    bg: "rgba(245,200,66,0.08)",
    description: "Acceptable air quality. Sensitive individuals may experience minor effects.",
  },
  {
    range: "101 – 150",
    label: "Moderate",
    color: "#FF8C42",
    bg: "rgba(255,140,66,0.08)",
    description: "Unhealthy for sensitive groups. General public is not significantly affected.",
  },
  {
    range: "151 – 200",
    label: "Poor",
    color: "#FF4C4C",
    bg: "rgba(255,76,76,0.08)",
    description: "Everyone may begin to experience health effects. Sensitive groups at higher risk.",
  },
  {
    range: "201 – 300",
    label: "Very Poor",
    color: "#c084fc",
    bg: "rgba(192,132,252,0.08)",
    description: "Health alert: everyone may experience more serious health effects.",
  },
  {
    range: "301+",
    label: "Hazardous",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
    description: "Emergency conditions. Entire population is likely to be affected.",
  },
];

const POLLUTANTS = [
  {
    id: "PM2.5",
    name: "PM2.5",
    formula: null,
    explanation: "Fine particulate matter smaller than 2.5 microns — invisible to the naked eye.",
    impact: "Penetrates deep into lungs and bloodstream; linked to cardiovascular and respiratory disease.",
  },
  {
    id: "PM10",
    name: "PM10",
    formula: null,
    explanation: "Coarse particles up to 10 microns from dust, pollen, and construction.",
    impact: "Irritates the upper respiratory tract; worsens asthma and allergies.",
  },
  {
    id: "NO2",
    name: "NO₂",
    formula: true,
    explanation: "Nitrogen dioxide produced mainly by vehicle exhaust and industrial combustion.",
    impact: "Inflames airways; increases susceptibility to respiratory infections.",
  },
  {
    id: "O3",
    name: "O₃",
    formula: true,
    explanation: "Ground-level ozone formed when sunlight reacts with pollutants — not the protective stratospheric layer.",
    impact: "Triggers chest pain, coughing, and aggravates asthma.",
  },
  {
    id: "CO",
    name: "CO",
    formula: true,
    explanation: "Carbon monoxide from incomplete combustion of fuels — odourless and colourless.",
    impact: "Reduces blood's oxygen-carrying capacity; dangerous at high concentrations.",
  },
  {
    id: "SO2",
    name: "SO₂",
    formula: true,
    explanation: "Sulfur dioxide is produced mainly by burning fossil fuels such as coal and oil in power plants and industries.",
    impact: "Can irritate the nose, throat, and lungs, especially in people with asthma or other respiratory conditions.",
    },
];

const SENSITIVE_GROUPS = [
  { icon: "🫁", label: "Asthma & COPD", note: "Airway inflammation is worsened by elevated PM2.5 and ozone." },
  { icon: "🚬", label: "Smokers", note: "Combined exposure compounds long-term lung damage significantly." },
  { icon: "❤️", label: "Heart Conditions", note: "Fine particles can trigger cardiac events in at-risk individuals." },
  { icon: "👶", label: "Children", note: "Developing lungs are more vulnerable; effects may be permanent." },
  { icon: "🧓", label: "Elderly", note: "Reduced immune response makes pollution exposure harder to tolerate." },
];

const DID_YOU_KNOW = [
  {
    stat: "≈ 1–3 cigarettes",
    context: "A full day in a city with AQI 150+ can expose your lungs to particulate levels roughly comparable to smoking a few cigarettes.",
  },
  {
    stat: "2× higher risk",
    context: "Long-term exposure to elevated PM2.5 is associated with approximately double the risk of certain respiratory diseases.",
  },
  {
    stat: "~7 million",
    context: "The WHO estimates around 7 million premature deaths annually are linked to ambient and household air pollution.",
  },
];

function SectionLabel({ children }) {
  return <p className="ai-section-label">{children}</p>;
}

function SectionHeading({ children }) {
  return <h2 className="ai-section-heading">{children}</h2>;
}

function getAqiColor(label) {
  switch (label) {
    case "Good":
      return "#3DDC84";
    case "Fair":
      return "#F5C842";
    case "Moderate":
      return "#FF8C42";
    case "Poor":
    case "Very Poor":
    case "Hazardous":
      return "#FF4C4C";
    default:
      return "#EEEEEE";
  }
}

function getAqiClass(label) {
  switch (label) {
    case "Good":
      return "ai-result-good";
    case "Fair":
      return "ai-result-fair";
    case "Moderate":
      return "ai-result-moderate";
    case "Poor":
    case "Very Poor":
    case "Hazardous":
      return "ai-result-poor";
    default:
      return "";
  }
}

export default function AqiInfo({ userId, onLogout }) {
    const [city, setCity] = useState("");
    const [aqiData, setAqiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSearch() {
        try {
            if (!city.trim()) return;

            setLoading(true);
            setError("");
            setAqiData(null);

            const result = await getAqiByCity(city.trim());
            setAqiData(result.data);
        } catch (err) {
            setError("Could not fetch AQI for that location.");
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="ai-root">
        <Navbar userId={userId} onLogout={onLogout} />
      <section className="ai-section ai-section--alt ai-cta-section">
        <div className="ai-container">
            <div className="ai-cta-inner">
            <SectionLabel>Explore</SectionLabel>
            <h2 className="ai-section-heading">Check AQI Anywhere</h2>
            <p className="ai-body-text ai-cta-body">
                Search any city to view its current air quality and pollutant levels.
            </p>

            <div className="ai-cta-search">
                <input
                className="ai-cta-input"
                type="text"
                placeholder="e.g. Mumbai, Delhi, Bangalore…"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                }}
                disabled={loading}
                />
                <button className="ai-cta-btn" onClick={handleSearch} disabled={loading}>
                {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {error && <p className="ai-cta-note ai-cta-error">{error}</p>}

            {aqiData && aqiData.location && (
               <div className={`ai-search-result ${getAqiClass(aqiData.aqiLabel)}`}>
                <div className="ai-search-result-top">
                    <div>
                    <p className="ai-search-location">
                        {aqiData.location.name}
                        {aqiData.location.state ? `, ${aqiData.location.state}` : ""}
                        {aqiData.location.country ? `, ${aqiData.location.country}` : ""}
                    </p>
                    <p className="ai-search-time">
                        Updated {new Date(aqiData.fetchedAt).toLocaleString()}
                    </p>
                    </div>

                    <div className="ai-search-aqi-block">
                    <div className="ai-search-aqi-number" style={{ color: getAqiColor(aqiData.aqiLabel) }}>{aqiData.aqiValue}</div>
                    <div className="ai-search-aqi-badge" style={{
                        color: getAqiColor(aqiData.aqiLabel),
                        background: `${getAqiColor(aqiData.aqiLabel)}14`,
                        borderColor: `${getAqiColor(aqiData.aqiLabel)}40`,
                    }} > {aqiData.aqiLabel} </div>
                    </div>
                </div>

                {aqiData.dominantPollutant && (
                    <p className="ai-search-dominant">
                    Main pollutant: {aqiData.dominantPollutant}
                    </p>
                )}

                <div className="ai-search-pollutants">
                  <div className="ai-search-pill ai-search-pill--moderate">PM2.5: {aqiData.pollutants.pm2_5}</div>
                  <div className="ai-search-pill ai-search-pill--moderate">PM10: {aqiData.pollutants.pm10}</div>
                  <div className="ai-search-pill ai-search-pill--fair">NO₂: {aqiData.pollutants.no2}</div>
                  <div className="ai-search-pill ai-search-pill--fair">O₃: {aqiData.pollutants.o3}</div>
                  <div className="ai-search-pill ai-search-pill--good">CO: {(aqiData.pollutants.co / 1000).toFixed(3)} mg/m³</div>
                  <div className="ai-search-pill ai-search-pill--good">SO₂: {aqiData.pollutants.so2}</div>
                </div>
                </div>
            )}
            </div>
        </div>
      </section>

      <section className="ai-hero">
        <div className="ai-hero-inner">
          <div className="ai-hero-tag">
            <span className="ai-hero-dot" />
            AQI IQ — Knowledge Base
          </div>
          <h1 className="ai-hero-title">AQI Info</h1>
          <p className="ai-hero-sub">
            The Air Quality Index is a standardised scale that translates complex
            pollutant data into a single number — so you can make informed decisions
            about when and how to protect your health.
          </p>
        </div>
        <div className="ai-hero-rule" />
      </section>

      <section className="ai-section">
        <div className="ai-container">
          <SectionLabel>Basics</SectionLabel>
          <SectionHeading>What is AQI?</SectionHeading>
          <p className="ai-body-text">
            AQI stands for Air Quality Index — a numerical scale used by governments
            and environmental agencies to communicate how polluted the air is at a given
            time. Higher values mean more pollution and greater potential health risk.
          </p>

          <div className="ai-trio-grid">
            <div className="ai-trio-card">
              <span className="ai-trio-icon">📡</span>
              <h3 className="ai-trio-title">What it measures</h3>
              <p className="ai-trio-text">
                Concentrations of key pollutants including fine particles (PM2.5), coarse
                particles (PM10), ozone, nitrogen dioxide, and carbon monoxide.
              </p>
            </div>
            <div className="ai-trio-card">
              <span className="ai-trio-icon">⚠️</span>
              <h3 className="ai-trio-title">Why it matters</h3>
              <p className="ai-trio-text">
                Even short-term exposure to elevated AQI can trigger respiratory symptoms.
                Chronic exposure carries long-term health consequences.
              </p>
            </div>
            <div className="ai-trio-card">
              <span className="ai-trio-icon">👥</span>
              <h3 className="ai-trio-title">Who it affects</h3>
              <p className="ai-trio-text">
                Everyone — but particularly those with pre-existing conditions, the very
                young, and the elderly face the highest risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ai-section ai-section--alt">
        <div className="ai-container">
          <SectionLabel>Scale</SectionLabel>
          <SectionHeading>AQI Levels</SectionHeading>
          <p className="ai-body-text">
            Each AQI range corresponds to a health category and a recommended level of
            caution. Knowing where today's reading falls helps you decide what's safe.
          </p>

          <div className="ai-levels-list">
            {AQI_LEVELS.map((level) => (
              <div
                key={level.label}
                className="ai-level-row"
                style={{ "--level-color": level.color, "--level-bg": level.bg }}
              >
                <div className="ai-level-bar" />
                <div className="ai-level-range">{level.range}</div>
                <div
                  className="ai-level-badge"
                  style={{ color: level.color, background: level.bg }}
                >
                  {level.label}
                </div>
                <p className="ai-level-desc">{level.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ai-section">
        <div className="ai-container">
          <SectionLabel>Pollutants</SectionLabel>
          <SectionHeading>What's in the Air</SectionHeading>
          <p className="ai-body-text">
            AQI is calculated from measurements of several distinct pollutants — each with
            its own sources and health implications.
          </p>

          <div className="ai-pollutants-grid">
            {POLLUTANTS.map((p) => (
              <div key={p.id} className="ai-pollutant-card">
                <div className="ai-pollutant-header">
                  <span className="ai-pollutant-name">{p.name}</span>
                </div>
                <p className="ai-pollutant-explanation">{p.explanation}</p>
                <div className="ai-pollutant-divider" />
                <div className="ai-pollutant-impact-label">Health impact</div>
                <p className="ai-pollutant-impact">{p.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ai-section ai-section--alt">
        <div className="ai-container">
          <SectionLabel>Sensitive Groups</SectionLabel>
          <SectionHeading>Who Should Be Careful</SectionHeading>
          <p className="ai-body-text">
            Air quality affects everyone, but certain groups are significantly more
            vulnerable to even moderate pollution levels.
          </p>

          <div className="ai-groups-grid">
            {SENSITIVE_GROUPS.map((g) => (
              <div key={g.label} className="ai-group-card">
                <span className="ai-group-icon">{g.icon}</span>
                <div>
                  <h4 className="ai-group-label">{g.label}</h4>
                  <p className="ai-group-note">{g.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ai-section ai-dyk-section">
        <div className="ai-container">
          <div className="ai-dyk-header">
            <SectionLabel>Real-World Impact</SectionLabel>
            <SectionHeading>Did You Know?</SectionHeading>
            <p className="ai-body-text">
              Abstract numbers become real when put in perspective. These approximate
              comparisons illustrate why air quality monitoring matters.
            </p>
          </div>

          <div className="ai-dyk-grid">
            {DID_YOU_KNOW.map((item, i) => (
              <div key={i} className="ai-dyk-card">
                <div className="ai-dyk-stat">{item.stat}</div>
                <p className="ai-dyk-context">{item.context}</p>
              </div>
            ))}
          </div>

          <p className="ai-dyk-disclaimer">
            ⓘ These are approximate comparisons based on pollution exposure research and
            should not be taken as precise medical equivalencies.
          </p>
        </div>
      </section>

      <section className="ai-section">
        <div className="ai-container">
          <SectionLabel>Our Approach</SectionLabel>
          <SectionHeading>How AQI IQ Is Different</SectionHeading>
          <p className="ai-body-text">
            Most AQI tools show you a number. AQI IQ shows you what that number means
            for you specifically — based on your health profile and location.
          </p>

          <div className="ai-compare-grid">
            <div className="ai-compare-card ai-compare-card--generic">
              <div className="ai-compare-label">Typical AQI Apps</div>
              <ul className="ai-compare-list">
                <li>Generic AQI reading for a city</li>
                <li>Same data for every user</li>
                <li>No health context</li>
                <li>No personalised recommendations</li>
                <li>Raw numbers only</li>
              </ul>
            </div>

            <div className="ai-compare-card ai-compare-card--aqiiq">
              <div className="ai-compare-label ai-compare-label--branded">
                <span className="ai-compare-dot" /> AQI IQ
              </div>
              <ul className="ai-compare-list ai-compare-list--branded">
                <li>Personalised exposure score</li>
                <li>Health profile–aware risk assessment</li>
                <li>Condition-specific recommendations</li>
                <li>Daily advisory tailored to you</li>
                <li>Location-accurate live data</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}