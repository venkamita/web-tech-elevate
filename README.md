## Elevate (MERN) 

This project implements the 8 required pages using MongoDB, Express.js, Node.js, and React.js.

### Structure
- `backend/` — Express API with MongoDB (users, teachers, classes, videos, bookings, profile).
- `frontend/` — React (Vite) app with 8 pages and routing.

### Prerequisites
- Node.js 18+
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### Backend — setup and run
```bash
cd backend
npm install
setx MONGO_URI "mongodb://127.0.0.1:27017/elevate"
setx JWT_SECRET "devsecret"
npm run dev
```

Server starts at `http://localhost:5000`.

### Frontend — setup and run
```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`.

### Pages implemented
1. Login (Sign up / Login) — `/login`
2. Home (videos + search) — `/`
3. Stream video — `/stream/:id`
4. Timer / Audio tool — `/timer`
5. Discover classes/teachers — `/discover`
6. Booking — `/booking`
7. Profile — `/profile`
8. About us — `/about`

### Notes
- On first API calls, seeds for teachers, classes, and sample videos are created.
- Configure `VITE_API_BASE` in a `.env` file inside `frontend/` if the backend URL differs.
  
### Contributors
-Shubham Singh(PES1UG24CS451)
-Shishir Hegde(PES1UG24CS438)
-Sharat Doddihal(PES1UG24CS430)

