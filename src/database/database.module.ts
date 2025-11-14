import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase/supabase.service';
import { IDatabaseService } from './interfaces/database.interface';

// Use SupabaseService as the database implementation
const DatabaseServiceProvider = {
  provide: 'DATABASE_SERVICE',
  useClass: SupabaseService,
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DatabaseServiceProvider, SupabaseService],
  exports: ['DATABASE_SERVICE', SupabaseService],
})
export class DatabaseModule {}
