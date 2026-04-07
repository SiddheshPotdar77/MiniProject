import { BaseAPI } from '../utils/baseApi';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class BookingAPIPut extends BaseAPI {
  constructor(requestContext: APIRequestContext) {
    super(requestContext);
  }

  async updateBooking(bookingId: number, body: any): Promise<APIResponse> {
  const token = process.env.AUTH_TOKEN; // set this in beforeEach
  return this.put(`booking/${bookingId}`, body, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cookie': `token=${token}`
    }
  });
}
}
