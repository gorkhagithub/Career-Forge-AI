// const express = require("express")

// const cookieParser = require("cookie-parser")

// const cors = require("cors")

// const app = express() //Server One Insite Create Karna 

// // Middel Ware We Are Used 

// app.use(express.json())  // That Are Used To Request For Read Boday Data
// app.use(cookieParser())
// app.use(cors({

//     origin:"http://localhost:5173",
//     credentials:true

// }))


// // Auth Router Are Required here 

// const authRouter = require("./routes/auth.routes")

// const interviewRouter = require("./routes/interview.routes")

// // Ussing All The Routes Haire 
// app.use("/api/auth",authRouter)
// app.use("/api/interview" , interviewRouter )


// module.exports = app



// Git Hub 

const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: process.env.FRONTEND_URL || /^http:\/\/localhost:\d+$/,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))


const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app