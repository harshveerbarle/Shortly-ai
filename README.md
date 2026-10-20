# ShortlyAI 🚀

**URL Shortener and AI Text Summarizer**

ShortlyAI is a web application that simplifies links and summarizes text using AI.

## ✨ Features

- 🔗 **URL Shortener** – Convert long URLs into short, shareable links.
- 🤖 **AI Text Summarizer** – Generate concise summaries from long text.
- 📝 **Summary Length Options** – Choose short, medium, or detailed summaries.
- 📋 **Copy to Clipboard** – Easily copy shortened URLs and generated summaries.
- 📱 **Responsive UI** – Simple and user-friendly interface.

## 🛠️ Tech Stack

**Frontend:** React.js, Vite, CSS

**Backend:** Node.js, Express.js

**Database:** MongoDB

**AI Integration:** Groq API

## 📂 Project Structure

```text
Shortly-Ai/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── db.js
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Shortly-Ai
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```

Start the backend:

```bash
npm run dev
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGODB_URI` | MongoDB connection string |
| `GROQ_API_KEY` | API key for AI summarization |

**Note:** Never commit your `.env` file or expose your API keys.

## 🔮 Future Improvements

- YouTube video summarization
- User authentication
- Summary and URL history
- User profile and theme customization

## 👨‍💻 Author

Developed as a full-stack project to combine URL shortening with AI-powered text summarization.
