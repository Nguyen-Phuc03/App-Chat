import { User } from '../../user/entities/user.entity';

export interface AuthResponse {
  user: User;
  token: string;
}
