import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Home() {
    const navigate = useNavigate()
    const [count, setCount] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prev => prev < 10000 ? prev + 97 : 10000)
        }, 20)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">

            {/* Hero Section */}
            <div className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-16">

                {/* Glow blob */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-green-500 opacity-10 blur-3xl rounded-full pointer-events-none" />

                {/* Badge */}
                <div className="mb-6 inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold px-4 py-2 rounded-full">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block"></span>
                    AI Powered — 100% Free — No Gym Needed
                </div>

                {/* Heading */}
                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
                    Transform Your Body
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                        With AI Precision
                    </span>
                </h1>

                <p className="text-gray-400 text-lg max-w-xl mb-10 leading-relaxed">
                    Get a hyper-personalized diet and workout plan built around
                    your body, your goal, and your lifestyle —
                    whether you are in a hostel room or at home.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-16">
                    <button
                        onClick={() => navigate('/plan')}
                        className="bg-green-500 hover:bg-green-400 text-black font-bold px-10 py-4 rounded-2xl transition-all duration-200 text-base shadow-lg shadow-green-500/30 hover:scale-105">
                        Start My Fitness Journey
                    </button>
                    <button
                        onClick={() => navigate('/chatbot')}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-10 py-4 rounded-2xl transition-all duration-200 text-base hover:scale-105">
                        Ask AI Anything
                    </button>
                </div>

                {/* Stats Row */}
                <div className="flex flex-col sm:flex-row gap-8 mb-20 text-center">
                    <div>
                        <p className="text-3xl font-bold text-green-400">
                            {count.toLocaleString()}+
                        </p>
                        <p className="text-gray-500 text-sm mt-1">Plans Generated</p>
                    </div>
                    <div className="hidden sm:block w-px bg-white/10" />
                    <div>
                        <p className="text-3xl font-bold text-green-400">30/60</p>
                        <p className="text-gray-500 text-sm mt-1">Day Challenges</p>
                    </div>
                    <div className="hidden sm:block w-px bg-white/10" />
                    <div>
                        <p className="text-3xl font-bold text-green-400">100%</p>
                        <p className="text-gray-500 text-sm mt-1">Vegetarian Friendly</p>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="px-6 pb-16 max-w-5xl mx-auto">
                <p className="text-center text-gray-500 text-sm uppercase tracking-widest mb-3 font-semibold">
                    Everything you need
                </p>
                <h2 className="text-center text-white text-3xl font-bold mb-12">
                    One App. Total Transformation.
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Card 1 — Diet Plan */}
                    <div className="group relative bg-gradient-to-br from-emerald-950/60 to-gray-900 hover:from-emerald-900/60 border border-emerald-800/30 hover:border-emerald-500/50 rounded-3xl p-6 transition-all duration-300 cursor-pointer overflow-hidden"
                        onClick={() => navigate('/plan')}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-300" />
                        <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            🥗
                        </div>
                        <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Nutrition</span>
                        <h3 className="text-white font-bold text-lg mt-1 mb-2">Smart Diet Plan</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Vegetarian meals built for your calorie goal.
                            Dal, roti, paneer — hostel approved!
                        </p>
                        <div className="mt-4 flex items-center gap-1 text-emerald-400 text-xs font-semibold group-hover:gap-2 transition-all duration-200">
                            Generate plan <span>→</span>
                        </div>
                    </div>

                    {/* Card 2 — Workout */}
                    <div className="group relative bg-gradient-to-br from-blue-950/60 to-gray-900 hover:from-blue-900/60 border border-blue-800/30 hover:border-blue-500/50 rounded-3xl p-6 transition-all duration-300 cursor-pointer overflow-hidden"
                        onClick={() => navigate('/plan')}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-300" />
                        <div className="w-14 h-14 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            💪
                        </div>
                        <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Training</span>
                        <h3 className="text-white font-bold text-lg mt-1 mb-2">Home Workouts</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Pushups, squats, planks — zero equipment.
                            Built for your room, not a gym.
                        </p>
                        <div className="mt-4 flex items-center gap-1 text-blue-400 text-xs font-semibold group-hover:gap-2 transition-all duration-200">
                            View workouts <span>→</span>
                        </div>
                    </div>

                    {/* Card 3 — AI Chat */}
                    <div className="group relative bg-gradient-to-br from-purple-950/60 to-gray-900 hover:from-purple-900/60 border border-purple-800/30 hover:border-purple-500/50 rounded-3xl p-6 transition-all duration-300 cursor-pointer overflow-hidden"
                        onClick={() => navigate('/chatbot')}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-300" />
                        <div className="w-14 h-14 bg-purple-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            🤖
                        </div>
                        <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">AI Powered</span>
                        <h3 className="text-white font-bold text-lg mt-1 mb-2">Gemini AI Chat</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Ask anything about fitness or diet.
                            Powered by Google Gemini AI.
                        </p>
                        <div className="mt-4 flex items-center gap-1 text-purple-400 text-xs font-semibold group-hover:gap-2 transition-all duration-200">
                            Chat now <span>→</span>
                        </div>
                    </div>

                    {/* Card 4 — BMI */}
                    <div className="group relative bg-gradient-to-br from-orange-950/60 to-gray-900 hover:from-orange-900/60 border border-orange-800/30 hover:border-orange-500/50 rounded-3xl p-6 transition-all duration-300 cursor-pointer overflow-hidden"
                        onClick={() => navigate('/plan')}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all duration-300" />
                        <div className="w-14 h-14 bg-orange-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            📊
                        </div>
                        <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">Analysis</span>
                        <h3 className="text-white font-bold text-lg mt-1 mb-2">BMI Analysis</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Instant BMI with category and personalized
                            health advice for your body type.
                        </p>
                        <div className="mt-4 flex items-center gap-1 text-orange-400 text-xs font-semibold group-hover:gap-2 transition-all duration-200">
                            Check BMI <span>→</span>
                        </div>
                    </div>

                    {/* Card 5 — Progress */}
                    <div className="group relative bg-gradient-to-br from-pink-950/60 to-gray-900 hover:from-pink-900/60 border border-pink-800/30 hover:border-pink-500/50 rounded-3xl p-6 transition-all duration-300 cursor-pointer overflow-hidden"
                        onClick={() => navigate('/progress')}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all duration-300" />
                        <div className="w-14 h-14 bg-pink-500/20 border border-pink-500/30 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            📈
                        </div>
                        <span className="text-pink-400 text-xs font-bold uppercase tracking-widest">Tracking</span>
                        <h3 className="text-white font-bold text-lg mt-1 mb-2">Progress Tracker</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Log daily weight and visualize your
                            transformation with beautiful graphs.
                        </p>
                        <div className="mt-4 flex items-center gap-1 text-pink-400 text-xs font-semibold group-hover:gap-2 transition-all duration-200">
                            Track now <span>→</span>
                        </div>
                    </div>

                    {/* Card 6 — Challenge */}
                    <div className="group relative bg-gradient-to-br from-green-900/40 to-emerald-950 border border-green-500/40 hover:border-green-400/70 rounded-3xl p-6 transition-all duration-300 cursor-pointer overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full blur-2xl group-hover:bg-green-400/25 transition-all duration-500" />
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl" />
                        <div className="relative">
                            <div className="relative w-14 h-14 mb-4">
                                <div className="absolute inset-0 bg-green-500/30 rounded-2xl animate-pulse" />
                                <div className="w-14 h-14 bg-green-500/30 border border-green-400/50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                                    🏆
                                </div>
                            </div>
                            <div className="flex gap-2 mb-2">
                                <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/30">30 DAYS</span>
                                <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/30">60 DAYS</span>
                            </div>
                            <h3 className="text-green-400 font-bold text-lg mt-1 mb-2">Fitness Challenge</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Accept a challenge and get a daily diet +
                                workout PDF delivered to your email every morning!
                            </p>
                            <div className="mt-4 flex items-center gap-1 text-green-400 text-xs font-semibold group-hover:gap-2 transition-all duration-200">
                                Accept challenge <span>→</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center pb-20 px-6">
                <div className="inline-block bg-white/5 border border-white/10 rounded-3xl px-10 py-8 max-w-lg">
                    <p className="text-gray-400 text-sm mb-1">Ready to start?</p>
                    <h3 className="text-white font-bold text-2xl mb-4">
                        Build your plan in 30 seconds
                    </h3>
                    <button
                        onClick={() => navigate('/plan')}
                        className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-green-500/20">
                        Get Started — It's Free
                    </button>
                </div>
            </div>

        </div>
    )
}