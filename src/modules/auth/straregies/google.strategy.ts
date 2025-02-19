import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import { RoleEnum } from '../../user/enum/role.enum';
import { GoogleProfile } from '../interfaces/google-profile.interface';
import { UserProfile } from '../dto/profile.dto';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<any> {
    const emails = profile?.emails;
    const name = profile?.name;
    const userProfile = plainToInstance(UserProfile, {
      email: emails[0]?.value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      password: RoleEnum.USER,
      role: RoleEnum.USER,
      accessToken,
    });

    const user = await this.userService.findByEmail(userProfile.email);
    if (!user) {
      return await this.userService.create(userProfile);
    }
    done(null, user);
  }
}
