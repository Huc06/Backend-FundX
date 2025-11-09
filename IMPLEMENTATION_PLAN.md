# FundX Backend - Kế hoạch Implementation từng bước

## Tổng quan
Migrate FundX backend từ Flask sang NestJS với cấu trúc module rõ ràng, database abstraction layer.

---

## 📋 Các bước thực hiện

### ✅ Bước 1: Setup cơ bản và cấu trúc thư mục
- [x] Tạo cấu trúc thư mục modules
- [ ] Cài đặt dependencies cơ bản (@nestjs/config, class-validator, class-transformer)
- [ ] Cấu hình CORS và ValidationPipe trong main.ts
- [ ] Tạo .env.example

### 📝 Bước 2: Tạo DTOs (Data Transfer Objects)
- [ ] Campaign DTOs (CreateCampaignDto)
- [ ] Image DTOs (CreateImageDto)
- [ ] Milestone DTOs (CreateMilestoneDto, UpdateVoteResultDto)
- [ ] Contribution DTOs (CreateContributionDto)
- [ ] Tier DTOs (CreateTierDto)

### 🗄️ Bước 3: Database Abstraction Layer
- [ ] Tạo DatabaseService interface/abstract class
- [ ] Tạo DatabaseModule (có thể thay đổi implementation sau)
- [ ] Cấu hình để dễ dàng swap database provider

### 🎯 Bước 4: Campaigns Module
- [ ] CampaignsService với các methods:
  - createCampaign()
  - getCampaigns() - với pagination
  - getCampaignsByCreator()
  - getVotingCampaigns()
  - getCampaignById()
- [ ] CampaignsController với các endpoints tương ứng
- [ ] CampaignsModule

### 🖼️ Bước 5: Images Module
- [ ] ImagesService (createImage)
- [ ] ImagesController
- [ ] ImagesModule

### 🎯 Bước 6: Milestones Module
- [ ] MilestonesService với các methods:
  - createMilestone()
  - updateVoteResult()
  - updateIsClaimed()
  - getMilestonesByCampaign()
- [ ] MilestonesController
- [ ] MilestonesModule

### 💰 Bước 7: Contributions Module
- [ ] ContributionsService với các methods:
  - createContribution() - và update campaign current_amount
  - getContributionsByAddress()
  - getAddressesByCampaign()
- [ ] ContributionsController
- [ ] ContributionsModule

### 🎁 Bước 8: Tiers Module
- [ ] TiersService (createTier)
- [ ] TiersController
- [ ] TiersModule

### 🔗 Bước 9: Kết nối tất cả modules
- [ ] Import tất cả modules vào AppModule
- [ ] Test các endpoints

### 🧪 Bước 10: Testing & Documentation
- [ ] Tạo README với hướng dẫn setup
- [ ] Test các endpoints
- [ ] Fix bugs nếu có

---

## 📁 Cấu trúc thư mục dự kiến

```
src/
├── config/
│   └── database/          # Database abstraction layer
├── campaigns/
│   ├── dto/
│   ├── campaigns.controller.ts
│   ├── campaigns.service.ts
│   └── campaigns.module.ts
├── images/
├── milestones/
├── contributions/
├── tiers/
├── app.module.ts
└── main.ts
```

---

## 🎯 Bước tiếp theo
Bắt đầu với **Bước 1**: Setup cơ bản và cấu trúc thư mục

