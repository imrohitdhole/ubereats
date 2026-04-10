# UBE (Uber Eats–style app)

Full-stack web application with a React client, Express API, MongoDB, and Kafka for order-related messaging. Suitable for learning distributed systems patterns (containers, messaging, persistence).

## Tech stack

| Layer        | Technology                                      |
| ------------ | ----------------------------------------------- |
| Frontend     | React (Create React App), Redux Toolkit, Axios |
| Backend      | Node.js, Express, Mongoose, KafkaJS             |
| Data         | MongoDB                                         |
| Messaging    | Apache Kafka (Confluent images via Docker)      |
| Containers   | Docker Compose                                  |

## Repository layout

```
UBE/
├── frontend/          # React SPA (default dev server: http://localhost:3000)
├── backend/           # REST API (default: http://localhost:5001)
│   ├── docker-compose.yml
│   ├── .env.example   # Copy to .env for local development
│   └── kafka/         # Producer / consumer / topic init
└── README.md
```

Secrets live in `backend/.env`. That file is **gitignored**; use `backend/.env.example` as a template.

## Prerequisites

- **Node.js** (LTS recommended) and npm  
- **Docker Desktop** (or Docker Engine + Compose) for MongoDB and Kafka  

## Environment variables

Copy the example file and fill in values:

```bash
cp backend/.env.example backend/.env
```

| Variable              | Purpose |
| --------------------- | ------- |
| `PORT`                | API port (default `5001`) |
| `MONGODB_URI`         | MongoDB connection string |
| `KAFKA_BROKER`        | Kafka bootstrap broker(s) |
| `JWT_SECRET`          | Signing key for JWTs |
| `GOOGLE_MAPS_API_KEY` | Used by location / maps features |

For **local Node** (`npm start` in `backend`), point services at your machine:

- MongoDB: `mongodb://127.0.0.1:27017/ubereats` (when MongoDB is exposed on port `27017`)
- Kafka: `localhost:29092` (matches the **host-facing** listener in `docker-compose.yml`)

Docker Compose sets `MONGODB_URI` and `KAFKA_BROKER` inside the `app` container so the API container uses service names (`mongodb`, `kafka:9092`).

Optional frontend override:

```bash
# In frontend/, e.g. .env.local
REACT_APP_API_URL=http://localhost:5001
```

## Local development (recommended)

Run infrastructure in Docker and the app processes on the host for fast iteration.

1. **Start MongoDB, Zookeeper, and Kafka**

   ```bash
   cd backend
   docker compose up -d mongodb zookeeper kafka
   ```

   Wait until Kafka’s health check is healthy (first start can take a minute).

2. **Backend**

   ```bash
   cd backend
   npm install
   npm start
   ```

   The API listens on **http://localhost:5001** (or `PORT` from `.env`).

3. **Frontend** (new terminal)

   ```bash
   cd frontend
   npm install
   npm start
   ```

   Opens **http://localhost:3000** and proxies API calls to the backend URL above.

4. **Kafka topics (if needed)**

   ```bash
   cd backend
   npm run init-topics
   ```

## Full stack with Docker

Build and run the API container together with MongoDB and Kafka:

```bash
cd backend
docker compose up --build
```

Compose maps the API to port **5001**. Start the React app separately with `npm start` in `frontend/` unless you add a frontend service to Compose.

## Ports reference

| Port  | Service |
| ----- | ------- |
| 3000  | React dev server |
| 5001  | Express API |
| 27017 | MongoDB |
| 2181  | Zookeeper |
| 9092  | Kafka (internal / Docker network) |
| 29092 | Kafka (from host OS when using local `npm start` for the backend) |

## Troubleshooting

- **`ENOTFOUND mongodb` or `ENOTFOUND kafka`** when running the backend with `npm start`: your `backend/.env` is still using Docker-only hostnames. Use `127.0.0.1` / `localhost` and `localhost:29092` for Kafka as in `.env.example`.
- **Docker network “not found”**: from `backend/`, run `docker compose down --remove-orphans` and start services again.
- **Kafka connection errors from the host**: ensure you use the **29092** listener for `KAFKA_BROKER` when Node runs outside Docker; the Compose file advertises `localhost:29092` for that path.

## License

ISC (backend `package.json`). 
