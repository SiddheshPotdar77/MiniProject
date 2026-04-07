import { BaseAPI } from '../utils/baseApi';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class BookingAPIDelete extends BaseAPI {
  constructor(requestContext: APIRequestContext) {
    super(requestContext);
  }

  async deleteBooking(bookingId: number): Promise<APIResponse> {
    return this.delete(`booking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${process.env.AUTH_TOKEN}`
      }
    });
  }
}
