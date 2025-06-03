✅ Local Setup Instructions

# Go to backend directory
cd backend

# Install dependencies
npm install

# Copy env config
cp .env.example .env

# Run the app
npm run dev

Environment Variables Required:
MONGO_URI=<your_mongodb_uri>
REDIS_URL=redis://localhost:6379
HUGGINGFACE_API_URL=http://localhost:5000/generate

🧭 Architecture (Backend)
graph TD
  A[REST API - Express.js] --> B[Validate & Publish to Redis Stream]
  B --> C[Consumer Worker]
  C --> D[MongoDB: Save Campaigns, Customers]
  A --> E[Campaign Receipt Logging]

AI Tools & Tech Used (Backend)
Node.js + Express – API framework.

MongoDB – Campaign and customer storage.

Redis Streams – Pub-sub style queue for async tasks.

ioredis – Redis client.

Hugging Face hosted model – Message generation (rule-based inference).

⚠️ Known Limitations (Backend)
Consumer worker must be manually restarted on crash.

No authentication/authorization on the API.

Hugging Face model must be up and running or calls will fail.

Redis must be available locally or remotely for pub-sub to work.

