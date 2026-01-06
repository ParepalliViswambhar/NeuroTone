# 🎭 Emotion AI - Voice Emotion Detection System

A full-stack AI application that detects emotions from voice recordings using deep learning.

## 🚀 Quick Links

- **[Deployment Guide](DEPLOYMENT.md)** - Complete step-by-step deployment instructions
- **[Quick Start](QUICK_START.md)** - Fast track deployment (30 minutes)

---

## 🏗️ Architecture

- **Frontend**: React.js (deployed on Vercel)
- **Backend**: Node.js + Express (deployed on Render)
- **ML Service**: Python + Flask + TensorFlow (deployed on Render)
- **Database**: MongoDB Atlas

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd emotion-ai
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Setup ML Service**
   ```bash
   cd backend/ml_service
   pip install numpy librosa tensorflow flask flask-cors werkzeug
   ```

### Running Locally

1. **Start MongoDB** (if using local)
   ```bash
   mongod
   ```

2. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   node server.js
   ```

3. **Start ML Service** (Terminal 2)
   ```bash
   cd backend/ml_service
   python app.py
   ```

4. **Start Frontend** (Terminal 3)
   ```bash
   cd frontend
   npm start
   ```

5. **Access the app**: http://localhost:3000

---

## 📦 Dependencies

### Backend (Node.js)
```bash
npm install express mongoose cors multer form-data node-fetch fs path bcrypt
```

**Packages:**
- express - Web framework for Node.js
- mongoose - ODM (Object Data Modeling) library for MongoDB
- cors - Middleware to enable CORS (Cross-Origin Resource Sharing)
- multer - Middleware for handling file uploads
- form-data - To create and send form data (especially for multipart/form-data)
- node-fetch - To make HTTP requests
- bcrypt - Password hashing
- fs (File System) - Built-in, no need to install
- path - Built-in, no need to install

### ML Service (Python)
```bash
pip install numpy librosa tensorflow flask flask-cors werkzeug
```

**Packages:**
- numpy - For numerical operations
- librosa - For audio processing
- tensorflow - For machine learning and deep learning tasks
- flask - To create a web server
- flask-cors - To handle Cross-Origin Resource Sharing (CORS)
- werkzeug - To handle secure file uploads

### Frontend (React)
```bash
npm install react react-dom react-router-dom
```

---

## 🌐 Deployment

### Quick Deployment (30 minutes)
See **[QUICK_START.md](QUICK_START.md)** for fast track deployment.

### Detailed Deployment
See **[DEPLOYMENT.md](DEPLOYMENT.md)** for complete instructions.

### Deployment Platforms
- **Frontend**: Vercel (Free tier available)
- **Backend**: Render (Free tier available)
- **ML Service**: Render (Free tier available)
- **Database**: MongoDB Atlas (Free tier available)

---

## 🔐 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://127.0.0.1:27017/emotionAI
PORT=8000
FRONTEND_URL=http://localhost:3000
ML_SERVICE_URL=http://localhost:5000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000
```

---

## 📁 Project Structure

```
emotion-ai/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── ml_service/      # Python ML service
│   │   ├── app.py
│   │   ├── requirements.txt
│   │   └── sound_to_emotion_model3.keras
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── config.js    # API configuration
│   │   └── App.js
│   └── package.json
├── DEPLOYMENT.md        # Detailed deployment guide
├── QUICK_START.md       # Quick deployment guide
└── README.md
```

---

## 🎯 Features

- 🎤 Voice emotion detection from audio files
- 👤 User authentication and authorization
- 📊 Detailed emotion analysis reports
- 📈 Emotion probability distribution
- 💾 Historical data tracking
- 🎨 Modern, responsive UI
- 🔒 Secure password hashing
- ☁️ Cloud-ready architecture

---

## 🧪 Testing

After deployment, test your application:

1. Visit your Vercel URL
2. Create a new account
3. Upload an audio file (.wav format recommended)
4. View emotion detection results
5. Check your reports page

---

## 🐛 Troubleshooting

### Common Issues

**Frontend can't connect to backend:**
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS configuration in backend
- Ensure backend is running

**ML service errors:**
- Check if model file exists
- Verify Python dependencies are installed
- Check Render logs for errors

**Database connection issues:**
- Verify MongoDB connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

---

## 📝 License

MIT

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

## 🎉 Acknowledgments

- TensorFlow for ML framework
- Librosa for audio processing
- React for frontend framework
- Express for backend framework