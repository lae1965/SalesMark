import { Controller, Get, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller('api/contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}
  @Get()
  async contacts(
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('phone') phone: string,
  ) {
    return await this.contactsService.contactProcess(name, email, phone);
  }
}
