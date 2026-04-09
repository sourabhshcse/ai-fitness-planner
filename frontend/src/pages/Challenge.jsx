import { useState } from "react";
import axios from "axios";

const API = "http://localhost:8000";

export default function Challenge() {
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [daily, setDaily]     = useState(null);

  const [form, setForm] = useState({
    email:          "",
    duration:       30,
    goal:           "fat_loss",
    preferred_time: "08:00",
  });

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ── Step 1 — Start Challenge ──────────────────────────────────────────────
  const startChallenge = async () => {
    if (!form.email) return setError("Please enter your email!");
    setLoading(true); setError("");
    try {
      const res = await axios.post(`${API}/challenge/start`, form);
      if (res.data.status === "success") {
        const day = await axios.get(`${API}/challenge/daily`, {
          params: { email: form.email, day: 1 }
        });
        setDaily(day.data);
        setStep(2);
      }
    } catch {
      setError("Something went wrong. Make sure backend is running!");
    }
    setLoading(false);
  };

  // ── Step 2 — Send PDF ─────────────────────────────────────────────────────
  const sendPDF = async () => {
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await axios.post(`${API}/challenge/send-pdf`, {
        email: form.email,
        day:   1,
      });
      if (res.data.status === "success") {
        setSuccess("🎉 Day 1 Plan sent to your email! Check your inbox.");
      } else {
        setError(res.data.message);
      }
    } catch {
      setError("Failed to send email. Check backend!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10">

      {/* ── Header ── */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white">
          💪 <span className="text-green-400">FitAI</span> Challenge
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Start your 30 or 60 day transformation journey
        </p>
      </div>

      {/* ── Step 1 — Setup Form ── */}
      {step === 1 && (
        <div className="max-w-lg mx-auto bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800">

          <h2 className="text-xl font-bold text-green-400 mb-6">
            🚀 Setup Your Challenge
          </h2>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-1 block">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handle}
              placeholder="your@gmail.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3
                         text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Duration */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">Challenge Duration</label>
            <div className="flex gap-3">
              {[30, 60].map((d) => (
                <button
                  key={d}
                  onClick={() => setForm({ ...form, duration: d })}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all
                    ${form.duration === d
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                      : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-green-500"
                    }`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">Your Goal</label>
            <div className="flex gap-3">
              {[
                { value: "fat_loss",    label: "🔥 Fat Loss"    },
                { value: "muscle_gain", label: "💪 Muscle Gain" },
              ].map((g) => (
                <button
                  key={g.value}
                  onClick={() => setForm({ ...form, goal: g.value })}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all
                    ${form.goal === g.value
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                      : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-green-500"
                    }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Time */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-1 block">
              Preferred Email Time
            </label>
            <input
              type="time"
              name="preferred_time"
              value={form.preferred_time}
              onChange={handle}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3
                         text-white focus:outline-none focus:border-green-500"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4 bg-red-900/20 px-4 py-2 rounded-lg">
              ⚠️ {error}
            </p>
          )}

          <button
            onClick={startChallenge}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 text-white font-bold
                       py-4 rounded-xl transition-all shadow-lg shadow-green-500/20
                       disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? "Starting..." : "🚀 Start My Challenge!"}
          </button>
        </div>
      )}

      {/* ── Step 2 — Daily Plan ── */}
      {step === 2 && daily && (
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-green-600 to-green-400 rounded-2xl p-6 text-center shadow-xl">
            <p className="text-green-100 text-sm font-medium">Challenge Started! 🎉</p>
            <h2 className="text-3xl font-black mt-1">Day {daily.day}</h2>
            <p className="text-green-100 mt-1">{daily.goal} Plan</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Duration",  value: `${form.duration} Days` },
              { label: "Goal",      value: form.goal === "fat_loss" ? "Fat Loss" : "Muscle Gain" },
              { label: "Email",     value: "Scheduled ✅" },
            ].map((stat) => (
              <div key={stat.label}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <p className="text-green-400 font-bold text-sm">{stat.value}</p>
                <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tip */}
          <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-4">
            <p className="text-yellow-300 text-sm">💡 {daily.tip}</p>
          </div>

          {/* Meal Plan */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-green-400 mb-4">🥗 Today's Meal Plan</h3>
            <div className="space-y-3">
              {[
                { key: "breakfast", icon: "🌅", label: "Breakfast", bg: "bg-yellow-900/20 border-yellow-700/30" },
                { key: "lunch",     icon: "☀️", label: "Lunch",     bg: "bg-green-900/20 border-green-700/30"  },
                { key: "snack",     icon: "🍎", label: "Snack",     bg: "bg-pink-900/20 border-pink-700/30"    },
                { key: "dinner",    icon: "🌙", label: "Dinner",    bg: "bg-purple-900/20 border-purple-700/30"},
              ].map((meal) => (
                <div key={meal.key}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${meal.bg}`}>
                  <span className="text-xl">{meal.icon}</span>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">{meal.label}</p>
                    <p className="text-white text-sm mt-0.5">
                      {daily.meal_plan[meal.key]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workout */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-green-400 mb-4">🏋️ Today's Workout</h3>
            <div className="space-y-2">
              {daily.workout.map((ex, i) => (
                <div key={i}
                  className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
                  <span className="text-green-400 font-black text-sm w-6">{i + 1}</span>
                  <p className="text-white text-sm flex-1">{ex}</p>
                  <span className="text-gray-500 text-xs">☐ Done</span>
                </div>
              ))}
            </div>
          </div>

          {/* Send PDF Button */}
          {success ? (
            <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-4 text-center">
              <p className="text-green-400 font-medium">{success}</p>
            </div>
          ) : (
            <button
              onClick={sendPDF}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 text-white font-bold
                         py-4 rounded-xl transition-all shadow-lg shadow-green-500/20
                         disabled:opacity-50 text-lg"
            >
              {loading ? "Sending..." : "📧 Send Day 1 Plan to My Email"}
            </button>
          )}

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-900/20 px-4 py-2 rounded-lg">
              ⚠️ {error}
            </p>
          )}

          {/* Restart */}
          <button
            onClick={() => { setStep(1); setSuccess(""); setError(""); setDaily(null); }}
            className="w-full text-gray-500 hover:text-gray-300 text-sm py-2 transition-all"
          >
            ← Start a new challenge
          </button>

        </div>
      )}
    </div>
  );
}