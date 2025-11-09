import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { ImagesModule } from './images/images.module';
import { MilestonesModule } from './milestones/milestones.module';
import { ContributionsModule } from './contributions/contributions.module';
import { TiersModule } from './tiers/tiers.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    CampaignsModule,
    ImagesModule,
    MilestonesModule,
    ContributionsModule,
    TiersModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
