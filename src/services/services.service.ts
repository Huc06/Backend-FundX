import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../database/supabase/supabase.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createServiceDto: CreateServiceDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('services')
      .insert([createServiceDto])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return {
      is_success: true,
      data: data,
    };
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('services')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }
    return {
      is_success: true,
      data: data,
    };
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return {
      is_success: true,
      data: data,
    };
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('services')
      .update(updateServiceDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return {
      is_success: true,
      data: data,
    };
  }

  async remove(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('services')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return {
      is_success: true,
      data: data,
    };
  }
}
