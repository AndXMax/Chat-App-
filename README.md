# Chat-App

A full-stack chat application with real-time messaging, user authentication, and sentiment analysis features. Built with Node.js/Express backend and React frontend.

## Features
- User authentication (signup/login)
- Real-time chat with Socket.io
- Friend management
- Sentiment analysis integration
- Error handling and middleware
- Modern React UI (Vite, TypeScript)

## Project Structure
```
backend/         # Node.js/Express server
  controllers/   # Route controllers
  models/        # Mongoose models
  routes/        # API routes
  middleware/    # Auth & error middleware
  db/            # Database connection
  config/        # Config files (e.g., JWT)
  data/          # Sample data
  server.js      # Entry point
frontend/
  frontend-react/ # React app (Vite, TypeScript)
	 src/         # Source code
		components/ # UI components
		Context/    # React context
		Pages/      # Page components
		types/      # Type definitions
		assets/     # Images/icons
	 public/      # Static files
	 ...          # Config files
nlp/             # Sentiment analysis scripts
nlp_key/         # Secret keys
socket/          # Socket.io logic
```

## Getting Started

### Backend
1. Install dependencies:
	```bash
	cd backend
	npm install
	```
2. Set up environment variables in `.env`.
3. Start the server:
	```bash
	npm start
	```

### Frontend
1. Install dependencies:
	```bash
	cd frontend/frontend-react
	npm install
	```
2. Start the React app:
	```bash
	npm run dev
	```

## Environment Variables
- Place your backend environment variables in `backend/.env`.

## License
MIT

---
Feel free to contribute or open issues for improvements!