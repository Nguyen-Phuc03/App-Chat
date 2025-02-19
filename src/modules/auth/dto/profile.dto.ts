import { Expose } from 'class-transformer';

export class UserProfile {
  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  password: string;

  @Expose()
  role: string;

  @Expose()
  accessToken: string;

  constructor(partial: Partial<UserProfile>) {
    Object.assign(this, partial);
  }
}
