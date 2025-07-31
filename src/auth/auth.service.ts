import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SupabaseService } from '../common/services/supabase.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      // Try Supabase authentication first
      const supabaseUser = await this.supabaseService.signInUser(email, password);
      if (supabaseUser.user) {
        // Get or create user in our local database
        let user = await this.usersService.findByEmail(email);
        if (!user) {
          user = await this.usersService.create({
            email: supabaseUser.user.email,
            name: supabaseUser.user.user_metadata?.name || email.split('@')[0],
            supabaseId: supabaseUser.user.id,
          });
        }
        return user;
      }
    } catch (error) {
      // Fallback to local authentication
      const user = await this.usersService.findByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async validateUserById(id: string): Promise<any> {
    return this.usersService.findById(id);
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    try {
      // Create user in Supabase
      const supabaseUser = await this.supabaseService.createUser(
        registerDto.email,
        registerDto.password,
        { name: registerDto.name }
      );

      if (supabaseUser.user) {
        // Create user in our local database
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        return this.usersService.create({
          email: registerDto.email,
          password: hashedPassword,
          name: registerDto.name,
          supabaseId: supabaseUser.user.id,
        });
      }
    } catch (error) {
      // Fallback to local registration only
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      return this.usersService.create({
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
      });
    }
  }

  async verifySupabaseToken(token: string) {
    try {
      const user = await this.supabaseService.verifyToken(token);
      return user;
    } catch (error) {
      return null;
    }
  }
}