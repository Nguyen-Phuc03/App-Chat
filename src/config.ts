import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    postgres: {
      url: process.env.URL,
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      name: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USERNAME,
    },
    jwt: {
      jwtSecret: process.env.JWT_SECRET,
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
      refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,
      accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
    },
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    email: {
      adminEmails: process.env.ADMIN_EMAILS,
    },
    Swagger: {
      swagger_user: process.env.SWAGGER_USER,
      swagger_pw: process.env.SWAGGER_PASSWORD,
    },
  };
});
