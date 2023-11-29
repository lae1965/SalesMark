import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiModule } from 'src/api/api.module';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  imports: [ApiModule],
})
export class AuthModule {}
