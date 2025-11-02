# DialCraft - SaaS Billing and Usage Portal

A full-stack billing portal built with **Next.js**, **React**, and **Node.js** that demonstrates enterprise-grade subscription management, usage tracking, and invoice generation capabilities for a cloud communications platform.

## 🎯 Project Overview

This project was created to showcase full-stack development skills for a billing portal role, specifically demonstrating:

- **Full-stack feature development** from database models to UI components
- **REST API design and implementation** for billing operations
- **React UI development** with focus on user experience
- **Billing logic and calculations** for subscription-based services
- **Clean, maintainable code** with TypeScript

## 🏗️ Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + Next.js 15 | Modern UI framework with server-side rendering |
| **Backend** | Node.js (Next.js API Routes) | RESTful API endpoints |
| **UI Components** | Shadcn UI | Accessible, customizable component library |
| **Styling** | Tailwind CSS v3 | Utility-first CSS for rapid UI development |
| **Language** | TypeScript | Type-safe development across the stack |
| **Data Layer** | In-memory (easily swappable to MongoDB/PostgreSQL) | Mock database for demonstration |
| **Design** | Mobile-first responsive | Works seamlessly on all screen sizes |

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │ Subscription │  │   Invoice    │      │
│  │  Component   │  │   Component  │  │  Component   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│           │                 │                 │              │
└───────────┼─────────────────┼─────────────────┼──────────────┘
            │                 │                 │
            ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (Node.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ /api/stats   │  │/api/subscription│ │/api/invoices│      │
│  │ /api/usage   │  └──────────────┘  └──────────────┘      │
│  └──────────────┘                                            │
└───────────┬──────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                      │
│  ┌──────────────┐  ┌──────────────────────────────┐         │
│  │   Database   │  │   Billing Calculations       │         │
│  │   Operations │  │   - Usage fee calculation    │         │
│  │              │  │   - Invoice generation       │         │
│  └──────────────┘  └──────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data Models

### Core Entities

#### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
```

#### Subscription
```typescript
interface Subscription {
  id: string;
  userId: string;
  plan: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due';
  startDate: Date;
  currentPeriodEnd: Date;
  monthlyFee: number;
}
```

#### Usage
```typescript
interface Usage {
  id: string;
  userId: string;
  month: string; // Format: YYYY-MM
  callMinutes: number;
  smsCount: number;
  apiCalls: number;
  recordedAt: Date;
}
```

#### Invoice
```typescript
interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  status: 'paid' | 'pending' | 'overdue';
  amount: number;
  subscriptionFee: number;
  usageFee: number;
  breakdown: {
    callMinutes: number;
    smsCount: number;
    apiCalls: number;
  };
  periodStart: Date;
  periodEnd: Date;
  dueDate: Date;
  paidAt?: Date;
  createdAt: Date;
}
```

## 🔌 API Endpoints

### Usage Tracking

#### `GET /api/usage`
Retrieve usage history for a user.

**Query Parameters:**
- `userId` (optional): User ID (defaults to demo user)
- `limit` (optional): Number of records to return

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "usage-1",
      "userId": "user-1",
      "month": "2024-11",
      "callMinutes": 425,
      "smsCount": 1150,
      "apiCalls": 5900,
      "recordedAt": "2024-11-01T00:00:00.000Z"
    }
  ]
}
```

#### `POST /api/usage`
Record new usage data (simulates external system reporting).

**Request Body:**
```json
{
  "userId": "user-1",
  "month": "2024-12",
  "callMinutes": 500,
  "smsCount": 1200,
  "apiCalls": 6000
}
```

### Subscription Management

#### `GET /api/subscription`
Get subscription details for a user.

**Query Parameters:**
- `userId` (optional): User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "sub-1",
    "userId": "user-1",
    "plan": "pro",
    "status": "active",
    "monthlyFee": 29.99,
    "currentPeriodEnd": "2025-11-30T00:00:00.000Z"
  }
}
```

#### `PATCH /api/subscription`
Update subscription details.

**Request Body:**
```json
{
  "subscriptionId": "sub-1",
  "status": "cancelled"
}
```

### Invoice Management

#### `GET /api/invoices`
Get all invoices for a user.

**Query Parameters:**
- `userId` (optional): User ID

#### `POST /api/invoices`
Generate a new invoice from usage data.

**Request Body:**
```json
{
  "userId": "user-1",
  "month": "2024-11"
}
```

### Dashboard Statistics

#### `GET /api/stats`
Get comprehensive dashboard statistics including subscription status, current usage, and financial totals.

## 💰 Billing Logic

### Pricing Structure

The billing system implements a **hybrid subscription + usage-based model**:

| Item | Rate | Description |
|------|------|-------------|
| **Subscription Fee** | $29.99/month | Base Pro plan fee |
| **Call Minutes** | $0.05/minute | Voice call usage |
| **SMS Messages** | $0.01/message | Text message usage |
| **API Calls** | $0.001/call | API request usage |

### Invoice Calculation

```typescript
// Example calculation for a month with:
// - 425 call minutes
// - 1150 SMS messages
// - 5900 API calls

Subscription Fee:  $29.99
Call Minutes:      425 × $0.05  = $21.25
SMS Messages:      1150 × $0.01 = $11.50
API Calls:         5900 × $0.001 = $5.90
──────────────────────────────────────────
Total Invoice:     $68.64
```

The billing module (`lib/billing.ts`) handles:
- ✅ Usage fee calculation with precise decimal handling
- ✅ Automatic invoice generation from usage data
- ✅ Cost breakdown by service type
- ✅ Billing period management

## 🎨 Frontend Components

Built with **Shadcn UI** for professional, accessible components and **mobile-first responsive design**.

### Mobile-First Design
- 📱 **Hamburger menu** on mobile devices
- 📱 **Collapsible sidebar** slides in from left
- 📱 **Responsive grid layouts** (1 column mobile → 2–4 columns desktop)
- 📱 **Touch-friendly** buttons and interactions
- 📱 **Adaptive typography** (smaller on mobile, larger on desktop)
- 🎯 **Fully responsive** across all screen sizes

### Shadcn UI Components Used
- **Card** - Stats cards, info panels
- **Badge** - Status indicators  
- **Button** - Interactive controls
- **Dialog** - Invoice detail modal
- **Sheet** - Mobile navigation drawer

### DashboardStats
Displays real-time statistics in card format:
- Current month usage metrics (calls, SMS, API)
- Total spending across all paid invoices
- Loading states and error handling
- Responsive grid (1 col mobile → 2 col tablet → 4 col desktop)

### UsageChart
Interactive bar chart visualization showing:
- 6-month usage history
- Separate charts for calls, SMS, and API usage
- Hover tooltips with exact values
- Responsive scaling based on max values
- Horizontal scroll on mobile when needed

### SubscriptionStatus
Comprehensive subscription view with:
- Current plan and status badge
- Billing period information
- Days remaining calculation
- Plan features list
- Usage pricing reference

### InvoiceHistory
Complete invoice management interface:
- List view with status indicators
- Clickable rows for detailed invoice view
- Dialog modal with full invoice breakdown
- Cost itemization by usage type
- Payment status tracking

### Layout (Responsive Navigation)
- **Mobile**: Hamburger menu → Sheet drawer slides in
- **Desktop**: Fixed sidebar with all navigation visible
- Sticky header with responsive padding
- Active state highlighting

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd dialcraft
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
dialcraft/
├── app/
│   ├── api/                    # API Routes (Node.js backend)
│   │   ├── usage/
│   │   │   └── route.ts       # Usage tracking endpoints
│   │   ├── subscription/
│   │   │   └── route.ts       # Subscription management
│   │   ├── invoices/
│   │   │   └── route.ts       # Invoice operations
│   │   └── stats/
│   │       └── route.ts       # Dashboard statistics
│   ├── page.tsx               # Main application page
│   └── layout.tsx             # Root layout
├── components/                 # React UI Components
│   ├── DashboardStats.tsx     # Stats cards
│   ├── UsageChart.tsx         # Usage visualization
│   ├── SubscriptionStatus.tsx # Subscription details
│   ├── InvoiceHistory.tsx     # Invoice list & details
│   └── Layout.tsx             # Application shell
├── lib/                        # Business Logic
│   ├── database.ts            # Data layer & operations
│   └── billing.ts             # Billing calculations
├── types/
│   └── index.ts               # TypeScript type definitions
└── package.json
```

## 🎯 Key Features Demonstrated

### ✅ Full-Stack Development
- **Database modeling** with TypeScript interfaces
- **API endpoint design** following REST principles
- **Frontend-backend integration** with proper error handling

### ✅ Billing Domain Expertise
- **Subscription management** with multiple plan tiers
- **Usage-based billing** calculations
- **Invoice generation** with detailed breakdowns
- **Multiple billing states** (paid, pending, overdue)

### ✅ React Proficiency
- **Client-side data fetching** with useEffect hooks
- **Loading states** and skeleton screens
- **Interactive UI** with modals and tooltips
- **Responsive design** with Tailwind CSS

### ✅ Code Quality
- **TypeScript throughout** for type safety
- **Clean separation of concerns** (UI, API, business logic)
- **Reusable components** with clear interfaces
- **Comprehensive documentation**

## 🔄 Extending to Production

This demo uses an in-memory database for simplicity. To extend to production:

### MongoDB Integration
```typescript
// lib/database.ts
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db('dialcraft');

export const getSubscription = async (userId: string) => {
  return await db.collection('subscriptions').findOne({ userId });
};
```

### PostgreSQL Integration
```typescript
// lib/database.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const getSubscription = async (userId: string) => {
  const result = await pool.query(
    'SELECT * FROM subscriptions WHERE user_id = $1',
    [userId]
  );
  return result.rows[0];
};
```

### Additional Production Considerations
- ✅ Authentication & authorization (JWT, OAuth)
- ✅ Rate limiting for API endpoints
- ✅ Database migrations and seeding
- ✅ Automated testing (Jest, React Testing Library)
- ✅ Payment gateway integration (Stripe, PayPal)
- ✅ Email notifications for invoices
- ✅ PDF invoice generation
- ✅ Webhook support for external systems

## 🧪 Testing the Application

### Manual Testing Scenarios

1. **Dashboard View**
   - Verify all stats cards display correct values
   - Check usage charts render with 6 months of data
   - Confirm subscription status shows current plan

2. **Navigation**
   - Click through all sidebar menu items
   - Verify active state highlighting
   - Check header title updates

3. **Invoice Details**
   - Click any invoice to open modal
   - Verify cost breakdown matches totals
   - Check status badges display correctly

4. **API Testing**
   ```bash
   # Test usage endpoint
   curl http://localhost:3000/api/usage
   
   # Test stats endpoint
   curl http://localhost:3000/api/stats
   
   # Record new usage
   curl -X POST http://localhost:3000/api/usage \
     -H "Content-Type: application/json" \
     -d '{"userId":"user-1","month":"2024-12","callMinutes":300,"smsCount":800,"apiCalls":4000}'
   ```

## 💡 Design Decisions

### Why Next.js?
- ✅ **React + Node.js in one framework** - Perfect for full-stack development
- ✅ **API Routes** - Built-in Node.js backend without separate server
- ✅ **TypeScript support** - First-class type safety
- ✅ **File-based routing** - Intuitive project structure

### Why In-Memory Database?
- ✅ **Zero setup** - No database installation required
- ✅ **Easy to understand** - Clear data structures
- ✅ **Demonstrates architecture** - Shows separation of concerns
- ✅ **Production-ready pattern** - Easy to swap for MongoDB/PostgreSQL

### Why Component-Based Architecture?
- ✅ **Reusability** - Components can be composed
- ✅ **Maintainability** - Easy to locate and update features
- ✅ **Testability** - Each component can be tested independently
- ✅ **Scalability** - Easy to add new features

## 📈 Future Enhancements

- [ ] User authentication system
- [ ] Multi-currency support
- [ ] Advanced analytics dashboard
- [ ] Export invoices to PDF
- [ ] Payment processing integration
- [ ] Email notifications
- [ ] Usage alerts and thresholds
- [ ] API rate limiting visualization
- [ ] Dark mode support
- [ ] Mobile responsive optimizations

## 👨‍💻 Author

Created as a portfolio project to demonstrate full-stack billing portal development skills for a Node.js + React position focused on billing infrastructure.

## 📄 License

MIT License - feel free to use this as reference or starting point for your own projects.

---

**Built with ❤️ using Next.js, React, TypeScript, and Tailwind CSS**
