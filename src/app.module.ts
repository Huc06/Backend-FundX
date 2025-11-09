import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CampaignsModule } from './campaigns/campaigns.module';
import { ImagesModule } from './images/images.module';
import { MilestonesModule } from './milestones/milestones.module';
import { ContributionsModule } from './contributions/contributions.module';
import { TiersModule } from './tiers/tiers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CampaignsModule,
    ImagesModule,
    MilestonesModule,
    ContributionsModule,
    TiersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
