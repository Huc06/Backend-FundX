# FundX Backend API Endpoints

## Base URL
```
http://localhost:3000
```

## Endpoints

### 🏠 Root
- **GET** `/` - Welcome message

### ❤️ Health Check

#### Basic Health Check
- **GET** `/health`
- **Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-09T06:45:18.888Z",
  "uptime": 2.958539459,
  "environment": "development",
  "version": "1.0.0"
}
```

#### Detailed Health Check
- **GET** `/health/detailed`
- **Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-09T06:45:19.374Z",
  "uptime": 3.444321459,
  "environment": "development",
  "version": "1.0.0",
  "memory": {
    "used": 25.32,
    "total": 51.84,
    "unit": "MB"
  },
  "cpu": {
    "user": 366829,
    "system": 110151
  }
}
```

### 📢 Campaigns

#### Create Campaign
- **POST** `/create-campaign`
- **Body:**
```json
{
  "blobId": "string",
  "creatorAddress": "string",
  "creatorName": "string (optional)",
  "targetAmount": 1000,
  "duration": 30,
  "rewardType": "string",
  "currency": "USD",
  "description": "string (optional)",
  "title": "string",
  "txHash": "string",
  "objectId": "string",
  "category": "string"
}
```

#### Get Campaigns
- **GET** `/campaigns?limit=10&offset=0`
- **Query Params:**
  - `limit` (optional, default: 10)
  - `offset` (optional, default: 0)

#### Get Campaigns by Creator
- **GET** `/campaigns/creator?creator=0x123...`
- **Query Params:**
  - `creator` (required) - Creator wallet address

#### Get Voting Campaigns
- **GET** `/voting-campaigns?limit=10&offset=0`
- **Query Params:**
  - `limit` (optional, default: 10)
  - `offset` (optional, default: 0)

#### Get Campaign by ID
- **GET** `/campaign?id=obj123`
- **Query Params:**
  - `id` (required) - Campaign object_id

### 🖼️ Images

#### Upload Image
- **POST** `/upload-image`
- **Body:**
```json
{
  "campaignId": "string",
  "imgId": "string",
  "type": "string"
}
```

### 🎯 Milestones

#### Create Milestone
- **POST** `/upload-milestone`
- **Body:**
```json
{
  "campaignId": "string",
  "objectId": "string",
  "milestoneId": "string",
  "title": "string",
  "status": "string (optional)",
  "description": "string (optional)",
  "deliverables": ["string"],
  "amount": 500,
  "currency": "USD",
  "votingDurationDays": 7,
  "timelineStart": "string (optional)",
  "timelineEnd": "string (optional)",
  "informationId": "string (optional)"
}
```

#### Update Vote Result
- **PUT** `/campaigns/:object_id/milestones/:milestone_id/vote-result`
- **Body:**
```json
{
  "voteResult": 5
}
```

#### Update Is Claimed
- **PUT** `/campaigns/:object_id/milestones/:milestone_id/claimed`

#### Get Milestones
- **GET** `/milestones?id=obj123`
- **Query Params:**
  - `id` (required) - Campaign object_id

### 💰 Contributions

#### Create Contribution
- **POST** `/create-contribution`
- **Body:**
```json
{
  "campaignId": "string",
  "walletAddress": "string",
  "amount": 100,
  "txHash": "string",
  "tierType": "string",
  "currency": "USD"
}
```

#### Get Contributions by Address
- **GET** `/contributions?address=0x123...`
- **Query Params:**
  - `address` (required) - Wallet address

#### Get Addresses by Campaign
- **GET** `/contributions?campaign_id=test123`
- **Query Params:**
  - `campaign_id` (required) - Campaign ID

### 🎁 Tiers

#### Add Tier
- **POST** `/add-tier`
- **Body:**
```json
{
  "campaign_id": "string",
  "tier": "string",
  "limit": 100,
  "description": "string (optional)"
}
```

## Response Format

### Success Response
```json
{
  "is_success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "is_success": false,
  "error": "Error message"
}
```

### Validation Error
```json
{
  "message": ["field should not be empty", ...],
  "error": "Bad Request",
  "statusCode": 400
}
```

## Status Codes
- `200` - Success
- `400` - Bad Request (Validation error)
- `404` - Not Found
- `500` - Internal Server Error

