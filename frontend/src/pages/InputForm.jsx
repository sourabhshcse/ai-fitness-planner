import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { predictPlan } from '../services/api'

const GOALS = [
    { id: 'fat_loss', label: 'Fat Loss', emoji: '🔥', cal: '1500-1800 kcal/day' },
    { id: 'muscle_gain', label: 'Muscle Gain', emoji: '💪', cal: '2200-2700 kcal/day' },
]

const FIELDS = [
    { name: 'age', label: 'Age', unit: 'yrs', placeholder: '20' },
    { name: 'weight', label: 'Weight', unit: 'kg', placeholder: '70' },
    { name: 'height', label: 'Height', unit: 'cm', placeholder: '170' },
]

export default function InputForm() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({ age: '', weight: '', height: '', goal: '' })

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async () => {
        if (!form.age || !form.weight || !form.height || !form.goal)
            return setError('Please fill all fields!')
        try {
            setLoading(true)
            setError('')
            const data = await predictPlan({
                age: parseInt(form.age),
                weight: parseFloat(form.weight),
                height: parseFloat(form.height),
                goal: form.goal,
            })
            localStorage.setItem('fitnessResult', JSON.stringify(data))
            navigate('/result')
        } catch {
            setError('Something went wrong. Make sure backend is running!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 pt-24 pb-16">
            <div className="w-full max-w-lg">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold mb-2">
                        Build Your
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300"> Perfect Plan</span>
                    </h1>
                    <p className="text-gray-500 text-sm">4 inputs · instant AI results · 100% free</p>
                </div>

                {/* Card */}
                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">

                    {/* Input Fields */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {FIELDS.map(({ name, label, unit, placeholder }) => (
                            <div key={name}>
                                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 block">
                                    {label}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name={name}
                                        value={form[name]}
                                        onChange={handleChange}
                                        placeholder={placeholder}
                                        className="w-full bg-white/5 border border-white/10 focus:border-green-500/60 text-white placeholder-gray-700 rounded-xl px-3 py-3 outline-none transition-all duration-200 text-base font-semibold"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs">{unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Goal Selection */}
                    <div className="mb-6">
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block">
                            Your Goal
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {GOALS.map(({ id, label, emoji, cal }) => (
                                <button
                                    key={id}
                                    onClick={() => setForm({ ...form, goal: id })}
                                    className={`p-4 rounded-2xl border text-left transition-all duration-200
                                        ${form.goal === id
                                            ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                        }`}>
                                    <div className="text-2xl mb-1">{emoji}</div>
                                    <div className="font-bold text-sm">{label}</div>
                                    <div className="text-xs opacity-60 mt-0.5">{cal}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-green-500/20">
                        {loading ? 'Generating your plan...' : 'Generate My Plan ✨'}
                    </button>

                    <p className="text-center text-gray-600 text-xs mt-4">
                        No signup needed · Vegetarian friendly · Home workouts
                    </p>
                </div>
            </div>
        </div>
    )
}