

require("dotenv").config()

const app = require("./src/app")
const connectToDB = require("./src/config/database")

const PORT = process.env.PORT || 3000

async function startServer() {
    try {
        await connectToDB()

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`)
        })

    } catch (err) {
        console.error("❌ Failed to start server:", err.message)
        process.exit(1)
    }
}

startServer()

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err)
    process.exit(1)
})

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err)
    process.exit(1)
})