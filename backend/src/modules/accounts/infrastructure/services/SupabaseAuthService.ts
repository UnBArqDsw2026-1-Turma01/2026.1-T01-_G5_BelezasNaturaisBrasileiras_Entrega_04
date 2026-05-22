import { Injectable } from '@nestjs/common';
import { ISupabaseAuthService } from '../../domain/interfaces/ISupabaseAuthService';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAuthService implements ISupabaseAuthService {
  constructor(private supabase: SupabaseClient) {}

  async createUser(email: string, password: string): Promise<{ uid: string }> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { uid: data.user!.id };
  }

  async signIn(email: string, password: string): Promise<{ access_token: string; uid: string }> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { 
      access_token: data.session!.access_token,
      uid: data.user!.id
    };
  }

  async deleteUser(uid: string): Promise<void> {
    const { error } = await this.supabase.auth.admin.deleteUser(uid);

    if (error) {
      throw error;
    }
  }
}
