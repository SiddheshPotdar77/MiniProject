import { BaseAPI } from '../utils/baseApi';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class BookingAPIPost extends BaseAPI {
  constructor(requestContext: APIRequestContext) {
    super(requestContext);
  }

  async createBooking(): Promise<APIResponse> {
    const body = {
      firstname: "Jim",
      lastname: "Brown",
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: "2018-01-01",
        checkout: "2019-01-01"
      },
      additionalneeds: "Breakfast"
    };

    return this.post('booking', body);
  }
}
