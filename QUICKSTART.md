# Quick Start Guide

Get the DialCraft Billing Portal running in under 2 minutes!

## Prerequisites

- **Node.js** 20.0 or higher
- **npm** 9.0 or higher (comes with Node.js)

Check your versions:
```bash
node --version  # Should be v20.0.0 or higher
npm --version   # Should be 9.0.0 or higher
```

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd /Users/mcknx/develop/2025/dialcraft
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js 15.5.0
- React 19.1.0
- TypeScript 5.x
- Tailwind CSS 4.x

### 3. Start Development Server

```bash
npm run dev
```

You should see output like:
```
▲ Next.js 15.5.0
- Local:        http://localhost:3000
- ready in 1.2s
```

### 4. Open in Browser

Navigate to:
```
http://localhost:3000
```

🎉 **You're done!** The billing portal should be running with demo data.

---

## What You'll See

### Dashboard View
- **4 stat cards** showing current month usage and total spending
- **Usage charts** displaying 6 months of historical data
- **Subscription status** with plan details
- **Recent invoices** list

### Navigation
Click the sidebar buttons to explore:
- 🏠 **Dashboard** - Overview and statistics
- ✅ **Subscription** - Plan details and pricing
- 📊 **Usage Analytics** - Visual charts of usage over time
- 📄 **Invoices** - Complete invoice history with details

### Interactive Features
- **Hover over chart bars** to see exact values
- **Click any invoice** to view detailed breakdown
- **All data updates in real-time** from the API

---

## Testing the API

### Using cURL

Open a new terminal and try these commands:

```bash
# Get dashboard statistics
curl http://localhost:3000/api/stats

# Get usage history
curl http://localhost:3000/api/usage

# Get subscription details
curl http://localhost:3000/api/subscription

# Get all invoices
curl http://localhost:3000/api/invoices
```

### Using Your Browser

Open these URLs directly:
- http://localhost:3000/api/stats
- http://localhost:3000/api/usage
- http://localhost:3000/api/subscription
- http://localhost:3000/api/invoices

### Recording New Usage

```bash
curl -X POST http://localhost:3000/api/usage \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-1",
    "month": "2024-12",
    "callMinutes": 600,
    "smsCount": 1400,
    "apiCalls": 7200
  }'
```

After recording, refresh the dashboard to see updated statistics!

---

## Build for Production

When you're ready to deploy:

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

The production build will:
- Optimize and minify all code
- Generate static pages where possible
- Enable performance optimizations
- Remove development-only code

---

## Troubleshooting

### Port 3000 Already in Use

If you see an error about port 3000:

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Dependencies Installation Fails

Try clearing npm cache:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Module Not Found Errors

Make sure you're in the correct directory:

```bash
pwd  # Should show: /Users/mcknx/develop/2025/dialcraft
```

If not, navigate to the correct directory and run `npm install` again.

### TypeScript Errors

If you see TypeScript compilation errors:

```bash
# Clean build cache
rm -rf .next
npm run dev
```

---

## Project Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm start` | Start production server (requires build first) |
| `npm run lint` | Run ESLint to check code quality |

---

## Demo Data

The application comes pre-loaded with demo data:

### Demo User
- **Email:** demo@example.com
- **Name:** Demo User
- **ID:** user-1

### Subscription
- **Plan:** Pro ($29.99/month)
- **Status:** Active
- **Period:** Through November 30, 2025

### Usage History
6 months of usage data (June - November 2024):
- Call minutes ranging from 380-610 per month
- SMS messages ranging from 980-1450 per month
- API calls ranging from 4,800-7,100 per month

### Invoices
4 invoices with various statuses:
- 3 paid invoices (August, September, October)
- 1 pending invoice (November)

---

## Next Steps

### Explore the Code

Key files to review:

1. **Data Models**
   - `types/index.ts` - TypeScript interfaces

2. **Backend Logic**
   - `lib/database.ts` - Data operations
   - `lib/billing.ts` - Billing calculations
   - `app/api/*/route.ts` - API endpoints

3. **Frontend Components**
   - `components/DashboardStats.tsx` - Statistics cards
   - `components/UsageChart.tsx` - Usage visualization
   - `components/SubscriptionStatus.tsx` - Subscription view
   - `components/InvoiceHistory.tsx` - Invoice management
   - `components/Layout.tsx` - Application shell

4. **Main Page**
   - `app/page.tsx` - Main application logic

### Read the Documentation

- **README.md** - Complete project overview and architecture
- **API_DOCUMENTATION.md** - Detailed API reference
- **This file** - Quick start guide

### Customize the Data

Edit `lib/database.ts` to modify:
- Demo user information
- Subscription plans and pricing
- Usage history
- Invoice data

### Add Features

Some ideas to extend the project:
- Add user authentication
- Implement payment processing
- Create PDF invoice exports
- Add email notifications
- Build a mobile responsive layout
- Add dark mode

---

## Development Tips

### Hot Reload
The development server automatically reloads when you save files. No need to restart!

### React DevTools
Install the React Developer Tools browser extension for better debugging:
- [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### TypeScript IntelliSense
Use VS Code for the best TypeScript development experience with automatic type checking and autocomplete.

### Tailwind CSS Classes
Refer to [Tailwind CSS documentation](https://tailwindcss.com/docs) for available utility classes.

---

## Getting Help

### Resources
- **Next.js Documentation:** https://nextjs.org/docs
- **React Documentation:** https://react.dev
- **TypeScript Documentation:** https://www.typescriptlang.org/docs
- **Tailwind CSS Documentation:** https://tailwindcss.com/docs

### Common Issues
Check the troubleshooting section above or review the README.md for more detailed information.

---

**Happy coding! 🚀**

If you encounter any issues not covered here, please check the main README.md or the API documentation for more details.

