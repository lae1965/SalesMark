import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ContactsModule } from './contacts/contacts.module';
import { LeadsModule } from './leads/leads.module';
import { AuthModule } from './auth/auth.module';
import { ApiModule } from './api/api.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '..', '.env'),
    }),
    ContactsModule,
    LeadsModule,
    AuthModule,
    ApiModule,
  ],
})
export class AppModule {}
