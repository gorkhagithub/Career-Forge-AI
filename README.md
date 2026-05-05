<div align="center">
  <img src="assets/banner.png" alt="Career-Forge-AI Banner" width="100%">
  
  <h1>Career-Forge-AI 🚀</h1>
  <p><strong>Your Ultimate AI-Powered Interview Preparation Platform</strong></p>
</div>

<br />

## 🌟 Overview

**Career-Forge-AI** is a cutting-edge, full-stack platform designed to help job seekers prepare for interviews with precision and confidence. By analyzing a candidate's resume, self-description, and the target job description, our AI engine (powered by Groq's Llama-3.3) generates a highly personalized and structured **Interview Strategy Report**.

The report acts as a dedicated career coach, providing tailored technical questions, behavioral scenarios, skill gap analysis, and a structured day-by-day preparation plan.

---

## ✨ Key Features

- 🧠 **AI-Powered Analysis:** Leverages **Groq** (Llama-3.3-70b) to deeply understand your resume and compare it against real-world job descriptions.
- 🎯 **Match Score:** Get an instant percentage score showing how well your profile aligns with your target job.
- 💻 **Technical & Behavioral Scenarios:** Receives curated interview questions, the interviewer's hidden intention behind them, and optimal strategies to answer them.
- 📉 **Skill Gap Identification:** Highlights missing or weak skills relative to the job, categorized by severity (Low, Medium, High).
- 📅 **Actionable Preparation Plan:** A day-by-day study roadmap customized exactly for you to bridge your skill gaps before the big day.
- 🔒 **Secure Authentication:** JWT-based robust authentication system ensuring your personal data and reports are kept private.
- 📄 **PDF Parsing:** Seamlessly upload and parse your existing resume PDFs.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **SCSS** for scalable, modular styling
- **Axios** for API communication
- React Router DOM for seamless navigation

### Backend
- **Node.js & Express.js**
- **MongoDB** (with Mongoose) for database management
- **JWT & bcrypt** for authentication and security
- **Groq SDK** for blazing-fast AI inference
- **pdf-parse** for extracting text from resumes

---

## 🚀 Quick Start (Local Development)

### 1. Clone the Repository
```bash
git clone https://github.com/gorkhagithub/Career-Forge-AI.git
cd Career-Forge-AI
```

### 2. Setup the Backend
```bash
cd Backend
npm install
```
Create a `.env` file in the `Backend` directory with the following:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GROQ_API_KEY=gsk_your_groq_api_key
FRONTEND_URL=http://localhost:5173
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal tab:
```bash
cd Frontend
npm install
```
Create a `.env` file in the `Frontend` directory:
```env
VITE_API_URL=http://localhost:3000
```
Start the frontend development server:
```bash
npm run dev
```

---

## 🌐 Deployment Instructions

Since this is a **Monorepo** containing both the Frontend and Backend, pay special attention to the **Root Directory** when deploying.

### 🟢 Deploying the Backend (Render)
1. Connect this GitHub repository to Render as a **Web Service**.
2. **Root Directory:** `Backend`
3. **Build Command:** `npm install`
4. **Start Command:** `node server.js`
5. Add your `.env` variables in the Render dashboard.

### 🎨 Deploying the Frontend (Vercel)
1. Import this GitHub repository into Vercel.
2. **Root Directory:** Edit this to `Frontend` before clicking deploy!
3. Add the Environment Variable `VITE_API_URL` and set it to your new Render Backend URL.
4. Deploy!

---

<div align="center">
  <p>Built with ❤️ for ambitious job seekers everywhere.</p>
</div>
