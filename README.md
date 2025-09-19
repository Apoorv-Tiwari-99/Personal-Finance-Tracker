# 💰 Personal Finance Tracker+

A full-stack web application to help users manage daily expenses, set budgets, and view insightful reports.  
Built with **Next.js, Node.js/Express, MongoDB and Flask (Python)**.

---

## ✨ Features
- **User Authentication** – Signup/Login with secure JWT.
- **Expense Management** – Add, edit, delete, filter, and search expenses.
- **Budgets & Alerts** – Set monthly budgets, get alerts when exceeding 80% or 100%.
- **Dashboard & Reports**
  - Monthly total spending  
  - Top category  
  - Top payment methods  
  - Category-wise pie chart  
  - Spending trends over time
- **Smart Suggestions (Python)** – Personalized spending advice using Flask + Pandas.

---

## 🛠️ Tech Stack
- **Frontend:** Next.js 15 (React), TypeScript, TailwindCSS, Recharts
- **Backend:** Node.js, Express.js, MongoDB
- **Python Service:** Flask, Pandas
- **Deployment:**  
  - Frontend → Vercel  
  - Backend & Python Service → Render

---

## 🚀 Live Demo
- **Frontend (Vercel):** https://personal-finance-tracker-theta-gold.vercel.app/ 


---

## ⚙️ Installation & Setup

### 1. Clone the Repo
   git clone repo_url
   cd Personal-Finance-Tracker
   
### 2. Backend Setup
cd backend
npm install
npm run dev   # starts on http://localhost:5000

### 3. Frontend Setup
cd frontend
npm install
npm run dev   # starts on http://localhost:3000

🔑 Environment Variables

Create .env files in respective folders. See .env.example for guidance.

Backend (backend/.env):
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
PORT=5000
PYTHON_SERVICE_URL=python_service_url
INTERNAL_API_KEY=your-secure-api-key-12345 // you can use this 

Frontend (frontend/.env.local):
NEXT_PUBLIC_API_URL=http://localhost:5000 // your backend api 

🧪 Test Credentials

Use this demo account:
Email: user@example.com
Password: 123456

📌 Project Structure
Personal-Finance-Tracker/
├── backend/         # Node.js + Express API
├── frontend/        # Next.js + TailwindCSS UI
├── README.md
├── .gitignore

