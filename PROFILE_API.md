# Profile API Documentation

## Overview

The Profile API provides endpoints to access user profile information, including campaigns created by the user and contributions made to campaigns.

## Authentication

All Profile endpoints require the `address` query parameter containing the user's wallet address.

---

## Endpoints

### 1. Get User Profile

**GET** `/profile/me?address={wallet_address}`

Get profile statistics for the authenticated user.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | Yes | User wallet address |

#### Response

```json
{
  "is_success": true,
  "data": {
    "address": "0x1234567890abcdef1234567890abcdef12345678",
    "totalCampaignsCreated": 5,
    "totalContributions": 12,
    "totalContributionAmount": 1500
  }
}
```

#### Example

```bash
curl -X GET "http://localhost:3000/profile/me?address=0x1234567890abcdef1234567890abcdef12345678"
```

---

### 2. Get Created Campaigns

**GET** `/profile/me/created-campaigns?address={wallet_address}`

Get all campaigns created by the user with full details including images, contributions, and milestones.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | Yes | Creator wallet address |

#### Response

```json
{
  "is_success": true,
  "data": [
    {
      "blob_id": "campaign-123",
      "campaign_name": "Build a DeFi Platform",
      "creator_address": "0x1234567890abcdef1234567890abcdef12345678",
      "goal": 10000,
      "current_amount": 7500,
      "currency": "SUI",
      "start_at": "2025-11-10T00:00:00.000Z",
      "end_at": "2025-12-31T23:59:59.000Z",
      "is_completed": false,
      "category": "technology",
      "images": [
        {
          "campaign_id": "campaign-123",
          "img_id": "img-456",
          "type": "banner"
        }
      ],
      "contributions": [
        {
          "wallet_address": "0xabcdef...",
          "amount": 100,
          "created_at": "2025-11-15T00:00:00.000Z"
        }
      ],
      "milestones": [
        {
          "milestone_id": "m1",
          "title": "Phase 1",
          "status": "pending",
          "amount": 5000
        }
      ]
    }
  ]
}
```

#### Example

```bash
curl -X GET "http://localhost:3000/profile/me/created-campaigns?address=0x1234567890abcdef1234567890abcdef12345678"
```

---

### 3. Get User Contributions

**GET** `/profile/me/contributions?address={wallet_address}`

Get all contributions made by the user, including campaign details for each contribution.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | Yes | Contributor wallet address |

#### Response

```json
{
  "is_success": true,
  "data": [
    {
      "campaign_id": "campaign-123",
      "wallet_address": "0x1234567890abcdef1234567890abcdef12345678",
      "amount": 100,
      "currency": "SUI",
      "tier_type": "gold",
      "tx_hash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      "created_at": "2025-11-10T00:00:00.000Z",
      "campaign": {
        "blob_id": "campaign-123",
        "campaign_name": "Build a DeFi Platform",
        "goal": 10000,
        "current_amount": 7500,
        "creator_address": "0xdeadbeef...",
        "end_at": "2025-12-31T23:59:59.000Z",
        "category": "technology"
      }
    }
  ]
}
```

#### Example

```bash
curl -X GET "http://localhost:3000/profile/me/contributions?address=0x1234567890abcdef1234567890abcdef12345678"
```

---

## Error Responses

### 400 Bad Request

Missing required query parameter:

```json
{
  "statusCode": 400,
  "message": "address query parameter is required"
}
```

---

## Integration Notes

### Task 2.1: fundingDeadline Field

The `end_at` field in campaign schema serves as the funding deadline. It is calculated as:

```typescript
end_at = created_at + (duration * 24 * 60 * 60 * 1000)
```

### Task 2.2: Contribution Schema

The contribution schema includes all required fields:

- `id`: Auto-generated
- `userId`: Stored as `wallet_address`
- `eventId`: Stored as `campaign_id` (links to Campaign)
- `amount`: Contribution amount
- `txHash`: Transaction hash from blockchain

### Task 2.3: Profile Endpoints

All three profile endpoints have been implemented:

1. ✅ `GET /profile/me` - User profile statistics
2. ✅ `GET /profile/me/created-campaigns` - Campaigns created by user
3. ✅ `GET /profile/me/contributions` - Contributions with populated campaign data

### Task 2.4: Create Contribution Endpoint

The contribution creation endpoint already exists:

**POST** `/create-contribution`

See the main API documentation for details.

---

## Testing

### Test User Profile

```bash
# Get profile statistics
curl -X GET "http://localhost:3000/profile/me?address=0x1234567890abcdef1234567890abcdef12345678"
```

### Test Created Campaigns

```bash
# Get all campaigns created by user
curl -X GET "http://localhost:3000/profile/me/created-campaigns?address=0x1234567890abcdef1234567890abcdef12345678"
```

### Test User Contributions

```bash
# Get all contributions made by user
curl -X GET "http://localhost:3000/profile/me/contributions?address=0x1234567890abcdef1234567890abcdef12345678"
```

---

## Swagger Documentation

All Profile endpoints are documented in Swagger UI at:

```
http://localhost:3000/api/docs
```

Look for the **Profile** tag to see interactive documentation and test the endpoints.

