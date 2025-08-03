# DesireDeal Startup Guide

## Quick Fix for Chat Connection Issues

If you're experiencing `net::ERR_NAME_NOT_RESOLVED` or Socket.IO connection errors, follow these steps:

## 1. Start the Backend Server

### Navigate to the backend directory:
```bash
cd backend
```

### Install dependencies (if not already done):
```bash
npm install
```

### Create a `.env` file in the backend directory:
```bash
# Backend/.env
MONGO_URI=mongodb://localhost:27017/desiredeal
JWT_SECRET=your-secret-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:3000
PORT=5000
```

### Start the backend server:
```bash
npm start
```

You should see:
```
Server running on port 5000
Connected to MongoDB
```

## 2. Verify Backend is Running

### Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "message": "DesireDeal API is running"
}
```

## 3. Start the Frontend

### In a new terminal, navigate to the frontend directory:
```bash
cd frontend
```

### Install dependencies (if not already done):
```bash
npm install
```

### Start the frontend development server:
```bash
npm run dev
```

## 4. Test the Chat Functionality

1. **Open your browser** and go to `http://localhost:3000`
2. **Register/Login** as both a buyer and seller
3. **Create some gift cards** as a seller
4. **Browse products** as a buyer
5. **Click "Chat with Seller"** on any product card

## Common Issues and Solutions

### Issue 1: "Cannot connect to chat server"
**Solution:** Make sure the backend server is running on port 5000

### Issue 2: "Seller information not available"
**Solution:** This means the gift card doesn't have a seller assigned. Create gift cards as a seller first.

### Issue 3: "Socket.IO connection failed"
**Solution:** 
1. Check if backend is running: `curl http://localhost:5000/api/health`
2. Check browser console for CORS errors
3. Ensure both frontend and backend are running

### Issue 4: "MongoDB connection failed"
**Solution:**
1. Install MongoDB if not installed
2. Start MongoDB service
3. Check the MONGO_URI in your .env file

## Environment Variables Required

### Backend (.env)
```bash
MONGO_URI=mongodb://localhost:27017/desiredeal
JWT_SECRET=your-secret-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:3000
PORT=5000
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000/api
```

## Troubleshooting Steps

### 1. Check if MongoDB is running:
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

### 2. Check if ports are available:
```bash
# Check if port 5000 is in use
lsof -i :5000

# Check if port 3000 is in use
lsof -i :3000
```

### 3. Check network connectivity:
```bash
# Test backend connectivity
curl http://localhost:5000/api/health

# Test frontend connectivity
curl http://localhost:3000
```

### 4. Check browser console for errors:
- Open Developer Tools (F12)
- Go to Console tab
- Look for red error messages
- Check Network tab for failed requests

## Development Workflow

1. **Start MongoDB** (if using local database)
2. **Start Backend** (`cd backend && npm start`)
3. **Start Frontend** (`cd frontend && npm run dev`)
4. **Test functionality** in browser
5. **Check logs** in both terminal windows for errors

## Production Deployment

For production deployment, you'll need to:

1. Set up a production MongoDB instance
2. Configure Cloudinary for file uploads
3. Set up proper environment variables
4. Use a production build of the frontend
5. Set up proper CORS configuration

## Support

If you're still experiencing issues:

1. Check the browser console for specific error messages
2. Check the backend terminal for server errors
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed
5. Try restarting both frontend and backend servers

---

**Note:** The chat functionality requires both the frontend and backend to be running simultaneously. Make sure both servers are started before testing the chat features. 