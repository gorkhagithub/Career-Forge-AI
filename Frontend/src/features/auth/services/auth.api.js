
import axios from "axios"


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true
})

export async function register({ username, email, password }) {

    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })

        return response.data

    } catch (err) {
        console.error("Register Error:", err.response?.data?.message || err.message)
        throw err.response?.data || { message: "Registration failed" }
    }

}

export async function login({ email, password }) {

    try {
        const response = await api.post("/api/auth/login", {
            email, password
        })

        return response.data

    } catch (err) {
        console.error("Login Error:", err.response?.data?.message || err.message)
        throw err.response?.data || { message: "Login failed" }
    }

}

export async function logout() {
    try {
        const response = await api.get("/api/auth/logout")
        return response.data
    } catch (err) {
        console.error("Logout Error:", err.response?.data?.message || err.message)
        throw err.response?.data || { message: "Logout failed" }
    }
}

export async function getMe() {

    try {
        const response = await api.get("/api/auth/get-me")
        return response.data
    } catch (err) {
        console.error("GetMe Error:", err.response?.data?.message || err.message)
        // Don't throw here - this is expected when user is not logged in
        return null
    }

}


