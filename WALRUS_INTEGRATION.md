# Walrus Database Integration

## Overview

FundX Backend sử dụng Walrus - một decentralized storage protocol trên Sui blockchain - để lưu trữ dữ liệu. Walrus cung cấp giải pháp lưu trữ phi tập trung, bền vững và tiết kiệm chi phí.

## Architecture

### Database Abstraction Layer

Dự án sử dụng **Database Abstraction Pattern** để dễ dàng swap database provider:

```
┌─────────────────────────────────┐
│   Business Services             │
│   (Campaigns, Images, etc.)     │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   IDatabaseService Interface    │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   WalrusService Implementation │
└─────────────────────────────────┘
```

### Data Storage Model

Walrus không phải database truyền thống, nên chúng ta sử dụng **Collection-based storage**:

- Mỗi collection (campaigns, images, milestones, etc.) được lưu như một JSON blob
- Mỗi blob chứa toàn bộ collection dưới dạng array
- Index blob ID được lưu trong environment variables

## Configuration

### Environment Variables

Thêm vào `.env`:

```env
# Walrus Aggregator URL
WALRUS_AGGREGATOR_URL=https://aggregator.walrus.space

# Optional: Sui RPC URL
WALRUS_RPC_URL=

# Collection Index Blob IDs (sẽ được tạo tự động khi có data)
# Sau khi tạo data đầu tiên, log sẽ hiển thị blob ID để thêm vào .env
WALRUS_CAMPAIGNS_INDEX=
WALRUS_IMAGES_INDEX=
WALRUS_MILESTONES_INDEX=
WALRUS_CONTRIBUTIONS_INDEX=
WALRUS_TIERS_INDEX=
```

### Initial Setup

1. **Start the application** - Walrus service sẽ tự động initialize
2. **Create first data** - Khi tạo campaign/image/milestone đầu tiên, log sẽ hiển thị blob ID
3. **Update .env** - Copy blob ID từ log và thêm vào `.env`:
   ```
   WALRUS_CAMPAIGNS_INDEX=<blob_id_from_log>
   ```

## How It Works

### Storing Data

1. Service gọi `databaseService.createCampaign(data)`
2. WalrusService:
   - Lấy collection hiện tại từ Walrus (nếu có)
   - Thêm item mới vào collection
   - Store toàn bộ collection như một blob mới
   - Trả về blob ID
3. Blob ID được log để update vào `.env`

### Retrieving Data

1. Service gọi `databaseService.getCampaigns()`
2. WalrusService:
   - Đọc index blob ID từ environment variable
   - Fetch blob từ Walrus
   - Parse JSON và trả về array of items
3. Service filter/sort data theo yêu cầu

### Updating Data

1. Service gọi `databaseService.updateCampaignCurrentAmount()`
2. WalrusService:
   - Lấy collection hiện tại
   - Update item trong memory
   - Store collection mới (tạo blob mới)
   - Update index blob ID

## Limitations & Considerations

### Current Implementation

- **Simplified Index Management**: Index blob IDs phải được update manually trong `.env`
- **Full Collection Reads**: Mỗi lần read phải fetch toàn bộ collection
- **Write Overhead**: Mỗi write tạo blob mới (immutable storage)

### Production Improvements

Để optimize cho production, có thể:

1. **Master Index Blob**: Lưu tất cả collection indexes trong một blob
2. **Pagination at Storage Level**: Chia collection thành nhiều blobs nhỏ hơn
3. **Caching Layer**: Cache collections trong memory với TTL
4. **Delta Updates**: Chỉ lưu thay đổi thay vì toàn bộ collection

## API Reference

### Walrus HTTP API

WalrusService sử dụng Walrus HTTP API:

**Store Blob:**
```typescript
PUT https://aggregator.walrus.space/v1/store
Content-Type: application/json
Body: JSON data
Response: { blobId: string }
```

**Get Blob:**
```typescript
GET https://aggregator.walrus.space/v1/blob/{blobId}
Response: JSON data
```

## Testing

### Test Walrus Connection

```bash
# Check if Walrus service initializes
curl http://localhost:3000/health

# Create a campaign (check logs for blob ID)
curl -X POST http://localhost:3000/create-campaign \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### Verify Data Storage

Sau khi tạo data, check logs để lấy blob ID, sau đó:

```bash
# Get blob from Walrus directly
curl https://aggregator.walrus.space/v1/blob/{BLOB_ID}
```

## Troubleshooting

### No Data Returned

- **Check environment variables**: Đảm bảo `WALRUS_*_INDEX` được set
- **Check logs**: Xem có blob ID nào được log không
- **Verify aggregator URL**: Test connection đến Walrus aggregator

### Data Not Persisting

- **Check blob ID**: Đảm bảo blob ID được lưu đúng trong `.env`
- **Check Walrus status**: Verify Walrus aggregator đang hoạt động
- **Check network**: Đảm bảo có kết nối internet

## Future Enhancements

- [ ] Automatic index management
- [ ] Blob versioning
- [ ] Optimistic updates
- [ ] Batch operations
- [ ] Query optimization
- [ ] Migration tools

