import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import "../styles/Hero.css";
import { signup, login } from "../services/authService";
import { updateUserProfile } from "../services/userService";
import { createHealthProfile } from "../services/healthService";
import { createLocation } from "../services/locationService";

const AQI_CARD_DATA = {
  location: "Mumbai, India",
  aqi: 156,
  aqiLabel: "Poor",
  exposureScore: 72,
  exposureLabel: "High Risk",
  recommendation: "Avoid outdoor activity. Wear an N95 mask if going out.",
};

const STEPS = [
  {
    id: 1,
    icon: "1",
    title: "Complete Profile",
    hint: "Add your date of birth and gender",
  },
  {
    id: 2,
    icon: "2",
    title: "Health Details",
    hint: "Your conditions affect your risk score",
  },
  {
    id: 3,
    icon: "3",
    title: "Location Setup",
    hint: "We fetch live AQI for your area",
  },
];

const HEALTH_CONDITIONS = [
  { key: "isSmoker", label: "Smoker" },
  { key: "hasHeartCondition", label: "Heart Condition" },
  { key: "hasAsthma", label: "Asthma" },
  { key: "hasCOPD", label: "COPD" },
  { key: "hasAllergy", label: "Allergies" },
];

function getAQIColor(aqi) {
  if (aqi <= 50)  return "#22c55e";
  if (aqi <= 100) return "#eab308";
  if (aqi <= 150) return "#f97316";
  if (aqi <= 200) return "#ef4444";
  return "#a855f7";
}

function getExposureColor(score) {
  if (score <= 40) return "#22c55e";
  if (score <= 70) return "#f97316";
  return "#ef4444";
}

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

function AQICard({ data }) {
  const aqiColor = getAQIColor(data.aqi);
  const expColor = getExposureColor(data.exposureScore);

  return (
    <Box className="aqi-card" style={{ "--glow-color": aqiColor }}>
      <Box className="aqi-card-glow" />

      <Box className="aqi-card-toprow">
        <Typography className="aqi-card-location">📍 {data.location}</Typography>
        <Box className="live-badge">
          <span className="live-dot" />
          Live
        </Box>
      </Box>

      <Box className="aqi-number-block">
        <Typography className="aqi-number" style={{ color: aqiColor }}>
          {data.aqi}
        </Typography>
        <Box className="aqi-label-pill" style={{ background: aqiColor + "22", color: aqiColor }}>
          ● {data.aqiLabel}
        </Box>
      </Box>

      <Box className="aqi-card-divider" />

      <Box className="exposure-row">
        <Box>
          <Typography className="exp-eyebrow">Exposure Score</Typography>
          <Typography className="exp-value" style={{ color: expColor }}>
            {data.exposureScore}
            <span className="exp-denom">/100</span>
          </Typography>
        </Box>
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

      <Box className="aqi-rec-box">
        <Typography className="aqi-rec-label">💡 Advisory</Typography>
        <Typography className="aqi-rec-text">{data.recommendation}</Typography>
      </Box>

      <Box className="aqi-scale-row">
        {[
          { label: "Good", color: "#22c55e" },
          { label: "Fair", color: "#eab308" },
          { label: "Mod", color: "#f97316" },
          { label: "Poor", color: "#ef4444" },
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

function ScrollIndicator() {
  return (
    <Box className="scroll-indicator">
      <Typography className="scroll-text">Scroll to get started</Typography>
      <Box className="scroll-arrow">↓</Box>
    </Box>
  );
}

function AuthSection({ onSignupSuccess, onLoginSuccess }) {

  const [authMode, setAuthMode] = useState("signup");

  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(field, value) {
    setAuthData((prev) => ({ ...prev, [field]: value }));
  }

  function switchMode(mode) {
    setAuthMode(mode);
    setError("");
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);

    if (authMode === "signup") {
      if (
        !authData.name.trim() ||
        !authData.email.trim() ||
        !authData.password.trim()
      ) {
        throw new Error("Please fill in all fields.");
      }
    }

    if (authMode === "login") {
      if (
        !authData.email.trim() ||
        !authData.password.trim()
      ) {
        throw new Error("Please enter email and password.");
      }
    }

    try {
      if (authMode === "signup") {
        
        const res = await signup({
          name: authData.name,
          email: authData.email,
          password: authData.password,
        });

        const userId = res?.id || res?.user_id || res?.data?.id;
        if (!userId) throw new Error("Signup succeeded but no user ID was returned.");

        onSignupSuccess(userId);

      } else {
        
        const res = await login({
          email:    authData.email,
          password: authData.password,
        });

        const userId = res?.id || res?.user_id || res?.data?.id;
        if (!userId) throw new Error("Login succeeded but no user ID was returned.");

        onLoginSuccess(userId);
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box className="auth-section" id="auth">
      <Box className="auth-section-header">
        <Typography className="setup-eyebrow">Get Started</Typography>
        <Typography className="setup-heading">
          {authMode === "signup" ? "Create your account" : "Welcome back"}
        </Typography>
        <Typography className="setup-subheading">
          {authMode === "signup"
            ? "Sign up to get your personalized AQI exposure profile."
            : "Log in to view your personalized dashboard."}
        </Typography>
      </Box>

      <Box className="auth-panel">
        
        <Box className="auth-toggle">
          <button
            className={`auth-toggle-btn ${authMode === "signup" ? "auth-toggle-btn--active" : ""}`}
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </button>
          <button
            className={`auth-toggle-btn ${authMode === "login" ? "auth-toggle-btn--active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Log In
          </button>
        </Box>

        <Box className="form-fields">
          
          {authMode === "signup" && (
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              value={authData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              sx={inputSx}
            />
          )}

          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            value={authData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            sx={inputSx}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={authData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            sx={inputSx}
          />
        </Box>

        {error && (
          <Typography className="auth-error">{error}</Typography>
        )}

        <Button
          className="btn-primary auth-submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? (authMode === "signup" ? "Creating account..." : "Logging in...")
            : (authMode === "signup" ? "Create Account →" : "Log In →")}
        </Button>

        <Typography className="auth-switch-text">
          {authMode === "signup"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            className="auth-switch-link"
            onClick={() => switchMode(authMode === "signup" ? "login" : "signup")}
          >
            {authMode === "signup" ? "Log in" : "Sign up"}
          </span>
        </Typography>
      </Box>
    </Box>
  );
}

function StepTracker({ activeStep, completedSteps, onStepClick }) {
  return (
    <Box className="step-tracker">
      <Box className="assistant-bubble">
        <span className="assistant-icon">🤖</span>
        <Typography className="assistant-text">
          {activeStep === 0 && "Almost there! Complete your profile to personalise your AQI insights."}
          {activeStep === 1 && "Add your health details so we can assess your risk accurately."}
          {activeStep === 2 && "Tell us where you are — we'll pull live AQI for your location."}
        </Typography>
      </Box>

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
              {index < STEPS.length - 1 && (
                <Box className={`step-line ${isCompleted ? "step-line--done" : ""}`} />
              )}
              <Box className="step-circle">
                {isCompleted ? (
                  <span className="step-check">✔</span>
                ) : (
                  <span className="step-icon">{step.icon}</span>
                )}
              </Box>
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

function FormPanel({ activeStep, formData, setFormData, onNext, onBack, loading, error }) {

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function toggleCondition(field) {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  return (
    <Box className="form-panel">

      {activeStep === 0 && (
        <Box className="form-step">
          <Typography className="form-step-title">Complete your profile</Typography>
          <Typography className="form-step-sub">
            Add a few more details to personalise your exposure score.
          </Typography>
          <Box className="form-fields">
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

      {activeStep === 1 && (
        <Box className="form-step">
          <Typography className="form-step-title">Your health profile</Typography>
          <Typography className="form-step-sub">
            Select any conditions that apply. This personalizes your exposure score.
          </Typography>
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

      {activeStep === 2 && (
        <Box className="form-step">
          <Typography className="form-step-title">Set your location</Typography>
          <Typography className="form-step-sub">
            Enter your city or coordinates. We'll fetch live AQI for your exact area.
          </Typography>
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

export default function Hero({ onComplete, onLoginSuccess }) {

  const [appState, setAppState] = useState("home");

  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    dob: "",
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

  function handleSignupSuccess(newUserId) {
    setUserId(newUserId);
    setAppState("setup");         

    setTimeout(() => {
      const el = document.querySelector(".setup-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function handleLoginSuccess(loggedInUserId) {
    setUserId(loggedInUserId);

    if (onLoginSuccess) onLoginSuccess(loggedInUserId);
    navigate("/dashboard");
  }

  async function handleNext() {
    setError("");
    setLoading(true);

    try {
      if (activeStep === 0) {
        
        if (!userId) throw new Error("User ID missing. Please sign up again.");

        if (!formData.dob || !formData.gender.trim()) {
          throw new Error("Please complete all profile fields.");
        }

        await updateUserProfile(userId, {
          dob: formData.dob,
          gender: formData.gender,
        });
      }

      if (activeStep === 1) {
        if (!userId) throw new Error("User ID missing.");

        await createHealthProfile({
          user_id: userId,
          isSmoker: formData.isSmoker,
          hasHeartCondition: formData.hasHeartCondition,
          hasAsthma: formData.hasAsthma,
          hasCOPD: formData.hasCOPD,
          hasAllergy: formData.hasAllergy,
        });
      }

      if (activeStep === 2) {
        if (!userId) throw new Error("User ID missing.");

        if (
          !formData.city.trim() ||
          !formData.state.trim() ||
          !formData.lat.trim() ||
          !formData.lon.trim()
        ) {
          throw new Error("Please complete all location fields.");
        }

        await createLocation({
          user_id: userId,
          city: formData.city,
          state: formData.state,
          lat: parseFloat(formData.lat),
          lon: parseFloat(formData.lon),
        });
      }

      if (!completedSteps.includes(activeStep)) {
        setCompletedSteps((prev) => [...prev, activeStep]);
      }

      if (activeStep === 2) {
        if (onComplete) onComplete(userId);
        navigate("/dashboard")
      } else {
        setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      }

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }

  function handleStepClick(index) {
    setActiveStep(index);
  }

  function scrollToAuth() {
    const el = document.querySelector(".auth-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <Box className="page-root">

      {appState === "home" && (
        <>
          <Box component="section" className="hero-section" id="aqi-info">
            <Box className="hero-bg-glow" />

            <Box className="hero-inner">
              
              <Box className="hero-left">
                <Box className="hero-eyebrow">
                  <Box className="eyebrow-dot" />
                  AQI IQ
                </Box>

                <Typography className="hero-headline">
                  Air Quality,
                  <br />
                  <span className="headline-muted">Personalized for You.</span>
                </Typography>

                <Typography className="hero-description">
                  AQI IQ combines real-time air quality data with your health profile and location
                  to generate an exposure score and recommendations tailored to you.
                </Typography>

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

                <Box className="hero-ctas">
                  <Button className="btn-primary" onClick={scrollToAuth}>
                    Get Started
                  </Button>
                  <Button className="btn-ghost" component={Link} to="/aqi-info">
                    Learn More
                  </Button>
                </Box>
              </Box>

              <Box className="hero-right">
                <AQICard data={AQI_CARD_DATA} />
              </Box>
            </Box>

            <ScrollIndicator />
          </Box>

          <AuthSection
            onSignupSuccess={handleSignupSuccess}
            onLoginSuccess={handleLoginSuccess}
          />
        </>
      )}

      {appState === "setup" && (
        <Box component="section" className="setup-section" id="setup">
          <Box className="setup-section-header">
            <Typography className="setup-eyebrow">Setup Journey</Typography>
            <Typography className="setup-heading">
              Set up your profile in minutes
            </Typography>
            <Typography className="setup-subheading">
              Tell us about your health and location so AQI IQ can personalise your air-quality insights.
            </Typography>
          </Box>

          <Box className="setup-inner">
            <StepTracker
              activeStep={activeStep}
              completedSteps={completedSteps}
              onStepClick={handleStepClick}
            />
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
      )}

    </Box>
  );
}