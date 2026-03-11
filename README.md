# 📄 DocMind – RAG Assistant

A full-stack AI-powered document assistant that lets you upload PDF files and ask questions about them using a local LLM. Built with FastAPI, React, LangChain, Qdrant, and Ollama — fully open source and runs locally.

---

## 🧠 How It Works

```
PDF Upload                        User Query
    ↓                                  ↓
PyPDFLoader                   Convert to embedding
    ↓                             (nomic-embed-text)
Chunk it                               ↓
(RecursiveTextSplitter)          Qdrant search
    ↓                             (top 5 chunks)
nomic-embed-text                       ↓
    ↓                          Stuff into prompt
Store → Qdrant                  (LangChain chain)
                                       ↓
                                llama3 generates
                                       ↓
                               Return to user
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI (Python) |
| RAG Framework | LangChain |
| Vector Database | Qdrant |
| LLM Runtime | Ollama |
| Embedding Model | nomic-embed-text |
| LLM Model | llama3 / llama3.2:1b |
| Containerization | Docker + Docker Compose |

---

## 📁 Project Structure

```
rag-assistant/
├── docker-compose.yml        # Qdrant + Ollama services
├── .env                      # Environment variables
├── backend/
│   ├── main.py               # FastAPI entry point
│   ├── config.py             # Settings from .env
│   ├── requirements.txt      # Python dependencies
│   ├── rag/
│   │   ├── index.py          # PDF → chunks → embeddings → Qdrant
│   │   └── retrieve.py       # Query → search → LLM → answer
│   ├── api/
│   │   ├── upload.py         # POST /upload endpoint
│   │   └── chat.py           # POST /ask endpoint
│   └── uploads/              # Uploaded PDF files
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── context/
    │   │   └── AppContext.jsx # Global state (Context API)
    │   ├── services/
    │   │   └── api.js         # Axios API calls
    │   └── components/
    │       ├── LeftPanel.jsx  # PDF upload panel
    │       └── RightPanel.jsx # Chat panel
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Python 3.10+](https://www.python.org/)
- [Node.js 18+](https://nodejs.org/)
- [Ollama](https://ollama.com/) (installed locally)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/rag-assistant.git
cd rag-assistant
```

---

### 2. Set Up Environment Variables

Create a `.env` file in the `backend/` folder:

```env
QDRANT_HOST=localhost
QDRANT_PORT=6333
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_EMBED_MODEL=nomic-embed-text
OLLAMA_LLM_MODEL=llama3.2:1b
UPLOAD_DIR=uploads
COLLECTION_NAME=documents
```

---

### 3. Start Docker Services (Qdrant)

```bash
docker compose up -d
```

---

### 4. Pull Ollama Models

```bash
ollama pull nomic-embed-text
ollama pull llama3.2:1b
```

> 💡 If running Ollama inside Docker:
> ```bash
> docker exec -it rag-assistant-ollama-1 ollama pull nomic-embed-text
> docker exec -it rag-assistant-ollama-1 ollama pull llama3.2:1b
> ```

---

### 5. Run the Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`

---

### 6. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload` | Upload a PDF file |
| `POST` | `/ask` | Ask a question about uploaded documents |

### Upload PDF
```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@document.pdf"
```

### Ask a Question
```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the vacation policy?"}'
```

---

## 💡 Use Cases

- **HR Policy Bot** — Upload company policy PDFs, let employees ask questions
- **Study Assistant** — Upload textbooks or notes, ask questions while studying
- **Onboarding Tool** — Upload onboarding docs, new employees get instant answers
- **Legal Document Q&A** — Ask questions about contracts or agreements

---

## ⚙️ Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `QDRANT_HOST` | `localhost` | Qdrant host |
| `QDRANT_PORT` | `6333` | Qdrant port |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama API URL |
| `OLLAMA_EMBED_MODEL` | `nomic-embed-text` | Embedding model |
| `OLLAMA_LLM_MODEL` | `llama3.2:1b` | LLM for generation |
| `UPLOAD_DIR` | `uploads` | PDF storage directory |
| `COLLECTION_NAME` | `documents` | Qdrant collection name |

---

## 🔮 Roadmap

- [ ] User authentication (JWT)
- [ ] Chat history persistence
- [ ] Multi-PDF selection for targeted search
- [ ] Hybrid search (vector + keyword)
- [ ] Source citation with page numbers
- [ ] Streaming responses
- [ ] Deployment on Render (free tier)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📝 License

MIT License — free to use and modify.

---

## 👤 Author

Built with ❤️ — open to feedback and contributions!
