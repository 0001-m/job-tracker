Job Tracker

A personal tool I built to keep track of my ongoing internship/job applications. Since I am continuously applying for roles, I needed a simple, dedicated space to manage all my application statuses in one organized spot.

Live Demo https://job-tracker-kappa-nine.vercel.app

Tech Stack

Frontend: React and Vite (hosted on Vercel)
Backend: Node.js and Express (hosted on Render)
Database: MongoDB

Features

Add new job applications with the company name, role, and current status
Update or delete entries as the interview process progresses
Clean, distraction-free interface built for quick personal use
Secure login to keep my tracking data private
How to run locally

Clone the repository
Open two terminal windows

Backend Setup (Terminal 1)
cd server
npm install
npm start (Requires a .env file with your MONGO_URI, JWT_SECRET, and PORT)

Frontend Setup (Terminal 2)
cd client
npm install
npm run dev
