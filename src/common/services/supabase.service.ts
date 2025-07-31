import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('supabase.url');
    const supabaseAnonKey = this.configService.get<string>('supabase.anonKey');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL and Anon Key are required');
    }

    this.supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  async createUser(email: string, password: string, metadata?: any) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) throw error;
    return data;
  }

  async signInUser(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signOutUser() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getUser(userId: string) {
    const { data, error } = await this.supabase.auth.admin.getUserById(userId);
    if (error) throw error;
    return data;
  }

  async verifyToken(token: string) {
    const { data, error } = await this.supabase.auth.getUser(token);
    if (error) throw error;
    return data;
  }
} 