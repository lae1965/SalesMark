import { Injectable } from '@nestjs/common';
import { LeadsService } from './../leads/leads.service';
import { Api } from 'src/api/api.service';

@Injectable()
export class ContactsService {
  private readonly URL = `${process.env.AMO_SRM_DOMAIN}api/v4/contacts`;
  private emailId: number;
  private phoneId: number;
  constructor(private readonly leadService: LeadsService) {}

  private getCustomFieldId(fields: any[], code: string) {
    return fields.find((field: { code: string }) => field.code === code).id;
  }

  async contactProcess(name: string, email: string, phone: string) {
    try {
      // Определяем id дополнительных полей email и phone
      const fldResponse = await Api.get(`${this.URL}/custom_fields`);
      const fields = fldResponse.data._embedded.custom_fields;

      this.phoneId = this.getCustomFieldId(fields, 'PHONE');
      this.emailId = this.getCustomFieldId(fields, 'EMAIL');

      // Ищем контакты с заданными email и/или phone
      const findResponse = await Promise.all([
        Api.get(`${this.URL}?query=${phone}&limit=1`),
        Api.get(`${this.URL}?query=${email}&limit=1`),
      ]);
      const contacts =
        findResponse[0].data?._embedded?.contacts ||
        findResponse[1].data?._embedded?.contacts ||
        null;

      const insertData = [
        {
          name,
          custom_fields_values: [
            {
              field_id: this.emailId,
              values: [{ value: email }],
            },
            {
              field_id: this.phoneId,
              values: [{ value: phone }],
            },
          ],
        },
      ];

      let contactId: number;

      // Если контакт нашелся, обновляем его
      if (contacts?.length) {
        const response = await Api.patch(
          `${this.URL}/${contacts[0].id}`,
          insertData[0],
        );
        contactId = response.data.id;
      }
      // Если контакт не нашелся, создаем его
      else {
        const response = await Api.post(this.URL, insertData);
        contactId = response.data._embedded.contacts[0].id;
      }

      // Создаем сделку
      return await this.leadService.createLead(contactId);
    } catch (e) {
      throw e;
    }
  }
}
