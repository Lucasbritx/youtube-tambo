# AI-Powered Video Search - Quick Reference

## Introduction

You have:
- ✅ **Custom search queries** - Ask for anything
- ✅ **AI-powered rating** - Videos scored for relevance
- ✅ **Smart filtering** - Best results automatically selected
- ✅ **YouTube API search** - Real-time results

---

## How to Use

### Just ask naturally!

```
"Give me videos about how to pass in Amazon SWE job interviews"
→ Specific Amazon interview prep videos, AI-rated for relevance
```

---

## Example Queries

### 🎯 Job Interview Preparation
```
"Give me videos about how to pass in Amazon SWE job interviews"
"How to prepare for Google technical interviews"
"Meta software engineer interview tips"
"System design interview preparation"
```

### 📚 Learning & Tutorials
```
"Show me React Server Components tutorials"
"TypeScript for beginners step by step"
"Learn Next.js 15 new features"
"Docker and Kubernetes crash course"
```

### 🔍 Specific Technologies
```
"Tailwind CSS v4 new features"
"PostgreSQL performance optimization"
"AWS Lambda best practices 2026"
"GraphQL vs REST API detailed comparison"
```

### 🐛 Problem Solving
```
"How to fix memory leaks in React applications"
"Debug Node.js performance issues"
"Resolve Git merge conflicts"
"Fix TypeScript type errors"
```

---

## What Happens Behind the Scenes

```
1. You ask: "Give me videos about Amazon SWE interviews"

2. AI processes your query
   → Understands you want: Amazon, Software Engineering, Interview prep

3. Searches YouTube API
   → Query: "Amazon software engineer job interview preparation"
   → Fetches 24 videos (3x limit for better selection)

4. AI rates each video (0-100 score)
   ✓ Title relevance: "Amazon SWE Interview Guide" = HIGH
   ✓ Description match: Contains keywords = GOOD
   ✓ Engagement: 1.2M views, 50K likes = EXCELLENT
   ✓ Recency: 2 months old = FRESH
   → Final score: 95.2/100

5. Sorts by AI score
   → Top 8 most relevant videos selected

6. Updates your video grid
   → You see the best results!

7. Chat confirms
   → "Found 8 videos, AI-rated for relevance"
```

---

## AI Rating Breakdown

Each video scored on **5 factors**:

| Factor | Weight | Example |
|--------|--------|---------|
| **Title Match** | 50% | Query words in title |
| **Description Match** | 20% | Query words in description |
| **View Count** | 15% | Popularity indicator |
| **Like Ratio** | 10% | Quality indicator |
| **Recency** | 5% | Newer = better |

### Example Scoring

**Video**: "Complete Amazon SWE Interview Guide 2026"
- Title: 45/50 ⭐⭐⭐⭐⭐ (excellent match)
- Description: 18/20 ⭐⭐⭐⭐ (good match)
- Views: 10/15 ⭐⭐⭐ (1.5M views)
- Likes: 8/10 ⭐⭐⭐⭐ (good engagement)
- Recency: 4/5 ⭐⭐⭐⭐ (recent)
- **Total: 85/100** 🏆

---

## Chat Response Example

```
Found 8 videos matching "Amazon SWE job interview tips". 
Videos have been AI-rated for relevance. 
The video list has been updated in the main content area.

Top 3 most relevant videos:
• "Amazon Software Engineer Interview - Complete Guide 2026" 
  by Tech Interview Pro - 1.2M views (Relevance: 95.2)
  
• "How I Passed the Amazon SWE Interview (All Rounds)" 
  by CS Dojo - 890K views (Relevance: 89.7)
  
• "Cracking Amazon System Design Interviews" 
  by ByteByteGo - 1.5M views (Relevance: 87.3)
```

---

## Key Features

### 🎯 Smart Search
- Understands your intent
- Finds exactly what you need
- Filters out irrelevant content

### 🤖 AI Rating
- Scores each video (0-100)
- Multiple quality factors
- Best results rise to the top

### ⚡ Real-time Updates
- Main video grid updates automatically
- No manual refresh needed
- Instant results

### 💬 Clean Chat
- Text summaries only
- Top 3 video previews
- Relevance scores shown

---

## Quick Test

1. **Start app**: `npm run dev`
2. **Open**: http://localhost:3000
3. **Try**: "Give me videos about how to pass in Amazon SWE job interviews"
4. **Watch**: Video grid updates with AI-rated results!

---

## Troubleshooting

**Q: Videos don't match my query?**
→ Try being more specific: "React hooks tutorial for beginners" instead of "React videos"

**Q: Results seem random?**
→ AI rating is enabled by default. It balances relevance with popularity.

**Q: Want YouTube's default ranking?**
→ Not supported yet, but AI rating should give better results!

**Q: Chat shows error?**
→ Check YouTube API key in .env.local and check console for errors

---

## Technical Details

**Tool**: `searchVideos`
**Input**: 
- `query` (string, required) - Your search query
- `limit` (number, optional, default: 8) - How many videos
- `sortBy` (string, optional, default: "relevance") - Sort order
- `aiRating` (boolean, optional, default: true) - Use AI rating

**Output**:
- Success message
- Video count
- Top 3 videos with relevance scores
- Updates main video grid

---

**Ready to try!** 🚀

Ask Tambo to find videos about any topic:
- Job interviews
- Technical tutorials  
- Programming concepts
- Career advice
- Technology comparisons
- And anything else!

The AI will find and rate the best videos for you automatically.
