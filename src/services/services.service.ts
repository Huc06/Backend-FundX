import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../database/supabase/supabase.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createServiceDto: CreateServiceDto) {
    const { data, error } = await this.supabaseService.getClient()
      .from('services')
      .insert([createServiceDto]);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseService.getClient()
      .from('services')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService.getClient()
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}
