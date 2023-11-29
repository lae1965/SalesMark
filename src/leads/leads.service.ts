import { Injectable } from '@nestjs/common';
import { Api } from 'src/api/api.service';

@Injectable()
export class LeadsService {
  async createLead(id: number) {
    try {
      const response = await Api.post(
        `${process.env.AMO_SRM_DOMAIN}api/v4/leads`,
        [
          {
            _embedded: {
              contacts: [{ id }],
            },
          },
        ],
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}
