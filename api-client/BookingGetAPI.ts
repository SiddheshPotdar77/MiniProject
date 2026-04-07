import { BaseAPI } from '../utils/baseApi';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class BookingAPIGet extends BaseAPI {
  constructor(requestContext: APIRequestContext) {
    super(requestContext);
  }

  async getBooking(bookingId: number): Promise<APIResponse> {
    return this.get(`booking/${bookingId}`);
  }
}
