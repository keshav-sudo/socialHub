#!/bin/bash

echo "Testing AI Content Generation..."
echo ""

echo "1. Testing Generate Content endpoint:"
curl -X POST http://localhost:5001/api/v1/ai/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Cloud Computing",
    "tone": "professional"
  }' | jq '.'

echo ""
echo ""
echo "2. Testing Generate Caption endpoint:"
curl -X POST http://localhost:5001/api/v1/ai/generate-caption \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Travel Photography"
  }' | jq '.'
