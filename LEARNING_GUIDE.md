# 🎓 SocialHub Learning Guide for Students

## 📚 Welcome!

This guide is designed to help students (especially 5th semester and beyond) understand how to build and work with a production-grade microservices architecture. If you're learning about distributed systems, event-driven architecture, or modern backend development, this is for you!

---

## 🎯 What You'll Learn

1. **Microservices Architecture**: How to break down a monolith into independent services
2. **Event-Driven Design**: Using Kafka for asynchronous communication
3. **Real-time Communication**: WebSockets and Redis Pub/Sub
4. **Authentication & Authorization**: JWT tokens and API gateway patterns
5. **Database Design**: When to use PostgreSQL vs MongoDB vs Redis
6. **Containerization**: Docker and Docker Compose
7. **API Design**: RESTful principles and best practices

---

## 🏗️ Understanding the Architecture (Step by Step)

### Level 1: The Big Picture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
│                  (Web App / Mobile App)                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP/WebSocket
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                      NGINX GATEWAY                            │
│  - Receives ALL requests                                      │
│  - Validates JWT tokens                                       │
│  - Routes to correct service                                  │
│  - Load balancing                                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌────────┐        ┌────────┐        ┌────────┐
   │ Auth   │        │ Post   │        │ Users  │  ... more services
   │Service │        │Service │        │Service │
   └────────┘        └────────┘        └────────┘
```

**Why this design?**
- **Separation of Concerns**: Each service does ONE thing well
- **Independent Scaling**: Scale only what needs scaling
- **Team Autonomy**: Different teams can work on different services
- **Fault Isolation**: One service crash doesn't bring down everything

---

### Level 2: How Services Communicate

#### Pattern 1: Synchronous HTTP (Request-Response)
```
Client → Gateway → Auth Service → Database
                     ↓
                   Response back immediately
```

**When to use:** Operations that need immediate response
- Login/Signup
- Get user profile
- Fetch posts

**Example:**
```javascript
// Client sends
POST /auth/login
Body: { email, password }

// Auth service responds immediately
Response: { token: "jwt_token_here", user: {...} }
```

#### Pattern 2: Asynchronous Events (Fire and Forget)
```
Post Service → Kafka (message queue) → Notification Service
    ↓                                        ↓
Response immediately              Process later (async)
```

**When to use:** Operations that can happen in background
- Send notifications
- Update feeds
- Analytics

**Example:**
```javascript
// Post service creates post
createPost() {
  // Save to database
  const post = await db.post.create({...});
  
  // Publish event to Kafka (doesn't wait)
  kafka.publish('post.created', { postId: post.id });
  
  // Return immediately
  return post;
}

// Notification service listens
kafka.on('post.created', (event) => {
  // Process in background
  createNotification(event.postId);
});
```

**Benefits:**
- ✅ Faster response times
- ✅ Service independence
- ✅ Handles traffic spikes
- ✅ If notification service is down, posts still work!

---

## 🔑 Understanding Authentication Flow

This is often the MOST confusing part for students. Let's break it down:

### Step 1: User Logs In
```
Client                    Gateway                   Auth Service
  │                          │                          │
  ├─POST /auth/login────────▶│                          │
  │ {email, password}         │                          │
  │                          ├─Forward────────────────▶│
  │                          │                          │
  │                          │                     Check DB
  │                          │                     Hash password
  │                          │                     Generate JWT
  │                          │                          │
  │                          │◀─────Return token────────┤
  │◀─────Return token────────┤                          │
  │                          │                          │
```

**What's a JWT token?**
```
JWT = Header.Payload.Signature

Payload contains:
{
  "userId": "123",
  "username": "john",
  "exp": 1234567890  // expiration time
}
```

### Step 2: Making Authenticated Requests
```
Client                    Gateway                   Post Service
  │                          │                          │
  ├─GET /posts/feed─────────▶│                          │
  │ Header: Bearer token123   │                          │
  │                          │                          │
  │                      Verify token                   │
  │                      Extract user info              │
  │                          │                          │
  │                          ├─Forward with user info──▶│
  │                          │ x-user-payload: {id, username}
  │                          │                          │
  │                          │                     No token check!
  │                          │                     Just read header
  │                          │                          │
  │                          │◀─────Return posts────────┤
  │◀─────Return posts────────┤                          │
```

**Key Point:** Each service doesn't verify JWT! Gateway does it once.

---

## 💾 Choosing the Right Database

### PostgreSQL (Relational)
**Use when:**
- Data has clear relationships (users follow users)
- Need ACID transactions (money transfers)
- Complex queries with JOINs
- Data integrity is critical

**In our project:**
- Users table
- Follow relationships
- Authentication data

**Example Schema:**
```sql
User:
  - id (primary key)
  - email (unique)
  - username (unique)
  
Follow:
  - followerId (foreign key → User)
  - followingId (foreign key → User)
  - UNIQUE(followerId, followingId)
```

### MongoDB (Document/NoSQL)
**Use when:**
- Flexible schema (fields vary per document)
- High write volume
- Nested data structures
- Horizontal scaling needed

**In our project:**
- Posts (can have varying fields)
- Comments (nested structures)
- Notifications (many writes)

**Example Document:**
```javascript
Post: {
  _id: "507f1f77bcf86cd799439011",
  userId: "123",
  content: "Hello world",
  media: ["url1", "url2"],  // Array of any length
  tags: ["tech", "ai"],     // Flexible
  likes: 42,
  comments: [               // Nested
    { userId: "456", text: "Nice!" }
  ]
}
```

### Redis (In-Memory)
**Use when:**
- Need extreme speed (<1ms)
- Temporary data (cache)
- Real-time features
- Session storage

**In our project:**
- Chat message history (temporary)
- Session cache
- Pub/Sub for real-time

---

## 🎯 How to Learn This Project (Your 100% Good Way!)

### Week 1: Start with One Service
**Don't try to understand everything at once!**

1. **Pick Auth Service** (simplest to understand)
2. Read the code in this order:
   - `src/index.ts` - Entry point
   - `src/routes/` - What endpoints exist?
   - `src/controller/` - What does each endpoint do?
   - `prisma/schema.prisma` - What data do we store?

3. **Run it locally:**
```bash
cd services/auth-service
npm install
npm run dev
```

4. **Test it with curl:**
```bash
# Sign up
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Pass123!","username":"testuser","name":"Test"}'

# Log in
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@test.com","password":"Pass123!"}'
```

5. **Modify something small:**
   - Add a new field to user (e.g., "bio")
   - Return it in the response
   - Test your change

### Week 2: Understand Service Communication

1. **Study Users Service** (introduces Kafka)
   - How does follow/unfollow work?
   - Where does it publish events?
   - Who consumes these events?

2. **Run two services together:**
```bash
# Terminal 1
cd services/users-service && npm run dev

# Terminal 2
cd services/notification-service && npm run dev
```

3. **Trace an event:**
   - User A follows User B
   - Users Service publishes to Kafka
   - Notification Service receives event
   - Creates notification in MongoDB

### Week 3: Real-time Features

1. **Study Chat Service**
   - Socket.IO basics
   - Redis pub/sub
   - Multi-instance architecture

2. **Build a simple chat client:**
```javascript
const io = require('socket.io-client');
const socket = io('http://localhost:5004');

socket.on('connect', () => {
  console.log('Connected!');
  socket.emit('join_room', { roomId: 'test-room' });
});

socket.on('message', (data) => {
  console.log('Received:', data);
});
```

### Week 4: Build Something New

**Now implement the Feed Service!** (See FEED_SERVICE_README.md)

---

## 🛠️ Essential Tools You Need to Know

### 1. Postman / cURL
**For testing APIs**
```bash
# GET request
curl http://localhost:5000/health

# POST with JSON
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"user@example.com","password":"password"}'

# With authentication
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5001/api/v1/posts/
```

### 2. Docker & Docker Compose
**For running infrastructure**
```bash
# Start all databases
docker-compose up -d postgres mongodb redis kafka

# View logs
docker-compose logs -f postgres

# Stop everything
docker-compose down
```

### 3. Prisma (ORM)
**For database operations**
```bash
# Create migration
npx prisma migrate dev --name add_bio_field

# Generate client
npx prisma generate

# View database in browser
npx prisma studio
```

### 4. Git
**For version control**
```bash
# Create feature branch
git checkout -b feature/my-new-feature

# Stage changes
git add .

# Commit
git commit -m "Add bio field to user"

# Push
git push origin feature/my-new-feature
```

---

## 🐛 Common Mistakes Students Make

### Mistake 1: Not Reading Error Messages
```
❌ "It's not working!"
✅ "I got error: 'Connection refused on port 5432'"
   → Oh, PostgreSQL isn't running!
```

**Fix:** Always read the full error message and stack trace.

### Mistake 2: Not Using Environment Variables
```
❌ const JWT_SECRET = "hardcoded_secret";
✅ const JWT_SECRET = process.env.JWT_SECRET;
```

**Fix:** Always use `.env` files for configuration.

### Mistake 3: Not Understanding Async/Await
```javascript
❌ 
const user = db.user.findUnique({ where: { id } });
console.log(user); // undefined!

✅
const user = await db.user.findUnique({ where: { id } });
console.log(user); // { id: "123", name: "John" }
```

**Fix:** Always `await` database calls and API calls.

### Mistake 4: Exposing Secrets
```
❌ Committing .env file with real API keys
✅ Add .env to .gitignore, use .env.example for templates
```

### Mistake 5: Not Testing Locally First
```
❌ Make changes → Push to GitHub → Deploy → Error!
✅ Make changes → Test locally → Works? → Commit → Push
```

---

## 📖 Learning Resources

### Basics (Start Here)
- **HTTP & REST APIs**: [MDN Web Docs - HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- **JavaScript Async/Await**: [javascript.info async/await](https://javascript.info/async-await)
- **Git Basics**: [Git Handbook](https://guides.github.com/introduction/git-handbook/)

### Intermediate
- **Node.js**: [Node.js Official Docs](https://nodejs.org/en/docs/)
- **Express.js**: [Express Guide](https://expressjs.com/en/guide/routing.html)
- **PostgreSQL**: [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- **MongoDB**: [MongoDB University](https://university.mongodb.com/)

### Advanced
- **Microservices**: [Microservices.io](https://microservices.io/)
- **Kafka**: [Kafka Documentation](https://kafka.apache.org/documentation/)
- **Socket.IO**: [Socket.IO Docs](https://socket.io/docs/v4/)
- **Redis**: [Redis University](https://university.redis.com/)

### System Design
- **System Design Primer**: [GitHub - donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer)
- **Designing Data-Intensive Applications** (Book by Martin Kleppmann)

---

## 🎯 Project Ideas to Practice

### Beginner Level
1. **Add a new field to User**
   - Add "bio" to User model
   - Create endpoint to update bio
   - Return bio in profile response

2. **Add post bookmarking**
   - Create Bookmark model
   - Add bookmark/unbookmark endpoints
   - List bookmarked posts

### Intermediate Level
3. **Implement Feed Service**
   - Follow the FEED_SERVICE_README.md
   - Create personalized feed algorithm
   - Add pagination

4. **Add hashtag search**
   - Extract hashtags from posts
   - Create search endpoint
   - Return posts matching hashtag

### Advanced Level
5. **Add rate limiting**
   - Use Redis to track request counts
   - Limit requests per user per minute
   - Return 429 Too Many Requests

6. **Add caching layer**
   - Cache user profiles in Redis
   - Invalidate on update
   - Measure performance improvement

---

## 🤝 How to Get Help

1. **Read the service README first**
   - Each service has detailed documentation
   - Look at the code flow diagrams
   - Check the API examples

2. **Check the logs**
```bash
# Docker logs
docker-compose logs -f service-name

# Application logs
npm run dev  # Watch terminal output
```

3. **Use debugging tools**
```javascript
// Add console.logs
console.log('User ID:', userId);
console.log('Post data:', postData);

// Use debugger
debugger;  // Code pauses here when running with debugger
```

4. **Ask specific questions**
   - ❌ "Chat service not working"
   - ✅ "Chat service gives 'Cannot read property id of undefined' at line 45 in chatController.ts when I try to join a room"

---

## 🎓 Assessment: Are You Ready?

Test your understanding with these questions:

### Level 1 (Beginner)
- [ ] Can you explain what a microservice is?
- [ ] Do you know the difference between GET and POST?
- [ ] Can you read a Prisma schema and understand the relationships?
- [ ] Can you start a service locally and test with curl?

### Level 2 (Intermediate)
- [ ] Can you explain how JWT authentication works?
- [ ] Do you understand async/await and Promises?
- [ ] Can you trace an event from producer to consumer?
- [ ] Can you add a new API endpoint?

### Level 3 (Advanced)
- [ ] Can you design a new service from scratch?
- [ ] Do you understand when to use Kafka vs HTTP?
- [ ] Can you implement real-time features with WebSockets?
- [ ] Can you optimize database queries with indexes?

---

## 🚀 Next Steps

1. **Set up your local environment** (see main README.md)
2. **Pick ONE service to study this week**
3. **Read this guide section by section** (don't rush!)
4. **Make small changes and test them**
5. **Implement the Feed Service** (hands-on learning!)
6. **Share your learnings** (teach others to reinforce your knowledge)

---

## 💡 Final Tips

1. **Progress > Perfection**: Don't aim for perfect code initially. Make it work, then make it better.

2. **Read other people's code**: The best way to learn is by reading production code (like this project).

3. **Build something**: Theory is important, but you learn most by building.

4. **Take breaks**: If stuck for >30 minutes, take a break. Come back with fresh eyes.

5. **Document your learnings**: Keep notes of what you learn. It helps retention.

6. **Ask "Why?"**: Don't just copy code. Understand WHY something is done a certain way.

---

**Remember:** Every expert was once a beginner. The fact that you're here, asking how to learn properly, means you're on the right path! 

Good luck on your learning journey! 🎓✨

---

**Made with ❤️ for students learning microservices architecture**
