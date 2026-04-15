import { useState, useEffect } from 'react'
import { addProgress, getProgress, clearProgress } from '../services/api'
import {
    LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

// ─── Constants ───────────────────────────────────────────────────────────────

const MEAL_ICONS = [
    { key: 'breakfast', icon: '🌅', label: 'Breakfast' },
    { key: 'lunch',     icon: '☀️', label: 'Lunch'     },
    { key: 'snack',     icon: '🍎', label: 'Snack'     },
    { key: 'dinner',    icon: '🌙', label: 'Dinner'    },
]

const EMPTY_FORM = { date: '', weight: '', notes: '' }

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getStats = (entries) => {
    const weights = entries.map(e => e.weight)
    if (!weights.length) return null

    const latest  = weights[weights.length - 1]
    const change  = weights.length > 1
        ? (latest - weights[0]).toFixed(1)
        : 0

    return {
        latest,
        highest:      Math.max(...weights),
        lowest:       Math.min(...weights),
        change,
        changeLabel:  change < 0 ? `↓ ${Math.abs(change)} kg lost`
                    : change > 0 ? `↑ ${change} kg gained`
                    : '— No change',
        changeColor:  change < 0 ? 'text-green-400'
                    : change > 0 ? 'text-red-400'
                    : 'text-gray-400',
    }
}

// ─── Sub Components ──────────────────────────────────────────────────────────

const StatCard = ({ label, value, color }) => (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3 text-center">
        <p className={`font-extrabold text-sm ${color}`}>{value}</p>
        <p className="text-gray-600 text-xs mt-1">{label}</p>
    </div>
)

const EntryCard = ({ entry, index, total, prevWeight }) => {
    const trend = prevWeight != null
        ? entry.weight < prevWeight ? '↓ losing' : '↑ gaining'
        : null
    const trendColor = entry.weight < prevWeight
        ? 'text-green-500' : 'text-red-400'

    return (
        <div className="flex items-center justify-between
                        bg-white/5 border border-white/5
                        hover:border-green-500/20 hover:bg-green-500/5
                        rounded-2xl px-4 py-3 transition-all duration-200">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/10 border border-green-500/20
                                rounded-xl flex items-center justify-center">
                    <span className="text-green-400 text-xs font-bold">{total - index}</span>
                </div>
                <div>
                    <p className="text-white font-bold text-sm">{entry.date}</p>
                    {entry.notes && (
                        <p className="text-gray-500 text-xs mt-0.5">{entry.notes}</p>
                    )}
                </div>
            </div>
            <div className="text-right">
                <p className="text-green-400 font-extrabold text-lg">{entry.weight} kg</p>
                {trend && (
                    <p className={`text-xs mt-0.5 ${trendColor}`}>{trend}</p>
                )}
            </div>
        </div>
    )
}

const Message = ({ text, type }) => (
    <div className={`mb-3 text-sm px-4 py-2 rounded-xl border
        ${type === 'success'
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-red-500/10  border-red-500/30  text-red-400'
        }`}>
        {text}
    </div>
)

const EmptyState = () => (
    <div className="text-center py-16 text-gray-600">
        <div className="w-16 h-16 bg-green-500/10 border border-green-500/20
                        rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📊</span>
        </div>
        <p className="font-bold text-gray-400">No entries yet</p>
        <p className="text-sm mt-1">Add your first weight entry above</p>
    </div>
)

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Progress() {
    const [entries, setEntries] = useState([])
    const [form,    setForm]    = useState(EMPTY_FORM)
    const [loading, setLoading] = useState(false)
    const [msg,     setMsg]     = useState({ text: '', type: 'success' })

    useEffect(() => { fetchProgress() }, [])

    const fetchProgress = async () => {
        try {
            const data = await getProgress()
            if (data.status === 'success') setEntries(data.data)
        } catch { }
    }

    const showMsg = (text, type = 'success') => setMsg({ text, type })

    const handleAdd = async () => {
        if (!form.date || !form.weight)
            return showMsg('Please fill date and weight!', 'error')
        try {
            setLoading(true)
            await addProgress({
                date:   form.date,
                weight: parseFloat(form.weight),
                notes:  form.notes,
            })
            setForm(EMPTY_FORM)
            showMsg('✅ Entry added successfully!')
            fetchProgress()
        } catch {
            showMsg('Something went wrong!', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleClear = async () => {
        await clearProgress()
        setEntries([])
        showMsg('Progress cleared!')
    }

    const stats        = getStats(entries)
    const reversed     = [...entries].reverse()

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white px-6 pt-24 pb-16">
            <div className="max-w-2xl mx-auto">

                {/* ── Header ── */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold mb-2">
                        Weight{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                            Tracker
                        </span>
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Log your daily weight and track your transformation 💪
                    </p>
                </div>

                {/* ── Stats Row ── */}
                {stats && (
                    <div className="grid grid-cols-4 gap-3 mb-6">
                        <StatCard label="Current" value={`${stats.latest} kg`}  color="text-green-400" />
                        <StatCard label="Highest" value={`${stats.highest} kg`} color="text-red-400"   />
                        <StatCard label="Lowest"  value={`${stats.lowest} kg`}  color="text-blue-400"  />
                        <StatCard label="Change"  value={stats.changeLabel}      color={stats.changeColor} />
                    </div>
                )}

                {/* ── Add Entry ── */}
                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 mb-6">
                    <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4">
                        📝 Add Today's Entry
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="text-gray-500 text-xs mb-1 block">Date</label>
                            <input type="date" value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-green-500/50
                                           text-white rounded-xl px-3 py-3 outline-none transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-gray-500 text-xs mb-1 block">Weight (kg)</label>
                            <input type="number" value={form.weight} placeholder="70"
                                onChange={e => setForm({ ...form, weight: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-green-500/50
                                           text-white placeholder-gray-700 rounded-xl px-3 py-3
                                           outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    <input type="text" value={form.notes}
                        placeholder="Notes (optional) — e.g. felt great today!"
                        onChange={e => setForm({ ...form, notes: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 focus:border-green-500/50
                                   text-white placeholder-gray-700 rounded-xl px-3 py-3
                                   outline-none transition-all text-sm mb-3"
                    />

                    {msg.text && <Message text={msg.text} type={msg.type} />}

                    <button onClick={handleAdd} disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50
                                   text-black font-bold py-3 rounded-2xl transition-all duration-200
                                   hover:scale-[1.02] shadow-lg shadow-green-500/20 text-sm">
                        {loading ? 'Adding...' : '📈 Add Entry'}
                    </button>
                </div>

                {/* ── Chart ── */}
                {entries.length > 1 && (
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 mb-6">
                        <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-6">
                            📊 Weight Over Time
                        </p>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={entries}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                                <XAxis dataKey="date"
                                    tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} />
                                <YAxis
                                    tick={{ fill: '#6b7280', fontSize: 11 }}
                                    tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#111827',
                                        border: '1px solid #22c55e30',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        fontSize: '12px',
                                    }}
                                    formatter={(value) => [`${value} kg`, 'Weight']}
                                />
                                <Line type="monotone" dataKey="weight"
                                    stroke="#22c55e" strokeWidth={2.5}
                                    dot={{ fill: '#22c55e', r: 5, strokeWidth: 2, stroke: '#0a0a0a' }}
                                    activeDot={{ r: 7, fill: '#22c55e' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* ── Entries List ── */}
                {entries.length > 0 ? (
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-green-400 text-xs font-bold uppercase tracking-widest">
                                🗓 All Entries ({entries.length})
                            </p>
                            <button onClick={handleClear}
                                className="text-red-400 hover:text-red-300 text-xs font-bold
                                           border border-red-400/20 hover:border-red-400/40
                                           px-3 py-1 rounded-lg transition-all">
                                🗑 Clear All
                            </button>
                        </div>

                        <div className="space-y-2">
                            {reversed.map((entry, i) => (
                                <EntryCard
                                    key={i}
                                    entry={entry}
                                    index={i}
                                    total={entries.length}
                                    prevWeight={reversed[i + 1]?.weight ?? null}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <EmptyState />
                )}

            </div>
        </div>
    )
}