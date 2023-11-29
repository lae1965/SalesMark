import { ApiService } from './../api/api.service';
import {
  Injectable,
  OnApplicationBootstrap,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { resolve } from 'path';
import * as fs from 'fs';

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  private readonly pathToTokens = resolve(
    __dirname,
    '..',
    '..',
    'public',
    'tk.txt',
  );
  accessToken: string;
  refreshToken: string;

  constructor(
    @Inject(forwardRef(() => ApiService))
    private readonly apiService: ApiService,
  ) {}
  // Хук, вызывается после загрузки всех модулей, производит инициализацию токенов
  onApplicationBootstrap() {
    fs.readFile(
      this.pathToTokens,
      'utf-8',
      async (err: Error, data: string) => {
        if (err) {
          try {
            await this.apiService.getNewTokens(true);
            this.saveTokensToFile();
          } catch (e) {
            throw e;
          }
        } else {
          try {
            this.refreshToken = data;
            await this.apiService.getNewTokens(false);
            this.saveTokensToFile();
          } catch (e) {
            if (e.HttpStatus === 401) this.removeTokensFile();
            throw e;
          }
        }
      },
    );
  }

  saveTokensToFile() {
    fs.writeFile(this.pathToTokens, this.refreshToken, (err) => {
      if (err) console.log(err);
    });
  }

  removeTokensFile() {
    console.log(
      'Вам необходимо снова получить на платфоорме AmoCRM код авторизации и прописать его в переменную окружения AMO_CRM_AUTH_CODE',
    );
    fs.rm(this.pathToTokens, (err) => {
      if (err) console.log(err);
    });
  }
}
