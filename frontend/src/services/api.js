import axios from 'axios'

const API = axios.create({
    baseURL: "https://fitai-backend-d3qy.onrender.com",
    headers: {
        'Content-Type': 'application/json'
    }
})

// ✅ Predict — BMI + Diet + Workout
export const predictPlan = async (userData) => {
    const response = await API.post('/predict', userData)
    return response.data
}

// ✅ Chat — Gemini AI chatbot
export const sendChatMessage = async (message) => {
    const response = await API.post('/chat', { message })
    return response.data
}

// ✅ Progress — Add entry
export const addProgress = async (entry) => {
    const response = await API.post('/progress/add', entry)
    return response.data
}

// ✅ Progress — Get all entries
export const getProgress = async () => {
    const response = await API.get('/progress/get')
    return response.data
}

// ✅ Progress — Clear all entries
export const clearProgress = async () => {
    const response = await API.delete('/progress/clear')
    return response.data
}