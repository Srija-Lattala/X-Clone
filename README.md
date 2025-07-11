# X Clone – A Twitter Inspired Social Media Platform

A full-stack, feature-rich clone of Twitter (X) that allows users to post updates with images, like and comment on posts, receive real-time notifications, and discover suggested users. Built using the MERN (MongoDB, Express, React, Node.js) stack with a responsive UI powered by DaisyUI.

---

## 🚀 Live Demo

🌐 [View Live on Render](https://x-clone-yalk.onrender.com)

---

## 🛠️ Tech Stack

**Frontend**  
- React.js  
- Tailwind CSS  
- DaisyUI  
- Fetch API  

**Backend**  
- Node.js  
- Express.js  

**Database**  
- MongoDB (with Mongoose)  

**Tools & Utilities**  
- JSON Web Tokens (JWT) – for authentication  
- bcrypt.js – for password hashing  
- dotenv – for environment management  
- Postman – for API testing  

---

## ✨ Features

- 🧑 User Authentication using JWT  
- 🖼️ Create Posts with Images  
- ❤️ Like and 💬 Comment on Posts  
- 🔔 Real-Time Notifications (for Likes & Follows)  
- 👥 Follow / Unfollow Other Users  
- 🤝 Suggested Users Section  
- 🏠 Personalized Feed from Followed Users  
- 🔐 Secure Routes and Token-Based Authorization  
- 📱 Fully Responsive UI using DaisyUI  

---

## 📦 Getting Started

```bash
git clone https://github.com/Srija-Lattala/X-Clone.git
cd X-Clone

# Backend Setup
cd backend
npm install
# Create a .env file inside backend/ and add the following:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
# Start the backend server:
npm run dev

# Frontend Setup
cd ../frontend
npm install
npm start
```

Now visit [http://localhost:3000](http://localhost:3000) in your browser to use the app locally.

---

## 🗃️ Project Structure

```
X-Clone/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── ...
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── ...
└── README.md
```

---

## 📄 License

This project is open source under the MIT License.

---

Developed with ❤️ by Srija Lattala
