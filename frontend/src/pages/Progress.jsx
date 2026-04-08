import { useState, useEffect } from 'react'
import { addProgress, getProgress, clearProgress } from '../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Progress() {
    const [entries, setEntries] = useState([])
    const [form, setForm] = useState({ date: '', weight: '', notes: '' })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => { fetchProgress() }, [])

    const fetchProgress = async () => {
        try {
            const data = await getProgress()
            if (data.status === 'success') setEntries(data.data)
        } catch { }
    }

    const handleAdd = async () => {
        if (!form.date || !form.weight) return setMessage('Please fill date and weight!')
        try {
            setLoading(true)
            await addProgress({ date: form.date, weight: parseFloat(form.weight), notes: form.notes })
            setForm({ date: '', weight: '', notes: '' })
            setMessage('Entry added successfully!')
            fetchProgress()
        } catch {
            setMessage('Something went wrong!')
        } finally {
            setLoading(false)
        }
    }

    const handleClear = async () => {
        await clearProgress()
        setEntries([])
        setMessage('Progress cleared!')
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white px-6 pt-24 pb-16">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold mb-2">
                        Progress
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300"> Tracker</span>
                    </h1>
                    <p className="text-gray-500 text-sm">Log your daily weight and track your transformation</p>
                </div>

                {/* Add Entry Card */}
                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 mb-6">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Add Today's Entry</p>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="text-gray-500 text-xs mb-1 block">Date</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 text-white rounded-xl px-3 py-3 outline-none transition-all duration-200 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-gray-500 text-xs mb-1 block">Weight (kg)</label>
                            <input
                                type="number"
                                value={form.weight}
                                onChange={e => setForm({ ...form, weight: e.target.value })}
                                placeholder="70"
                                className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 text-white placeholder-gray-700 rounded-xl px-3 py-3 outline-none transition-all duration-200 text-sm"
                            />
                        </div>
                    </div>

                    <input
                        type="text"
                        value={form.notes}
                        onChange={e => setForm({ ...form, notes: e.target.value })}
                        placeholder="Notes (optional) — e.g. felt great today!"
                        className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 text-white placeholder-gray-700 rounded-xl px-3 py-3 outline-none transition-all duration-200 text-sm mb-3"
                    />

                    {message && (
                        <div className="mb-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-2 rounded-xl">
                            {message}
                        </div>
                    )}

                    <button
                        onClick={handleAdd}
                        disabled={loading}
                        className="w-full bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-white font-bold py-3 rounded-2xl transition-all duration-200 hover:scale-[1.02] text-sm">
                        {loading ? 'Adding...' : 'Add Entry 📈'}
                    </button>
                </div>

                {/* Graph */}
                {entries.length > 1 && (
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 mb-6">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Weight Over Time</p>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={entries}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} />
                                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff15', borderRadius: '12px', color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="weight" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899', r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Entries List */}
                {entries.length > 0 ? (
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                                All Entries ({entries.length})
                            </p>
                            <button
                                onClick={handleClear}
                                className="text-red-400 hover:text-red-300 text-xs font-bold transition-all duration-200">
                                Clear All
                            </button>
                        </div>
                        {entries.map((entry, i) => (
                            <div key={i} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl px-4 py-3 mb-2">
                                <div>
                                    <p className="text-white font-bold text-sm">{entry.date}</p>
                                    {entry.notes && <p className="text-gray-500 text-xs mt-0.5">{entry.notes}</p>}
                                </div>
                                <p className="text-pink-400 font-extrabold text-lg">{entry.weight} kg</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-600">
                        <p className="text-4xl mb-3">📊</p>
                        <p className="font-bold">No entries yet</p>
                        <p className="text-sm mt-1">Add your first weight entry above</p>
                    </div>
                )}

            </div>
        </div>
    )
}
