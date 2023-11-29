import { AuthService } from './../auth/auth.service';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import axios from 'axios';

export const Api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

interface DataForGetToken {
  client_id: string;
  client_secret: string;
  grant_type: string;
  redirect_uri: string;
  code?: string;
  refresh_token?: string;
}

@Injectable()
export class ApiService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {
    Api.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${this.authService.accessToken}`;
      return config;
    });

    Api.interceptors.response.use(
      (config) => config,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response.status === HttpStatus.UNAUTHORIZED &&
          error.config &&
          !error.config._isRetry
        ) {
          originalRequest._isRetry = true;
          try {
            await this.getNewTokens(false);
            this.authService.saveTokensToFile();
            return await Api.request(originalRequest);
          } catch {
            this.authService.removeTokensFile();
            throw new HttpException(
              'Пользователь не авторизован',
              HttpStatus.UNAUTHORIZED,
            );
          }
        }
        throw error;
      },
    );
  }

  async getNewTokens(isByAuthCode: boolean) {
    try {
      const data: DataForGetToken = {
        client_id: process.env.AMO_CRM_CLIENT_ID,
        client_secret: process.env.AMO_CRM_CLIENT_SECRET,
        grant_type: isByAuthCode ? 'authorization_code' : 'refresh_token',
        redirect_uri: process.env.AMO_CRM_REDIRECT_URL,
      };

      if (isByAuthCode) data.code = process.env.AMO_CRM_AUTH_CODE;
      else data.refresh_token = this.authService.refreshToken;

      const response = await axios.post(
        `${process.env.AMO_SRM_DOMAIN}oauth2/access_token`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response || response.status === HttpStatus.BAD_REQUEST)
        throw new HttpException('Неправильный запрос', HttpStatus.BAD_REQUEST);

      this.authService.accessToken = response.data.access_token;
      this.authService.refreshToken = response.data.refresh_token;
    } catch (e) {
      throw e;
    }
  }
}
