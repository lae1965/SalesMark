import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { LeadsModule } from 'src/leads/leads.module';

@Module({
  controllers: [ContactsController],
  providers: [ContactsService],
  imports: [LeadsModule],
})
export class ContactsModule {}
