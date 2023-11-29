import { Module, forwardRef } from '@nestjs/common';
import { ApiService } from './api.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ApiService],
  exports: [ApiService],
  imports: [forwardRef(() => AuthModule)],
})
export class ApiModule {}
