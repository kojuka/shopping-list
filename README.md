# 🎁 Shopping List

A collaborative gift shopping list app for tracking holiday purchases, budgets, and gift ideas. Built for families to plan and manage gift-giving together in real-time.

## Features

- **Google Sign-In** - Secure authentication with email allowlist
- **Real-time Sync** - Changes sync instantly across all devices
- **Gift Workflow** - Track gifts through stages: Idea → Planned → Bought → Shipped → Wrapped
- **Budget Tracking** - See committed vs. spent amounts with visual progress bars
- **Per-Recipient Lists** - Organize gifts by recipient with individual budgets
- **Mobile-Friendly** - Responsive design that works great on phones

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: [Convex](https://convex.dev) (real-time database & serverless functions)
- **Auth**: Convex Auth with Google OAuth
- **Hosting**: Vercel (frontend) + Convex Cloud (backend)

## Gift Status Workflow

| Status | Budget Impact | Description |
|--------|---------------|-------------|
| 💭 Idea | None | Brainstorming, not committed |
| 📋 Planned | Committed | Decided to buy, counts toward budget |
| 💰 Bought | Spent | Actually purchased |
| 📦 Shipped | Spent | In transit |
| 🎁 Wrapped | Spent | Ready to give |
| ⏳ Delayed | - | Backordered or issues |

## Development

### Prerequisites

- Node.js 18+
- A [Convex](https://convex.dev) account
- Google OAuth credentials (from [Google Cloud Console](https://console.cloud.google.com/apis/credentials))

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start Convex dev server**
   ```bash
   npx convex dev
   ```

3. **Start Vite dev server** (in another terminal)
   ```bash
   npm run dev
   ```

4. **Set up environment variables** in Convex:
   ```bash
   npx convex env set AUTH_GOOGLE_ID "your-google-client-id"
   npx convex env set AUTH_GOOGLE_SECRET "your-google-client-secret"
   npx convex env set SITE_URL "http://localhost:5173"
   npx convex env set JWT_PRIVATE_KEY "your-rsa-private-key"
   npx convex env set JWKS '{"keys":[...]}'
   npx convex env set ALLOWED_EMAILS "email1@gmail.com,email2@gmail.com"
   ```

### Deployment

1. **Deploy Convex backend**
   ```bash
   npx convex deploy
   ```

2. **Set production environment variables**
   ```bash
   npx convex env set --prod AUTH_GOOGLE_ID "..."
   npx convex env set --prod AUTH_GOOGLE_SECRET "..."
   npx convex env set --prod SITE_URL "https://your-app.vercel.app"
   npx convex env set --prod JWT_PRIVATE_KEY "..."
   npx convex env set --prod JWKS "..."
   npx convex env set --prod ALLOWED_EMAILS "..."
   ```

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

4. **Add production redirect URI** to Google OAuth:
   ```
   https://your-convex-deployment.convex.site/api/auth/callback/google
   ```

## Project Structure

```
├── convex/           # Convex backend
│   ├── auth.ts       # Authentication config
│   ├── items.ts      # Gift items queries/mutations
│   ├── recipients.ts # Recipients queries/mutations
│   ├── schema.ts     # Database schema
│   └── users.ts      # User queries
├── src/
│   ├── components/   # React components
│   │   ├── BudgetCard.tsx
│   │   ├── Dashboard.tsx
│   │   ├── GiftList.tsx
│   │   ├── Header.tsx
│   │   ├── RecipientList.tsx
│   │   ├── SignIn.tsx
│   │   └── StatusDropdown.tsx
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

## License

Private - for personal use only.
