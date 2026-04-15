import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { sendChatMessage } from '../services/api'

// ─── Constants ───────────────────────────────────────────────────────────────

const SUGGESTIONS = [
    'Best diet for fat loss?',
    'How many pushups daily?',
    'What to eat after workout?',
    'How to lose belly fat?',
]

const INITIAL_MESSAGE = {
    role: 'bot',
    text: `Hey! 👋 I am your **AI Fitness Assistant** powered by *Google Gemini*.\n\nAsk me anything about:\n- 🥗 **Diet & Nutrition**\n- 🏋️ **Workouts & Exercise**\n- ⚖️ **Weight Loss & Muscle Gain**\n- 💧 **Hydration & Recovery**`,
}

// ─── Markdown Styles ─────────────────────────────────────────────────────────

const MarkdownContent = ({ text }) => (
    <ReactMarkdown
        components={{
            p:      ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
            strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
            em:     ({ children }) => <em className="text-green-300 not-italic font-medium">{children}</em>,
            ul:     ({ children }) => <ul className="list-none space-y-1 my-2">{children}</ul>,
            ol:     ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
            li:     ({ children }) => (
                <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span>{children}</span>
                </li>
            ),
            h1: ({ children }) => <h1 className="text-lg font-bold text-white mb-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-base font-bold text-green-400 mb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-sm font-bold text-green-300 mb-1">{children}</h3>,
            code: ({ children }) => (
                <code className="bg-black/30 text-green-300 px-1.5 py-0.5 rounded text-xs font-mono">
                    {children}
                </code>
            ),
            blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-green-500 pl-3 my-2 text-gray-400 italic">
                    {children}
                </blockquote>
            ),
            hr: () => <hr className="border-white/10 my-3" />,
        }}
    >
        {text}
    </ReactMarkdown>
)

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Chatbot() {
    const [messages, setMessages] = useState([INITIAL_MESSAGE])
    const [input,    setInput]    = useState('')
    const [loading,  setLoading]  = useState(false)
    const bottomRef               = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async (text) => {
        const userMsg = text || input
        if (!userMsg.trim()) return

        setMessages(prev => [...prev, { role: 'user', text: userMsg }])
        setInput('')
        setLoading(true)

        try {
            const data = await sendChatMessage(userMsg)
            setMessages(prev => [...prev, { role: 'bot', text: data.bot_response }])
        } catch {
            setMessages(prev => [...prev, {
                role: 'bot',
                text: '❌ Sorry, something went wrong. Please try again!'
            }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col pt-20">

            {/* ── Header ── */}
            <div className="px-6 py-4 border-b border-white/10 bg-[#0a0a0a]">
                <div className="max-w-2xl mx-auto flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 border border-green-500/30
                                    rounded-2xl flex items-center justify-center text-xl">
                        🤖
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm">FitAI Assistant</p>
                        <p className="text-gray-500 text-xs">Powered by Google Gemini</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-400 text-xs">Online</span>
                    </div>
                </div>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="max-w-2xl mx-auto space-y-4">

                    {/* Suggestion Chips */}
                    {messages.length === 1 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {SUGGESTIONS.map((s, i) => (
                                <button key={i} onClick={() => sendMessage(s)}
                                    className="bg-white/5 border border-white/10
                                               hover:border-green-500/40 hover:bg-green-500/5
                                               text-gray-400 hover:text-white
                                               text-xs px-3 py-2 rounded-xl transition-all duration-200">
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Message Bubbles */}
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                            {/* Bot Avatar */}
                            {msg.role === 'bot' && (
                                <div className="w-7 h-7 bg-green-500/20 border border-green-500/30
                                                rounded-xl flex items-center justify-center
                                                text-sm mr-2 mt-1 flex-shrink-0">
                                    🤖
                                </div>
                            )}

                            {/* Bubble */}
                            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm
                                ${msg.role === 'user'
                                    ? 'bg-green-500 text-black font-medium rounded-br-sm'
                                    : 'bg-white/5 border border-white/10 text-gray-300 rounded-bl-sm'
                                }`}>
                                {msg.role === 'bot'
                                    ? <MarkdownContent text={msg.text} />
                                    : msg.text
                                }
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="w-7 h-7 bg-green-500/20 border border-green-500/30
                                            rounded-xl flex items-center justify-center
                                            text-sm mr-2 flex-shrink-0">
                                🤖
                            </div>
                            <div className="bg-white/5 border border-white/10
                                            px-4 py-3 rounded-2xl rounded-bl-sm
                                            flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                                     style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                                     style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                                     style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>
            </div>

            {/* ── Input Box ── */}
            <div className="px-6 py-4 border-t border-white/10 bg-[#0a0a0a]">
                <div className="max-w-2xl mx-auto flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask anything about fitness..."
                        className="flex-1 bg-white/5 border border-white/10
                                   focus:border-green-500/50 text-white
                                   placeholder-gray-600 rounded-2xl px-4 py-3
                                   outline-none transition-all duration-200 text-sm"
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={loading || !input.trim()}
                        className="bg-green-500 hover:bg-green-400 disabled:opacity-40
                                   text-black font-bold px-5 py-3 rounded-2xl
                                   transition-all duration-200 hover:scale-105
                                   shadow-lg shadow-green-500/20">
                        Send
                    </button>
                </div>
            </div>

        </div>
    )
}