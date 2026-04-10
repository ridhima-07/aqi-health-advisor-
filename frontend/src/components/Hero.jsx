// ============================================================
// Hero.jsx — AQI IQ | Hero + Setup Journey
//
// Contains TWO sections:
//   1. HeroSection  — headline, AQI preview card, scroll indicator
//   2. SetupJourney — vertical step tracker (left) + form panel (right)
//
// All styling lives in Hero.css.
// Placeholder data is clearly marked → replace with API data later.
// ============================================================

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import "../styles/Hero.css";
import { createUser } from "../services/userService";
import { createHealthProfile } from "../services/healthService";
import { createLocation } from "../services/locationService";

// ─────────────────────────────────────────────────────────────
// PLACEHOLDER DATA  →  replace with backend API response later
// ─────────────────────────────────────────────────────────────

// → backend: current AQI data for the user's location
const AQI_CARD_DATA = {
  location:       "Mumbai, India",
  aqi:            156,
  aqiLabel:       "Poor",
  exposureScore:  72,
  exposureLabel:  "High Risk",
  recommendation: "Avoid outdoor activity. Wear an N95 mask if going out.",
};

// Step definitions — copy only, no backend needed
const STEPS = [
  {
    id:    1,
    icon: "1",
    title: "Create Profile",
    hint:  "Basic details to set up your account",
  },
  {
    id:    2,
    icon: "2",
    title: "Health Details",
    hint:  "Your conditions affect your risk score",
  },
  {
    id:    3,
    icon: "3",
    title: "Location Setup",
    hint:  "We fetch live AQI for your area",
  },
  {
    id:    4,
    icon: "4",
    title: "Dashboard Ready",
    hint:  "Your personalized view awaits",
  },
];

// Health condition checkboxes — static list
const HEALTH_CONDITIONS = [
  { key: "isSmoker", label: "Smoker" },
  { key: "hasHeartCondition", label: "Heart Condition" },
  { key: "hasAsthma", label: "Asthma" },
  { key: "hasCOPD", label: "COPD" },
  { key: "hasAllergy", label: "Allergies" },
];


// ─────────────────────────────────────────────────────────────
// HELPER: returns color for a given AQI value
// ─────────────────────────────────────────────────────────────
function getAQIColor(aqi) {
  if (aqi <= 50)  return "#22c55e";   // Good
  if (aqi <= 100) return "#eab308";   // Fair
  if (aqi <= 150) return "#f97316";   // Moderate
  if (aqi <= 200) return "#ef4444";   // Poor
  return "#a855f7";                   // Hazardous
}

function getExposureColor(score) {
  if (score <= 40) return "#22c55e";
  if (score <= 70) return "#f97316";
  return "#ef4444";
}


// ─────────────────────────────────────────────────────────────
// SUB-COMPONENT: AQI Preview Card (hero right side)
// ─────────────────────────────────────────────────────────────
function AQICard({ data }) {
  const aqiColor = getAQIColor(data.aqi);
  const expColor = getExposureColor(data.exposureScore);

  return (
    <Box className="aqi-card" style={{ "--glow-color": aqiColor }}>

      {/* Radial glow based on AQI severity */}
      <Box className="aqi-card-glow" />

      {/* ── Top row: location + live badge ── */}
      <Box className="aqi-card-toprow">
        <Typography className="aqi-card-location">📍 {data.location}</Typography>
        <Box className="live-badge">
          <span className="live-dot" />
          Live
        </Box>
      </Box>

      {/* ── Big AQI number ── */}
      <Box className="aqi-number-block">
        <Typography className="aqi-number" style={{ color: aqiColor }}>
          {data.aqi}
        </Typography>
        <Box className="aqi-label-pill" style={{ background: aqiColor + "22", color: aqiColor }}>
          ● {data.aqiLabel}
        </Box>
      </Box>

      {/* ── Divider ── */}
      <Box className="aqi-card-divider" />

      {/* ── Exposure row ── */}
      <Box className="exposure-row">
        <Box>
          <Typography className="exp-eyebrow">Exposure Score</Typography>
          <Typography className="exp-value" style={{ color: expColor }}>
            {data.exposureScore}
            <span className="exp-denom">/100</span>
          </Typography>
        </Box>

        {/* Circular gauge */}
        <Box className="exp-gauge-wrap">
          <svg viewBox="0 0 72 72" className="exp-gauge-svg">
            <circle cx="36" cy="36" r="30" fill="none" stroke="#393E46" strokeWidth="6" />
            <circle
              cx="36" cy="36" r="30"
              fill="none"
              stroke={expColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 30 * data.exposureScore / 100} ${2 * Math.PI * 30}`}
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
            />
          </svg>
          <Box className="exp-gauge-badge" style={{ background: expColor + "22", color: expColor }}>
            {data.exposureLabel}
          </Box>
        </Box>
      </Box>

      {/* ── Recommendation ── */}
      <Box className="aqi-rec-box">
        <Typography className="aqi-rec-label">💡 Advisory</Typography>
        <Typography className="aqi-rec-text">{data.recommendation}</Typography>
      </Box>

      {/* ── AQI scale bar ── */}
      <Box className="aqi-scale-row">
        {[
          { label: "Good",   color: "#22c55e" },
          { label: "Fair",   color: "#eab308" },
          { label: "Mod",    color: "#f97316" },
          { label: "Poor",   color: "#ef4444" },
        ].map((lvl) => (
          <Box key={lvl.label} className="scale-item">
            <Box
              className="scale-dot"
              style={{
                background: lvl.color,
                opacity: lvl.label === data.aqiLabel ? 1 : 0.28,
                transform: lvl.label === data.aqiLabel ? "scale(1.4)" : "scale(1)",
              }}
            />
            <Typography
              className="scale-label"
              style={{ color: lvl.label === data.aqiLabel ? lvl.color : "#9BA4B5" }}
            >
              {lvl.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}


// ─────────────────────────────────────────────────────────────
// SUB-COMPONENT: Scroll Indicator (bottom of hero)
// ─────────────────────────────────────────────────────────────
function ScrollIndicator() {
  return (
    <Box className="scroll-indicator">
      <Typography className="scroll-text">Scroll to set up your profile</Typography>
      <Box className="scroll-arrow">↓</Box>
    </Box>
  );
}


// ─────────────────────────────────────────────────────────────
// SUB-COMPONENT: Step Tracker (left panel of Setup Journey)
// ─────────────────────────────────────────────────────────────
function StepTracker({ activeStep, completedSteps, onStepClick }) {
  return (
    <Box className="step-tracker">

      {/* Assistant guide text */}
      <Box className="assistant-bubble">
        <span className="assistant-icon">🤖</span>
        <Typography className="assistant-text">
          {activeStep === 0 && "Let's set up your profile for personalized insights."}
          {activeStep === 1 && "Add your health details so we can assess your risk accurately."}
          {activeStep === 2 && "Tell us where you are — we'll pull live AQI for your location."}
          {activeStep === 3 && "You're all set! Your dashboard is ready."}
        </Typography>
      </Box>

      {/* Step list */}
      <Box className="steps-list">
        {STEPS.map((step, index) => {
          const isActive    = index === activeStep;
          const isCompleted = completedSteps.includes(index);

          return (
            <Box
              key={step.id}
              className={`step-item ${isActive ? "step-item--active" : ""} ${isCompleted ? "step-item--done" : ""}`}
              onClick={() => onStepClick(index)}
            >
              {/* Vertical connector line (not shown on last item) */}
              {index < STEPS.length - 1 && (
                <Box className={`step-line ${isCompleted ? "step-line--done" : ""}`} />
              )}

              {/* Icon circle */}
              <Box className="step-circle">
                {isCompleted ? (
                  <span className="step-check">✔</span>
                ) : (
                  <span className="step-icon">{step.icon}</span>
                )}
              </Box>

              {/* Text */}
              <Box className="step-text-block">
                <Typography className="step-title">{step.title}</Typography>
                <Typography className="step-hint">{step.hint}</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}


// ─────────────────────────────────────────────────────────────
// SUB-COMPONENT: Form Panel (right panel of Setup Journey)
// One step shown at a time. Accepts formData + setter as props
// so the parent (Hero) owns all state — easy to send to backend.
// ─────────────────────────────────────────────────────────────
function FormPanel({ activeStep, formData, setFormData, onNext, onBack, loading, error }) {

  // Helper: update a single field inside formData
  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  // Helper: toggle a health condition boolean field
  // → backend: send formData booleans directly to API
  function toggleCondition(field) {
    setFormData((prev) => ({
        ...prev,
        [field]: !prev[field],
    }));
    }

  // Shared MUI TextField style overrides
  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      background: "#2a2f38",
      color: "#EEEEEE",
      "& fieldset": { borderColor: "#444c5c" },
      "&:hover fieldset": { borderColor: "#9BA4B5" },
      "&.Mui-focused fieldset": { borderColor: "#ef4444" },
    },
    "& .MuiInputLabel-root": { color: "#9BA4B5" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#ef4444" },
  };

  return (
    <Box className="form-panel">

      {/* ── Step 1: Create Profile ── */}
      {activeStep === 0 && (
        <Box className="form-step">
          <Typography className="form-step-title">Create your profile</Typography>
          <Typography className="form-step-sub">
            Start with your basic details so we can create your profile.
          </Typography>
          <Box className="form-fields">
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              sx={inputSx}
            />
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              sx={inputSx}
            />
            <TextField
                label="Date of Birth"
                type="date"
                fullWidth
                value={formData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={inputSx}
            />

            <TextField
                label="Gender"
                variant="outlined"
                fullWidth
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                sx={inputSx}
            />
          </Box>
        </Box>
      )}

      {/* ── Step 2: Health Details ── */}
      {activeStep === 1 && (
        <Box className="form-step">
          <Typography className="form-step-title">Your health profile</Typography>
          <Typography className="form-step-sub">
            Select any conditions that apply. This personalizes your exposure score.
          </Typography>
          {/* → backend: send health booleans directly */}
            <Box className="form-checkboxes">
                {HEALTH_CONDITIONS.map((cond) => (
                    <FormControlLabel
                    key={cond.key}
                    label={<Typography className="checkbox-label">{cond.label}</Typography>}
                    control={
                        <Checkbox
                        checked={formData[cond.key]}
                        onChange={() => toggleCondition(cond.key)}
                        sx={{
                            color: "#555e6e",
                            "&.Mui-checked": { color: "#ef4444" },
                        }}
                        />
                    }
                    className={`checkbox-row ${formData[cond.key] ? "checkbox-row--checked" : ""}`}
                    />
                ))}
            </Box>
        </Box>
      )}

      {/* ── Step 3: Location Setup ── */}
      {activeStep === 2 && (
        <Box className="form-step">
          <Typography className="form-step-title">Set your location</Typography>
          <Typography className="form-step-sub">
            Enter your city or coordinates. We'll fetch live AQI for your exact area.
          </Typography>
          {/* → backend: send formData.city / lat / lon */}
          <Box className="form-fields">
            <TextField
                label="City"
                fullWidth
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                sx={inputSx}
            />

            <TextField
                label="State"
                fullWidth
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
                sx={inputSx}
            />

            <Box className="latlong-row">
            <TextField
                label="Latitude"
                fullWidth
                value={formData.lat}
                onChange={(e) => handleChange("lat", e.target.value)}
                sx={inputSx}
            />
            <TextField
                label="Longitude"
                fullWidth
                value={formData.lon}
                onChange={(e) => handleChange("lon", e.target.value)}
                sx={inputSx}
            />
            </Box>
          </Box>
        </Box>
      )}

      {/* ── Step 4: Done ── */}
      {activeStep === 3 && (
        <Box className="form-step form-step--done">
          <Box className="done-icon">🎉</Box>
          <Typography className="form-step-title">Your dashboard is ready</Typography>
          <Typography className="form-step-sub">
            AQI IQ has built your personalized exposure profile. Head to your dashboard
            to see your real-time AQI, exposure score, and daily recommendations.
          </Typography>
          <Button className="btn-primary done-btn">Go to Dashboard →</Button>
        </Box>
      )}

      {/* ── Navigation buttons ── */}
      {activeStep < 3 && (
        <>
        {error && (
          <Typography sx={{ color: "#ef4444", fontSize: "14px", marginTop: "8px" }}>
            {error}
          </Typography>
        )}
        <Box className="form-nav">
          {activeStep > 0 && (
            <Button className="btn-ghost" onClick={onBack}>← Back</Button>
          )}
            <Button className="btn-primary" onClick={onNext} disabled={loading}>
            {loading ? "Saving..." : activeStep === 2 ? "Finish Setup" : "Continue →"}
            </Button>
        </Box>
        </>
      )}

      {/* Step progress indicator */}
      <Box className="step-progress-dots">
        {STEPS.map((_, i) => (
          <Box
            key={i}
            className={`progress-dot ${i === activeStep ? "progress-dot--active" : ""} ${i < activeStep ? "progress-dot--done" : ""}`}
          />
        ))}
      </Box>
    </Box>
  );
}


// ─────────────────────────────────────────────────────────────
// MAIN EXPORT: Hero
// Holds all state and renders both sections.
// ─────────────────────────────────────────────────────────────
export default function Hero() {


  // ── Active step in the setup journey (0–3)
  const [activeStep, setActiveStep] = useState(0);

  // ── Which steps have been completed (indexes)
  const [completedSteps, setCompletedSteps] = useState([]);

  const [createdUserId, setCreatedUserId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // ── All form data in one object
  // → Replace with your API payload shape when submitting
  const [formData, setFormData] = useState({
  name: "",
  dob: "",
  email: "",
  gender: "",

  isSmoker: false,
  hasHeartCondition: false,
  hasAsthma: false,
  hasCOPD: false,
  hasAllergy: false,

  city: "",
  state: "",
  lat: "",
  lon: "",
});

  // Move to next step and mark current as completed
  async function handleNext() {
  try {
    setError("");
    setLoading(true);

    if (activeStep === 0) {
      const userPayload = {
        name: formData.name,
        dob: formData.dob,
        email: formData.email,
        gender: formData.gender,
      };

      const userRes = await createUser(userPayload);

      // IMPORTANT: this depends on backend returning insertId or user id
      const newUserId = userRes.data?.id || userRes.id || userRes.user_id || userRes.insertId;

      if (!newUserId) {
        throw new Error("User created but no user id returned from backend.");
      }

      setCreatedUserId(newUserId);
    }

    if (activeStep === 1) {
      if (!createdUserId) throw new Error("User ID missing.");

      const healthPayload = {
        user_id: createdUserId,
        isSmoker: formData.isSmoker,
        hasHeartCondition: formData.hasHeartCondition,
        hasAsthma: formData.hasAsthma,
        hasCOPD: formData.hasCOPD,
        hasAllergy: formData.hasAllergy,
      };

      await createHealthProfile(healthPayload);
    }

    if (activeStep === 2) {
      if (!createdUserId) throw new Error("User ID missing.");

      const locationPayload = {
        user_id: createdUserId,
        city: formData.city,
        state: formData.state,
        lat: formData.lat,
        lon: formData.lon,
      };

      await createLocation(locationPayload);
    }

    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps((prev) => [...prev, activeStep]);
    }

    setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  } catch (err) {
    console.error(err);
    setError(err.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
}

  // Go back one step
  function handleBack() {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }

  // Clicking a step in the tracker jumps to it
  function handleStepClick(index) {
    setActiveStep(index);
  }

  function scrollToSetup() {
  const el = document.querySelector(".setup-section");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

  return (
    <Box className={"page-root"}>

      {/* ════════════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════════════ */}
      <Box component="section" className="hero-section" id="aqi-info">
        {/* Decorative radial background accent */}
        <Box className="hero-bg-glow" />

        <Box className="hero-inner">

          {/* ── LEFT: Headline + CTAs ── */}
          <Box className="hero-left">

            {/* Product label */}
            <Box className="hero-eyebrow">
              <Box className="eyebrow-dot" />
              AQI IQ
            </Box>

            {/* Main headline */}
            <Typography className="hero-headline">
              Air Quality,
              <br />
              <span className="headline-muted">Personalized for You.</span>
            </Typography>

            {/* Description */}
            <Typography className="hero-description">
              AQI IQ combines real-time air quality data with your health profile and location to generate an exposure score and recommendations tailored to you.
            </Typography>

            {/* Feature list */}
            <Box className="hero-features">
              {[
                "Real-time AQI from trusted sensor networks",
                "Health-based exposure score, not just raw numbers",
                "Daily recommendations matched to your conditions",
              ].map((f) => (
                <Box key={f} className="feature-row">
                  <span className="feature-check">✓</span>
                  <Typography className="feature-text">{f}</Typography>
                </Box>
              ))}
            </Box>

            {/* CTA buttons */}
            <Box className="hero-ctas">
              <Button className="btn-primary" onClick={scrollToSetup}>
                Get Started
              </Button>
              <Button className="btn-ghost" onClick={scrollToSetup}>
                Learn More
              </Button>
            </Box>
          </Box>

          {/* ── RIGHT: AQI Preview Card ── */}
          <Box className="hero-right">
            <AQICard data={AQI_CARD_DATA} />
          </Box>
        </Box>

        {/* ── Scroll Indicator (bottom of hero) ── */}
        <ScrollIndicator />
      </Box>


      {/* ════════════════════════════════════════════════════
          SECTION 2 — SETUP JOURNEY
      ════════════════════════════════════════════════════ */}
      <Box component="section" className="setup-section" id="setup">
        <Box className="setup-section-header">
            <Typography className="setup-eyebrow">Setup Journey</Typography>
            <Typography className="setup-heading">
                Set up your profile in minutes
            </Typography>
            <Typography className="setup-subheading">
                Tell us about your health and location so AQI IQ can personalize your air-quality insights.
            </Typography>
        </Box>
        <Box className="setup-inner">

          {/* ── LEFT: Vertical Step Tracker ── */}
          <StepTracker
            activeStep={activeStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />

          {/* ── RIGHT: Animated Form Panel ── */}
          <FormPanel
            activeStep={activeStep}
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
            loading={loading}
            error={error}
            />

        </Box>
      </Box>

    </Box>
  );
}