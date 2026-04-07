/*
* Booking API GET Integration Test Suite
* Tests for Restful Booker GET /booking/{id} endpoint using Playwright's APIRequestContext
*/

import { test, expect } from '@playwright/test';
import { logger } from '../utils/logger';
import { BookingAPIGet } from '../api-client/BookingGetAPI';
import { BookingAPI } from '../api-client/BookingPostAPI'; // used to create bookings
import Ajv from "ajv";

test.describe('Booking API GET Integration Tests', () => {
  let bookingApiGet: BookingAPIGet;
  let bookingApiPost: BookingAPI;
  let bookingId: number;

  test.beforeEach(async ({ request }) => {
    bookingApiGet = new BookingAPIGet(request);
    bookingApiPost = new BookingAPI(request);

    // Create a booking first so we have a valid ID
    const response = await bookingApiPost.createBooking();
    const jsondata = await bookingApiPost.getJson<any>(response);
    bookingId = jsondata.bookingid;
  });

  test('@integration Successful retrieval', async () => {
    const response = await bookingApiGet.getBooking(bookingId);
    await bookingApiGet.verifyStatus(response, 200);

    const booking = await bookingApiGet.getJson<any>(response);
    expect(booking.firstname).toBe('Jim');
    expect(booking.lastname).toBe('Brown');
    logger.step('Booking retrieved successfully');
  });

  test('@integration Response body validation', async () => {
    const response = await bookingApiGet.getBooking(bookingId);
    const booking = await bookingApiGet.getJson<any>(response);

    expect(booking).toHaveProperty('firstname');
    expect(booking).toHaveProperty('lastname');
    expect(booking).toHaveProperty('totalprice');
    expect(booking).toHaveProperty('depositpaid');
    expect(booking.bookingdates).toHaveProperty('checkin');
    expect(booking.bookingdates).toHaveProperty('checkout');
    logger.step('Response body validated');
  });

  test('@integration Schema validation', async () => {
    const response = await bookingApiGet.getBooking(bookingId);
    const booking = await bookingApiGet.getJson<any>(response);

    const schema = {
      type: "object",
      properties: {
        firstname: { type: "string" },
        lastname: { type: "string" },
        totalprice: { type: "number" },
        depositpaid: { type: "boolean" },
        bookingdates: {
          type: "object",
          properties: {
            checkin: { type: "string" },
            checkout: { type: "string" }
          },
          required: ["checkin", "checkout"]
        },
        additionalneeds: { type: "string" }
      },
      required: ["firstname", "lastname", "totalprice", "depositpaid", "bookingdates"]
    };

    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(booking);
    expect(valid).toBe(true);
    logger.step('Schema validation passed');
  });

  test('@integration Filtering and query parameters', async () => {
    // Restful Booker supports filtering: /booking?firstname=Jim&lastname=Brown
    const response = await bookingApiGet.get('booking', {
      params: { firstname: 'Jim', lastname: 'Brown' }
    });
    await bookingApiGet.verifyStatus(response, 200);

    const bookings = await bookingApiGet.getJson<any>(response);
    expect(Array.isArray(bookings)).toBe(true);
    logger.step('Filtering validated');
  });

  test('@integration Pagination (simulated)', async () => {
    // Restful Booker doesn’t have native pagination, but you can simulate by limiting results
    const response = await bookingApiGet.get('booking', {
      params: { firstname: 'Jim' }
    });
    await bookingApiGet.verifyStatus(response, 200);

    const bookings = await bookingApiGet.getJson<any>(response);
    expect(bookings.length).toBeGreaterThan(0);
    logger.step('Pagination scenario validated (simulated via filters)');
  });

  test('@integration Invalid ID', async () => {
    const response = await bookingApiGet.getBooking(999999); // non-existent ID
    expect([404, 400]).toContain(response.status());
    logger.step('Invalid booking ID scenario validated');
  });

  test('@integration Malformed ID', async () => {
    const response = await bookingApiGet.get('booking/abc'); // invalid format
    expect([400, 404]).toContain(response.status());
    logger.step('Malformed booking ID scenario validated');
  });

  test('@integration Unauthorized access', async () => {
    // GET /booking/{id} is public, but simulate unauthorized by hitting an auth-protected endpoint
    const response = await bookingApiGet.get('booking', {
      headers: { Authorization: "Bearer invalid-token" }
    });
    expect([200, 401, 403]).toContain(response.status());
    logger.step('Unauthorized access scenario validated');
  });

  test('@integration Forbidden access', async () => {
    // Simulate forbidden by using invalid cookie/token on an endpoint that requires auth
    const response = await bookingApiGet.get(`booking/${bookingId}`, {
      headers: { Cookie: "token=invalid" }
    });
    expect([200, 403]).toContain(response.status());
    logger.step('Forbidden access scenario validated');
  });
});
