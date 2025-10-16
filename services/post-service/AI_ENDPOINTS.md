# AI Content and Caption Generation Endpoints

## Overview
The post-service now includes AI-powered content and caption generation using Google's Gemini model through LangChain.

## Setup

### Prerequisites
1. Google API Key for Gemini AI
2. LangChain dependencies installed

### Environment Variables
Add the following to your `.env` file:
```
GOOGLE_API_KEY=your_google_api_key_here
```

## API Endpoints

### 1. Generate Content
**POST** `/api/v1/ai/generate-content`

Generates detailed, engaging post content based on topic and tone.

#### Request Body
```json
{
  "topic": "AI in Healthcare",
  "tone": "professional"
}
```

#### Response
```json
{
  "topic": "AI in Healthcare",
  "tone": "professional",
  "content": "Generated content text..."
}
```

#### Example using cURL
```bash
curl -X POST http://localhost:5001/api/v1/ai/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "AI in Healthcare",
    "tone": "professional"
  }'
```

### 2. Generate Caption
**POST** `/api/v1/ai/generate-caption`

Generates a concise caption with 3 relevant hashtags.

#### Request Body
```json
{
  "topic": "Summer vacation"
}
```

#### Response
```json
{
  "topic": "Summer vacation",
  "caption": "Generated caption with #hashtag1 #hashtag2 #hashtag3"
}
```

#### Example using cURL
```bash
curl -X POST http://localhost:5001/api/v1/ai/generate-caption \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Summer vacation"
  }'
```

## Integration with Post Schema

The Post model in Prisma schema includes fields for AI-generated content:
- `aicaption`: Stores AI-generated captions
- `aiContent`: Stores AI-generated content

## Error Responses

### 400 Bad Request
```json
{
  "message": "Error: Topic, platform, and tone are required."
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error: Failed to generate content."
}
```

## Notes
- The AI model used is `gemini-1.5-flash`
- Temperature is set to 0.7 for creative yet consistent outputs
- Content generation provides detailed post body
- Caption generation includes exactly 3 hashtags
