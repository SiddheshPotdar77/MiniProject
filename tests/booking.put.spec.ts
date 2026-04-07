import { test, expect } from '@playwright/test';
import { BookingAPIPut } from '../api-client/BookingPutAPI';
import { BookingAPIPost } from '../api-client/BookingPostAPI';
import { logger } from '../utils/logger';

test.describe('Booking API PUT Integration Tests', async () => {
  let bookingApiPost: BookingAPIPost;
  let bookingApiPut: BookingAPIPut;
  let bookingId: number;

  test.beforeEach(async ({ request }) => {
    bookingApiPost = new BookingAPIPost(request);
    bookingApiPut = new BookingAPIPut(request);

    // ✅ Get auth token using BaseAPI helper
    const token = await bookingApiPost.getAuthToken('admin', 'password123');
    process.env.AUTH_TOKEN = token;

    // ✅ Create a booking first to update
    const response = await bookingApiPost.createBooking();
    await bookingApiPost.verifyStatus(response, 200);
    const jsondata = await bookingApiPost.getJson<any>(response);
    bookingId = jsondata.bookingid;
  });

  test('@integration Status Codes - Successful update', async () => {
    const response = await bookingApiPut.updateBooking(bookingId, {
      firstname: "John",
      lastname: "Doe",
      totalprice: 200,
      depositpaid: true,
      bookingdates: { checkin: "2026-04-07", checkout: "2026-04-10" },
      additionalneeds: "Dinner"
    });

    expect(response.status()).toBe(200);
    const updated = await bookingApiPut.getJson<any>(response);
    expect(updated.firstname).toBe("John");
    expect(updated.lastname).toBe("Doe");
    logger.step('PUT returned 200 OK and updated fields validated');
  });
});
