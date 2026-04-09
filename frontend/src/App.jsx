import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import InputForm from './pages/InputForm'
import Result from './pages/Result'
import Chatbot from './pages/Chatbot'
import Progress from './pages/Progress'
import Challenge from "./pages/Challenge"

export default function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-950 text-white">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/plan" element={<InputForm />} />
                    <Route path="/result" element={<Result />} />
                    <Route path="/chatbot" element={<Chatbot />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/challenge" element={<Challenge />} />
                </Routes>
            </div>
        </Router>
    )
}