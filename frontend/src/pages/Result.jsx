import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Result() {
    const navigate = useNavigate()
    const [result, setResult] = useState(null)
    const [tab, setTab] = useState('diet')

    useEffect(() => {
        const data = localStorage.getItem('fitnessResult')
        if (!data) navigate('/plan')
        else setResult(JSON.parse(data))
    }, [])

    if (!result) return null

    const { bmi, diet_plan, workout_plan } = result

    const bmiColor =
        bmi.category === 'Normal weight' ? 'text-green-400' :
        bmi.category === 'Underweight' ? 'text-blue-400' :
        bmi.category === 'Overweight' ? 'text-orange-400' : 'text-red-400'

    const TABS = ['diet', 'workout']

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white px-6 pt-24 pb-16">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold mb-2">
                        Your
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300"> AI Plan</span>
                    </h1>
                    <p className="text-gray-500 text-sm">Personalized just for you</p>
                </div>

                {/* BMI Card */}
                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 mb-6">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">BMI Analysis</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-5xl font-extrabold ${bmiColor}`}>{bmi.bmi}</p>
                            <p className={`text-sm font-semibold mt-1 ${bmiColor}`}>{bmi.category}</p>
                            <p className="text-gray-500 text-sm mt-2 max-w-xs">{bmi.advice}</p>
                        </div>
                        <div className="w-20 h-20 rounded-full border-4 border-green-500/30 flex items-center justify-center">
                            <span className="text-3xl">📊</span>
                        </div>
                    </div>
                </div>

                {/* Tab Switch */}
                <div className="flex gap-2 mb-4 bg-white/5 border border-white/10 rounded-2xl p-1">
                    {TABS.map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-200
                                ${tab === t
                                    ? 'bg-green-500 text-black'
                                    : 'text-gray-400 hover:text-white'
                                }`}>
                            {t === 'diet' ? '🥗 Diet Plan' : '💪 Workout Plan'}
                        </button>
                    ))}
                </div>

                {/* Diet Plan */}
                {tab === 'diet' && (
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Daily Meals</p>
                            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                                {diet_plan.calories}
                            </span>
                        </div>

                        {Object.entries(diet_plan.meals).map(([meal, items]) => (
                            <div key={meal} className="mb-4">
                                <p className="text-white font-bold capitalize mb-2">
                                    {meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : meal === 'snack' ? '🍎' : '🌙'} {meal}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {items.map((item, i) => (
                                        <span key={i} className="bg-white/5 border border-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-xl">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Tips */}
                        <div className="mt-4 border-t border-white/5 pt-4">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Tips</p>
                            {diet_plan.tips.map((tip, i) => (
                                <p key={i} className="text-gray-400 text-sm mb-1">• {tip}</p>
                            ))}
                        </div>
                    </div>
                )}

                {/* Workout Plan */}
                {tab === 'workout' && (
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Exercises</p>
                            <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
                                {workout_plan.frequency}
                            </span>
                        </div>

                        {workout_plan.exercises.map((ex, i) => (
                            <div key={i} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl px-4 py-3 mb-2">
                                <div>
                                    <p className="text-white font-bold text-sm">{ex.name}</p>
                                    <p className="text-gray-500 text-xs mt-0.5">Rest: {ex.rest}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-green-400 font-bold text-sm">{ex.sets} sets</p>
                                    <p className="text-gray-500 text-xs">{ex.reps} reps</p>
                                </div>
                            </div>
                        ))}

                        {/* Tips */}
                        <div className="mt-4 border-t border-white/5 pt-4">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Tips</p>
                            {workout_plan.tips.map((tip, i) => (
                                <p key={i} className="text-gray-400 text-sm mb-1">• {tip}</p>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                        onClick={() => navigate('/plan')}
                        className="bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold py-3 rounded-2xl transition-all duration-200 text-sm">
                        ← New Plan
                    </button>
                    <button
                        onClick={() => navigate('/chatbot')}
                        className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-2xl transition-all duration-200 text-sm">
                        Ask AI Chat 🤖
                    </button>
                </div>

            </div>
        </div>
    )
}