import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WalrusService } from './walrus/walrus.service';
import { IDatabaseService } from './interfaces/database.interface';

// Use WalrusService as the database implementation
const DatabaseServiceProvider = {
  provide: 'DATABASE_SERVICE',
  useClass: WalrusService,
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DatabaseServiceProvider, WalrusService],
  exports: ['DATABASE_SERVICE', WalrusService],
})
export class DatabaseModule {}

