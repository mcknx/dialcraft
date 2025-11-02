# API Documentation

## Overview

DialCraft provides a RESTful API for managing billing, subscriptions, usage tracking, and invoices. All endpoints return JSON responses following a consistent format.

## Base URL

```
http://localhost:3000/api
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message description"
}
```

---

## Endpoints

## 1. Usage API

### GET /api/usage

Retrieve usage history for a user.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| userId | string | No | "user-1" | User identifier |
| limit | number | No | All | Maximum number of records to return |

**Example Request:**
```bash
curl http://localhost:3000/api/usage?userId=user-1&limit=6
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "usage-6",
      "userId": "user-1",
      "month": "2024-11",
      "callMinutes": 425,
      "smsCount": 1150,
      "apiCalls": 5900,
      "recordedAt": "2024-11-01T00:00:00.000Z"
    },
    {
      "id": "usage-5",
      "userId": "user-1",
      "month": "2024-10",
      "callMinutes": 495,
      "smsCount": 1280,
      "apiCalls": 6300,
      "recordedAt": "2024-10-31T00:00:00.000Z"
    }
  ]
}
```

---

### POST /api/usage

Record new usage data. This endpoint simulates an external system (like a telephony platform) reporting usage metrics.

**Request Body:**
```json
{
  "userId": "user-1",
  "month": "2024-12",
  "callMinutes": 350,
  "smsCount": 900,
  "apiCalls": 5000
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/usage \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-1",
    "month": "2024-12",
    "callMinutes": 350,
    "smsCount": 900,
    "apiCalls": 5000
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "usage-1733020800000-abc123xyz",
    "userId": "user-1",
    "month": "2024-12",
    "callMinutes": 350,
    "smsCount": 900,
    "apiCalls": 5000,
    "recordedAt": "2024-12-01T00:00:00.000Z"
  },
  "message": "Usage recorded successfully"
}
```

**Status Codes:**
- `201` - Successfully created
- `400` - Bad request (missing required fields)
- `500` - Server error

---

## 2. Subscription API

### GET /api/subscription

Retrieve subscription details for a user.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| userId | string | No | "user-1" | User identifier |

**Example Request:**
```bash
curl http://localhost:3000/api/subscription?userId=user-1
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "sub-1",
    "userId": "user-1",
    "plan": "pro",
    "status": "active",
    "startDate": "2024-01-01T00:00:00.000Z",
    "currentPeriodEnd": "2025-11-30T00:00:00.000Z",
    "monthlyFee": 29.99
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Subscription not found
- `500` - Server error

---

### PATCH /api/subscription

Update subscription details (change plan or status).

**Request Body:**
```json
{
  "subscriptionId": "sub-1",
  "status": "cancelled",
  "plan": "basic"
}
```

**Example Request:**
```bash
curl -X PATCH http://localhost:3000/api/subscription \
  -H "Content-Type: application/json" \
  -d '{
    "subscriptionId": "sub-1",
    "status": "cancelled"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "sub-1",
    "userId": "user-1",
    "plan": "pro",
    "status": "cancelled",
    "startDate": "2024-01-01T00:00:00.000Z",
    "currentPeriodEnd": "2025-11-30T00:00:00.000Z",
    "monthlyFee": 29.99
  },
  "message": "Subscription updated successfully"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad request (missing subscriptionId)
- `404` - Subscription not found
- `500` - Server error

---

## 3. Invoices API

### GET /api/invoices

Retrieve all invoices for a user, sorted by creation date (newest first).

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| userId | string | No | "user-1" | User identifier |

**Example Request:**
```bash
curl http://localhost:3000/api/invoices?userId=user-1
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "inv-4",
      "userId": "user-1",
      "invoiceNumber": "INV-2024-11-001",
      "status": "pending",
      "amount": 59.74,
      "subscriptionFee": 29.99,
      "usageFee": 29.75,
      "breakdown": {
        "callMinutes": 425,
        "smsCount": 1150,
        "apiCalls": 5900
      },
      "periodStart": "2024-11-01T00:00:00.000Z",
      "periodEnd": "2024-11-30T00:00:00.000Z",
      "dueDate": "2024-12-07T00:00:00.000Z",
      "createdAt": "2024-12-01T00:00:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### POST /api/invoices

Generate a new invoice from existing usage data for a specific month.

**Request Body:**
```json
{
  "userId": "user-1",
  "month": "2024-11"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-1",
    "month": "2024-11"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "inv-1733020800000-xyz789abc",
    "userId": "user-1",
    "invoiceNumber": "INV-2024-11-A1B2C3",
    "status": "pending",
    "amount": 59.74,
    "subscriptionFee": 29.99,
    "usageFee": 29.75,
    "breakdown": {
      "callMinutes": 425,
      "smsCount": 1150,
      "apiCalls": 5900
    },
    "periodStart": "2024-11-01T00:00:00.000Z",
    "periodEnd": "2024-11-30T00:00:00.000Z",
    "dueDate": "2024-12-07T00:00:00.000Z",
    "createdAt": "2024-12-01T00:00:00.000Z"
  },
  "message": "Invoice generated successfully"
}
```

**Status Codes:**
- `201` - Successfully created
- `400` - Bad request (missing required fields)
- `404` - No usage data or subscription found
- `500` - Server error

---

## 4. Stats API

### GET /api/stats

Get comprehensive dashboard statistics including subscription status, current usage, invoice totals, and recent activity.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| userId | string | No | "user-1" | User identifier |

**Example Request:**
```bash
curl http://localhost:3000/api/stats?userId=user-1
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "plan": "pro",
      "status": "active",
      "monthlyFee": 29.99,
      "currentPeriodEnd": "2025-11-30T00:00:00.000Z"
    },
    "currentUsage": {
      "callMinutes": 425,
      "smsCount": 1150,
      "apiCalls": 5900,
      "month": "2024-11"
    },
    "totals": {
      "totalSpent": 199.17,
      "pendingAmount": 59.74,
      "invoiceCount": 4,
      "callMinutes": 2785,
      "smsCount": 7410,
      "apiCalls": 36000
    },
    "recentInvoices": [
      {
        "id": "inv-4",
        "invoiceNumber": "INV-2024-11-001",
        "status": "pending",
        "amount": 59.74,
        "dueDate": "2024-12-07T00:00:00.000Z"
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

## Pricing Reference

All usage-based calculations use the following rates:

| Metric | Rate | Unit |
|--------|------|------|
| Call Minutes | $0.05 | per minute |
| SMS Messages | $0.01 | per message |
| API Calls | $0.001 | per call |

**Monthly Subscription Fee:**
- Basic: $9.99/month
- Pro: $29.99/month
- Enterprise: $99.99/month

---

## Usage Examples

### Complete Workflow Example

```bash
# 1. Check current subscription
curl http://localhost:3000/api/subscription

# 2. Record usage for current month
curl -X POST http://localhost:3000/api/usage \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-1",
    "month": "2024-12",
    "callMinutes": 500,
    "smsCount": 1200,
    "apiCalls": 6500
  }'

# 3. View usage history
curl http://localhost:3000/api/usage?limit=3

# 4. Generate invoice for the month
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-1",
    "month": "2024-12"
  }'

# 5. Check all invoices
curl http://localhost:3000/api/invoices

# 6. Get dashboard stats
curl http://localhost:3000/api/stats
```

---

## Error Handling

All endpoints follow consistent error handling:

### Common Error Codes

| Status Code | Meaning | Example |
|-------------|---------|---------|
| 400 | Bad Request | Missing required parameters |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side error |

### Example Error Response

```json
{
  "success": false,
  "error": "userId and month are required"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented in this demo. In production, consider:

- 100 requests per minute per user
- 1000 requests per hour per user
- Use Redis for distributed rate limiting

---

## Authentication

This demo does not implement authentication. In production, add:

- JWT tokens in Authorization header
- OAuth 2.0 for third-party integrations
- API keys for server-to-server communication

Example with JWT:
```bash
curl http://localhost:3000/api/stats \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Testing with Postman

Import this collection to test all endpoints:

1. Create a new collection in Postman
2. Add requests for each endpoint documented above
3. Set base URL as variable: `{{baseUrl}} = http://localhost:3000/api`
4. Test the complete workflow

---

## Webhooks (Future Enhancement)

Potential webhook events for external system integration:

- `usage.recorded` - New usage data recorded
- `invoice.generated` - New invoice created
- `invoice.paid` - Invoice payment confirmed
- `subscription.updated` - Subscription changed

---

**Last Updated:** 2024-10-31

