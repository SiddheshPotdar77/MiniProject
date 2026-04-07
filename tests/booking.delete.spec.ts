import { test, expect } from '@playwright/test';
import { BookingAPIPost } from '../api-client/BookingPostAPI';
import { BookingAPIDelete } from '../api-client/BookingDeleteAPI';
import { logger } from '../utils/logger';

test.describe('Booking API DELETE Integration Tests', async () => {
  let bookingApiPost: BookingAPIPost;
  let bookingApiDelete: BookingAPIDelete;
  let bookingId: number;

  test.beforeEach(async ({ request }) => {
    bookingApiPost = new BookingAPIPost(request);
    bookingApiDelete = new BookingAPIDelete(request);

    // Get auth token
    const token = await bookingApiPost.getAuthToken('admin', 'password123');
    process.env.AUTH_TOKEN = token;

    // Create a booking to delete
    const response = await bookingApiPost.createBooking();
    await bookingApiPost.verifyStatus(response, 200);
    const jsondata = await bookingApiPost.getJson<any>(response);
    bookingId = jsondata.bookingid;
  });

  test('@integration Successful deletion', async ({ request }) => {
    const response = await bookingApiDelete.deleteBooking(bookingId);
    expect(response.status()).toBe(201); // Restful Booker returns 201 on success
    logger.step('DELETE returned 201 Created');

    // Verify booking no longer exists
    const getResponse = await request.get(`booking/${bookingId}`);
    expect(getResponse.status()).toBe(404);
    logger.step('Booking successfully deleted and not retrievable');
  });

  test('@integration Unauthorized deletion', async ({ request }) => {
    // Try delete without token
    const response = await request.delete(`booking/${bookingId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    expect([401, 403,405]).toContain(response.status());
    logger.step('Unauthorized delete scenario validated');
  });

  test('@integration Forbidden deletion', async () => {
    // Simulate forbidden by using wrong token
    process.env.AUTH_TOKEN = 'invalidToken';
    const response = await bookingApiDelete.deleteBooking(bookingId);
    expect([401, 403]).toContain(response.status());
    logger.step('Forbidden delete scenario validated');
  });

  test('@integration Invalid resource ID', async () => {
    const response = await bookingApiDelete.deleteBooking(999999);
    expect([404, 405]).toContain(response.status());
    logger.step('Invalid resource ID scenario validated');
  });
});
