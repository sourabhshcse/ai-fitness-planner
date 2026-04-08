import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
    const location = useLocation()

    const links = [
        { name: 'Home', path: '/' },
        { name: 'Get Plan', path: '/plan' },
        { name: 'AI Chat', path: '/chatbot' },
        { name: 'Progress', path: '/progress' },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    {/* Icon Box */}
                    <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M6 4v16M18 4v16M6 12h12M3 8h3M18 8h3M3 16h3M18 16h3"
                                stroke="black" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                    </div>

                    {/* Brand Name */}
                    <div className="flex flex-col leading-none">
                        <span className="text-white font-extrabold text-lg tracking-tight">
                            Fit<span className="text-green-400">AI</span>
                        </span>
                        <span className="text-gray-500 text-[10px] tracking-widest uppercase">
                            Fitness Planner
                        </span>
                    </div>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-1">
                    {links.map(link => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                                ${location.pathname === link.path
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}>
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* CTA Button */}
                <Link
                    to="/plan"
                    className="bg-green-500 hover:bg-green-400 text-black text-sm font-bold px-5 py-2 rounded-xl transition-all duration-200 hover:scale-105 shadow-md shadow-green-500/20">
                    Get My Plan
                </Link>
            </div>
        </nav>
    )
}