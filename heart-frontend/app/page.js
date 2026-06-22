"use client";

import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pred, setPred] = useState(null)

  const [form, setForm] = useState({
    Age: 40,
    Sex: "M",
    ChestPainType: "ATA",
    RestingBP: 120,
    Cholesterol: 200,
    FastingBS: 0,
    RestingECG: "Normal",
    MaxHR: 150,
    ExerciseAngina: "N",
    Oldpeak: 1.0,
    ST_Slope: "Up",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const predictHeart = async () => {
    setLoading(true);
    setResult("");
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          Age: Number(form.Age),
          RestingBP: Number(form.RestingBP),
          Cholesterol: Number(form.Cholesterol),
          FastingBS: Number(form.FastingBS),
          MaxHR: Number(form.MaxHR),
          Oldpeak: Number(form.Oldpeak),
        }),
      });
      const data = await response.json();
      console.log("data",data)
      setResult(data.result);
      setPred(data.prediction)
    } catch {
      setError("Could not reach server. Make sure FastAPI is running at http://127.0.0.1:8000");
      setResult("");
      setPred(0)
    } finally {
      setLoading(false);
    }
  };
  const isPositive = pred === 1;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: system-ui, -apple-system, sans-serif;
          background: #0f0f0f;
          color: #e5e5e5;
          min-height: 100vh;
        }

        .page {
          min-height: 100vh;
          padding: 48px 24px 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .card {
          width: 100%;
          max-width: 820px;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 16px;
          padding: 36px 40px;
        }

        .card-header {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #2a2a2a;
        }

        .card-header h1 {
          font-size: 22px;
          font-weight: 600;
          color: #f5f5f5;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }

        .card-header p {
          font-size: 14px;
          color: #888;
        }

        .section {
          margin-bottom: 28px;
        }

        .section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #222;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 600px) {
          .card { padding: 24px 20px; }
          .grid-2, .grid-3 { grid-template-columns: 1fr; }
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .field label {
          font-size: 13px;
          color: #888;
          font-weight: 500;
        }

        .field label span {
          color: #e5e5e5;
          font-weight: 600;
        }

        select {
          width: 100%;
          padding: 10px 12px;
          font-size: 14px;
          border: 1px solid #2e2e2e;
          border-radius: 8px;
          background: #242424;
          color: #e5e5e5;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px;
          transition: border-color 0.15s;
        }

        select:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.12);
        }

        select option {
          background: #242424;
          color: #e5e5e5;
        }

        .slider-wrapper {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        input[type="range"] {
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: #2e2e2e;
          outline: none;
          appearance: none;
          cursor: pointer;
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ef4444;
          border: 2px solid #1a1a1a;
          box-shadow: 0 0 0 2px #ef4444;
          cursor: pointer;
          transition: transform 0.1s;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }

        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ef4444;
          border: 2px solid #1a1a1a;
          cursor: pointer;
        }

        .slider-track-labels {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #444;
        }

        .predict-btn {
          width: 100%;
          margin-top: 8px;
          padding: 13px;
          font-size: 15px;
          font-weight: 600;
          border-radius: 10px;
          border: none;
          background: #ef4444;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s, transform 0.1s, opacity 0.15s;
        }

        .predict-btn:hover:not(:disabled) {
          background: #dc2626;
        }

        .predict-btn:active:not(:disabled) {
          transform: scale(0.98);
        }

        .predict-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .result-card {
          margin-top: 20px;
          padding: 18px 20px;
          border-radius: 12px;
        }

        .result-card.positive {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
        }

        .result-card.negative {
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.3);
        }

        .result-card.error-state {
          background: #1f1f1f;
          border: 1px solid #2e2e2e;
        }

        .r-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .positive .r-label { color: #ef4444; }
        .negative .r-label { color: #22c55e; }
        .error-state .r-label { color: #ef4444; }

        .r-text {
          font-size: 15px;
          font-weight: 500;
          color: #f0f0f0;
          margin-bottom: 6px;
        }

        .r-sub {
          font-size: 12px;
          color: #555;
        }
      `}</style>

      <div className="page">
        <div className="card">
          <div className="card-header">
            <h1>❤️ Heart Disease Risk</h1>
            <p>Enter patient vitals to estimate cardiovascular risk.</p>
          </div>

          {/* Patient Info */}
          <div className="section">
            <div className="section-label">Patient info</div>
            <div className="grid-2">
              <div className="field">
                <label>Age — <span>{form.Age} yrs</span></label>
                <div className="slider-wrapper">
                  <input type="range" name="Age" min="18" max="100" step="1" value={form.Age} onChange={handleChange} />
                  <div className="slider-track-labels"><span>18</span><span>100</span></div>
                </div>
              </div>
              <div className="field">
                <label>Sex</label>
                <select name="Sex" value={form.Sex} onChange={handleChange}>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="section">
            <div className="section-label">Symptoms</div>
            <div className="grid-2">
              <div className="field">
                <label>Chest pain type</label>
                <select name="ChestPainType" value={form.ChestPainType} onChange={handleChange}>
                  <option value="ATA">ATA — Atypical angina</option>
                  <option value="NAP">NAP — Non-anginal pain</option>
                  <option value="TA">TA — Typical angina</option>
                  <option value="ASY">ASY — Asymptomatic</option>
                </select>
              </div>
              <div className="field">
                <label>Exercise-induced angina</label>
                <select name="ExerciseAngina" value={form.ExerciseAngina} onChange={handleChange}>
                  <option value="N">No</option>
                  <option value="Y">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Vitals */}
          <div className="section">
            <div className="section-label">Vitals</div>
            <div className="grid-2">
              <div className="field">
                <label>Resting blood pressure — <span>{form.RestingBP} mm Hg</span></label>
                <div className="slider-wrapper">
                  <input type="range" name="RestingBP" min="80" max="200" step="1" value={form.RestingBP} onChange={handleChange} />
                  <div className="slider-track-labels"><span>80</span><span>200</span></div>
                </div>
              </div>
              <div className="field">
                <label>Cholesterol — <span>{form.Cholesterol} mg/dL</span></label>
                <div className="slider-wrapper">
                  <input type="range" name="Cholesterol" min="100" max="600" step="1" value={form.Cholesterol} onChange={handleChange} />
                  <div className="slider-track-labels"><span>100</span><span>600</span></div>
                </div>
              </div>
              <div className="field">
                <label>Max heart rate — <span>{form.MaxHR} bpm</span></label>
                <div className="slider-wrapper">
                  <input type="range" name="MaxHR" min="60" max="220" step="1" value={form.MaxHR} onChange={handleChange} />
                  <div className="slider-track-labels"><span>60</span><span>220</span></div>
                </div>
              </div>
              <div className="field">
                <label>Oldpeak (ST depression) — <span>{Number(form.Oldpeak).toFixed(1)}</span></label>
                <div className="slider-wrapper">
                  <input type="range" name="Oldpeak" min="0" max="6" step="0.1" value={form.Oldpeak} onChange={handleChange} />
                  <div className="slider-track-labels"><span>0.0</span><span>6.0</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostics */}
          <div className="section">
            <div className="section-label">Diagnostics</div>
            <div className="grid-3">
              <div className="field">
                <label>Fasting blood sugar &gt; 120 mg/dL</label>
                <select name="FastingBS" value={form.FastingBS} onChange={handleChange}>
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>
              <div className="field">
                <label>Resting ECG</label>
                <select name="RestingECG" value={form.RestingECG} onChange={handleChange}>
                  <option value="Normal">Normal</option>
                  <option value="ST">ST</option>
                  <option value="LVH">LVH</option>
                </select>
              </div>
              <div className="field">
                <label>ST slope</label>
                <select name="ST_Slope" value={form.ST_Slope} onChange={handleChange}>
                  <option value="Up">Up</option>
                  <option value="Flat">Flat</option>
                  <option value="Down">Down</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button className="predict-btn" onClick={predictHeart} disabled={loading}>
            {loading ? "⏳ Predicting…" : "❤️ Predict Risk"}
          </button>

         {pred !== null && (

          <div className={`result-card ${isPositive ? "positive" : "negative"}`}>

            <div className="r-badge">
          
              {
                isPositive
                ? "⚠️ Risk Detected"
                : "✅ No Disease"
              }

            </div>


            <div className="r-text">

              {
                isPositive

                ?

                "Heart disease detected. Please consult a cardiologist immediately."

                :

                "No heart disease detected. Keep maintaining a healthy lifestyle."

              }

            </div>


            <div className="r-sub">

              Model prediction only — always consult a physician for clinical decisions.

            </div>


          </div>

        )}

          {error && (
            <div className="result-card error-state">
              <div className="r-label">Server error</div>
              <div className="r-text">{error}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}