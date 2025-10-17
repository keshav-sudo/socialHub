# 🚀 Feed Service Quick Start

Want to get started implementing the Feed Service right now? Follow this guide!

---

## ⏱️ 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd services/feed-service
npm init -y
npm install express typescript tsx @prisma/client dotenv cors helmet ioredis
npm install -D @types/express @types/node @types/cors
```

### Step 2: Create Basic Structure
```bash
mkdir -p src/{routes,controller,services,config}
touch src/index.ts src/routes/feedRoutes.ts src/controller/feedController.ts
touch src/services/feedService.ts src/services/rankingService.ts
touch src/config/redis.ts
```

### Step 3: Add TypeScript Config
Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

### Step 4: Add Scripts to package.json
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### Step 5: Create .env
```env
PORT=5005
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postsdb
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## 📝 Minimal Working Example (15 minutes)

### src/index.ts
```typescript
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'feed-service' });
});

app.get('/api/v1/feed', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Feed endpoint - to be implemented',
    posts: [] 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Feed Service running on port ${PORT}`);
});
```

### Test It
```bash
npm run dev

# In another terminal:
curl http://localhost:5005/health
curl http://localhost:5005/api/v1/feed
```

**✅ If you see responses, you're ready to implement the full service!**

---

## 🎯 Next Steps

Now that you have a basic server running:

1. **Read the full guide:** [README.md](./README.md)
2. **Follow the checklist:** [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
3. **Implement incrementally:** Don't try to do everything at once!

---

## 📚 Implementation Order (Recommended)

### Phase 1: Basic Server (Done! ✅)
You just completed this.

### Phase 2: Add Database (30 minutes)
```bash
# Install Prisma
npm install prisma --save-dev
npx prisma init

# Create schema (see README.md for full schema)
# Edit prisma/schema.prisma

# Generate client
npx prisma generate
```

Add to `src/index.ts`:
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add before app.listen()
prisma.$connect()
  .then(() => console.log('✅ Database connected'))
  .catch((err) => console.error('❌ Database error:', err));
```

### Phase 3: Add Redis (20 minutes)
Create `src/config/redis.ts`:
```typescript
import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err) => console.error('❌ Redis error:', err));

export async function getCachedFeed(key: string) {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheFeed(key: string, data: any, ttl = 300) {
  await redis.setex(key, ttl, JSON.stringify(data));
}
```

Import in `src/index.ts`:
```typescript
import './config/redis'; // This initializes Redis
```

### Phase 4: Implement Feed Logic (1-2 hours)
Now implement:
1. `src/controller/feedController.ts` - Handle HTTP requests
2. `src/services/feedService.ts` - Business logic
3. `src/services/rankingService.ts` - Ranking algorithm
4. `src/routes/feedRoutes.ts` - Route definitions

**See [README.md](./README.md) for complete code examples.**

### Phase 5: Test & Refine (30 minutes)
1. Test with real data
2. Check caching works
3. Verify performance
4. Add error handling

---

## 🧪 Quick Test Commands

```bash
# Health check
curl http://localhost:5005/health

# Get feed (need auth token)
TOKEN="your_jwt_token_here"
curl -H "Authorization: Bearer $TOKEN" \
     -H "x-user-payload: {\"id\":\"user123\",\"username\":\"test\"}" \
     "http://localhost:5005/api/v1/feed?page=1&limit=10"

# Discover feed
curl -H "Authorization: Bearer $TOKEN" \
     -H "x-user-payload: {\"id\":\"user123\",\"username\":\"test\"}" \
     "http://localhost:5005/api/v1/feed/discover"

# Trending feed (no auth)
curl "http://localhost:5005/api/v1/feed/trending"
```

---

## 🐛 Common Issues

### Issue: Port already in use
```bash
# Kill process on port 5005
lsof -ti:5005 | xargs kill -9

# Or use a different port
PORT=5006 npm run dev
```

### Issue: Database connection error
```bash
# Make sure PostgreSQL is running
docker-compose up -d postgres

# Check connection
docker exec -it socialhub_postgres psql -U postgres -c "SELECT 1"
```

### Issue: Redis connection error
```bash
# Start Redis
docker-compose up -d redis

# Test connection
docker exec -it socialhub_redis redis-cli ping
```

### Issue: Prisma client not found
```bash
# Generate Prisma client
npx prisma generate

# Restart dev server
npm run dev
```

---

## 💡 Tips for Success

1. **Start Small**: Get the basic server running first (you did this!)
2. **Test Often**: After each phase, test it works
3. **Read Errors**: Error messages usually tell you what's wrong
4. **Use Console.log**: Debug by logging values
5. **Take Breaks**: If stuck for >30 min, take a break
6. **Ask Questions**: Better to ask than struggle for hours

---

## 📊 Progress Tracker

- [x] Basic server running
- [ ] Database connected
- [ ] Redis connected
- [ ] Routes defined
- [ ] Controller implemented
- [ ] Service layer implemented
- [ ] Ranking algorithm implemented
- [ ] Caching working
- [ ] Tested with real data
- [ ] Production ready!

---

## 🎓 Learning Resources

- **Full Implementation Guide**: [README.md](./README.md) (comprehensive)
- **Architecture Guide**: [/LEARNING_GUIDE.md](../../LEARNING_GUIDE.md) (concepts)
- **Checklist**: [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) (track progress)
- **Overall Learning Path**: [/HOW_TO_LEARN_THIS_PROJECT.md](../../HOW_TO_LEARN_THIS_PROJECT.md)

---

## 🚀 You're Ready!

You now have:
- ✅ A running server
- ✅ Basic understanding of structure
- ✅ Clear next steps

**Go to [README.md](./README.md) and start implementing Phase 4!**

Good luck! 🎉

---

**Remember:** Every expert was once a beginner. You've got this! 💪
