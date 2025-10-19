#!/bin/bash

# SocialHub Setup Verification Script
# This script verifies that all services are running properly

echo "🔍 SocialHub Setup Verification"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
PASSED=0
FAILED=0

# Function to check service
check_service() {
    local name=$1
    local url=$2
    local expected=$3
    
    echo -n "Checking $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" == "$expected" ] || [ "$response" == "200" ]; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $response)"
        ((FAILED++))
        return 1
    fi
}

# Function to check Docker container
check_container() {
    local name=$1
    
    echo -n "Checking container $name... "
    
    if docker compose ps | grep -q "$name.*Up"; then
        echo -e "${GREEN}✓ RUNNING${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ NOT RUNNING${NC}"
        ((FAILED++))
        return 1
    fi
}

# 1. Check Docker Compose
echo "📦 Docker Infrastructure"
echo "------------------------"

check_container "redis"
check_container "kafka"

echo ""

# 2. Check Redis connectivity
echo "💾 Redis Connectivity"
echo "---------------------"

echo -n "Redis PING... "
if docker compose exec -T redis redis-cli ping 2>/dev/null | grep -q "PONG"; then
    echo -e "${GREEN}✓ PONG${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

echo ""

# 3. Check Kafka
echo "📨 Kafka Status"
echo "---------------"

echo -n "Kafka broker... "
if docker compose logs kafka 2>/dev/null | grep -q "started"; then
    echo -e "${GREEN}✓ STARTED${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ CHECK LOGS${NC}"
    ((FAILED++))
fi

echo ""

# 4. Check Microservices
echo "🚀 Microservices"
echo "----------------"

check_container "auth-service"
check_container "users-service"
check_container "post-service"
check_container "notification-service"
check_container "chat-service"
check_container "feed-service"
check_container "gateway"

echo ""

# 5. Check Service HTTP Endpoints
echo "🌐 HTTP Endpoints"
echo "-----------------"

check_service "Auth Service" "http://localhost:5000/" "200"
check_service "Users Service" "http://localhost:5003/" "200"
check_service "Post Service" "http://localhost:5001/" "200"
check_service "Notification Service" "http://localhost:5002/" "200"
check_service "Chat Service" "http://localhost:5004/health" "200"
check_service "Feed Service" "http://localhost:5005/" "200"
check_service "Gateway" "http://localhost:8080/" "404"

echo ""

# 6. Test Authentication Flow
echo "🔐 Authentication Test"
echo "----------------------"

echo -n "Testing signup endpoint... "
signup_response=$(curl -s -X POST http://localhost:8080/auth/signup \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Test User",
        "email": "test-'$(date +%s)'@example.com",
        "username": "testuser'$(date +%s)'",
        "password": "Password123!"
    }' 2>/dev/null)

if echo "$signup_response" | grep -q "token"; then
    echo -e "${GREEN}✓ WORKING${NC}"
    ((PASSED++))
    
    # Extract token for further tests
    TOKEN=$(echo "$signup_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    # Test protected endpoint
    echo -n "Testing protected endpoint... "
    protected_response=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer $TOKEN" \
        http://localhost:8080/notify/notifications 2>/dev/null)
    
    if [ "$protected_response" == "200" ]; then
        echo -e "${GREEN}✓ JWT AUTH WORKING${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ JWT AUTH FAILED${NC}"
        ((FAILED++))
    fi
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $signup_response"
    ((FAILED++))
fi

echo ""

# Summary
echo "================================"
echo "📊 Summary"
echo "================================"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Your SocialHub is ready to use.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Read CODE_FLOW.md to understand how everything works"
    echo "2. Read API_TESTING.md to test all endpoints"
    echo "3. Check service logs: docker compose logs -f SERVICE_NAME"
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Please review the errors above.${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check logs: docker compose logs SERVICE_NAME"
    echo "2. Restart services: docker compose restart"
    echo "3. Rebuild if needed: docker compose up -d --build"
    echo "4. Check .env files in each service directory"
    exit 1
fi
