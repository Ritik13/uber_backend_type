# 🚗 Uber Dispatch Core System (Backend)

A production-ready backend system that simulates real-time rider-driver dispatching like Uber, built with Node.js, Redis, PostgreSQL, Sequelize, and BullMQ. This project focuses on **real backend engineering principles** like race condition handling, queue-based retries, and Redis GEOSEARCH matching.

---

## ✅ Features Implemented

### 1. Rider & Driver Flows
- **Driver Check-In API**: Accepts driver location and adds to Redis GEO index.
- **Rider Request API**: Accepts pickup/drop and initiates match process.

### 2. Real-Time Matching (Redis GEOSEARCH)
- Uses `GEOSEARCH` to find closest available driver.
- Removes matched driver from Redis.

### 3. Race Condition Handling
- **Redis Lock (`SET NX`)**: Ensures driver is locked before match.
- **PostgreSQL `SELECT FOR UPDATE`**: DB-level fallback if Redis fails.

### 4. Trip Lifecycle
- Creates a `Trip` entry once match is made.
- Tracks status: `in_progress`, `completed`, `cancelled`.

### 5. Retry Matching (BullMQ Queue)
- Rider request with no nearby driver is queued.
- Worker retries match after delay.
- Only one job per rider (`jobId = rider_id`) to avoid duplicates.

### 6. Rate Limiting Middleware
- 3 requests per rider per 10 seconds.
- Fallback to `req.ip` if rider_id missing.
- Returns `429 Too Many Requests` with `Retry-After` header.

---

## 📦 Tech Stack

| Layer | Tech |
|------|------|
| Language | Node.js (Express) |
| DB | PostgreSQL + Sequelize ORM |
| Realtime | Redis (GEOSEARCH, TTL, Locks) |
| Queue | BullMQ |
| Structure | Controller → Service → Worker |

---

## 🧠 Engineering Patterns Used

- **Event-driven architecture**: decouples request and retry flows
- **Failover logic**: Redis lock + DB fallback
- **Queue deduplication**: via BullMQ `jobId`
- **Rate limiting**: Redis-based TTL window per rider/IP
- **Middleware-driven protection**: layered API defense

---

## 🚀 Future Enhancements (Planned)

### ✅ High-Impact Learning Features
- [ ] **Trip Completion API**: Mark trip as completed with timestamps
- [ ] **Driver Auto-Expire**: Use Redis TTL to remove inactive drivers
- [ ] **Rider Cancellation + Requeue**: Cancel trip and push back to match queue
- [ ] **Rate limit analytics**: Add logs to track blocked users

### 🛡️ System Enhancements
- [ ] JWT-based Auth layer for drivers & riders
- [ ] Logging layer (Winston/Redis fallback)
- [ ] Admin analytics: trips/day, avg duration, driver load
- [ ] Retry escalation after 3 fails (escalate to admin/alert)

---

## 📁 Folder Structure

```
/src
├── controllers
│   └── rider.controller.js
├── models
├── queues
│   └── matchRetry.queue.js
├── services
│   └── matching.service.js
├── workers
│   └── matchRetry.worker.js
├── middlewares
│   └── rateLimiter.js
```

---

## 🧪 Testing
- Manual tested with Postman / Thunder client
- Redis CLI used to verify live GEO and keys
- PostgreSQL checked with PgAdmin
- BullMQ queue logs confirmed via terminal

---

## 🙌 Author & Maintainer
Built by a backend engineer focusing on **production realism**, **system thinking**, and **job-readiness through real code**.

---
