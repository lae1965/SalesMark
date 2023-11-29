import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ContactsModule } from './contacts/contacts.module';
import { LeadsModule } from './leads/leads.module';
import { AuthModule } from './auth/auth.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ContactsModule,
    LeadsModule,
    AuthModule,
    ApiModule,
  ],
})
export class AppModule {}
