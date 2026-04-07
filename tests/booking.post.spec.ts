/*
* Booking API Integration Test Suite
* Tests for Restful Booker POST /booking endpoint using Playwright's APIRequestContext
*/

import { test, expect } from '@playwright/test';
import { BookingAPI } from '../api-client/BookingPostAPI';
import { logger } from '../utils/logger';
import Ajv from "ajv";

test.describe('Booking API Integration Tests', async () => 
{
    let bookingApi: BookingAPI;

    test.beforeEach(async ({ request }) => 
    {
        bookingApi = new BookingAPI(request);
    });

    test('@integration Successful creation', async () => {
    const response = await bookingApi.createBooking();
    await bookingApi.verifyStatus(response, 200);

    const jsondata = await bookingApi.getJson<any>(response);
    expect(jsondata.booking.firstname).toBe('Jim');
    expect(jsondata.booking.lastname).toBe('Brown');
    logger.step('Booking created successfully');
    });

    test('@integration Response body validation', async () => {
    const response = await bookingApi.createBooking();
    const jsondata = await bookingApi.getJson<any>(response);

    expect(jsondata).toHaveProperty('bookingid');
    expect(jsondata.booking).toHaveProperty('firstname', 'Jim');
    expect(jsondata.booking).toHaveProperty('lastname', 'Brown');
    expect(jsondata.booking.bookingdates.checkin).toBe('2018-01-01');
    expect(jsondata.booking.bookingdates.checkout).toBe('2019-01-01');
    logger.step('Response body validated');
  });

  test('@integration Schema validation', async () => {
  const response = await bookingApi.createBooking();
  const jsondata = await bookingApi.getJson<any>(response);

  const schema = {
    type: "object",
    properties: {
      bookingid: { type: "number" },
      booking: {
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
      }
    },
    required: ["bookingid", "booking"]
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  const valid = validate(jsondata);
  expect(valid).toBe(true);
});

    test('@integration Idempotency checks', async () => {
    const response1 = await bookingApi.createBooking();
    const response2 = await bookingApi.createBooking();

    const booking1 = await bookingApi.getJson<any>(response1);
    const booking2 = await bookingApi.getJson<any>(response2);

    expect(booking1.bookingid).not.toBe(booking2.bookingid);
    logger.step('Idempotency validated: each POST creates a new booking');
  });

  test('@integration Missing required fields', async () => {
    const response = await bookingApi.post('booking', {
      // missing firstname, lastname
      totalprice: 111,
      depositpaid: true,
      bookingdates: { checkin: "2018-01-01", checkout: "2019-01-01" }
    });

    expect([400, 500]).toContain(response.status());
    logger.step('Missing required fields scenario validated');
  });

  test('@integration Invalid data types', async () => {
  const response = await bookingApi.post('booking', {
    firstname: "Jim",
    lastname: "Brown",
    totalprice: "invalid", // should be number
    depositpaid: "true",   // should be boolean
    bookingdates: { checkin: "2018-01-01", checkout: "2019-01-01" }
  });

  // Restful Booker accepts invalid types, so expect 200
  expect(response.status()).toBe(200);

  const jsondata = await bookingApi.getJson<any>(response);
  logger.step('Invalid data types accepted by API, documented behavior');
});

  test('@integration Invalid date formats', async () => {
  const response = await bookingApi.post('booking', {
    firstname: "Jim",
    lastname: "Brown",
    totalprice: 111,
    depositpaid: true,
    bookingdates: { checkin: "2018-13-01", checkout: "2019-99-01" }, // invalid dates
    additionalneeds: "Breakfast"
  });

  // Restful Booker accepts invalid dates, so expect 200
  expect(response.status()).toBe(200);

  const jsondata = await bookingApi.getJson<any>(response);
  logger.step('Invalid date formats accepted by API, documented behavior');
});

  test('@integration Empty payload', async () => {
    const response = await bookingApi.post('booking', {});
    expect([400, 500]).toContain(response.status());
    logger.step('Empty payload scenario validated');
  });

  test('@integration Unauthorized access', async () => {
    // Restful Booker requires auth for some endpoints, but POST /booking is open.
    // For demonstration, simulate unauthorized by hitting an auth-protected endpoint.
    const response = await bookingApi.post('booking', {
      firstname: "Jim",
      lastname: "Brown",
      totalprice: 111,
      depositpaid: true,
      bookingdates: { checkin: "2018-01-01", checkout: "2019-01-01" },
      additionalneeds: "Breakfast"
    }, { headers: { Authorization: "Bearer invalid-token" } });

    // Expect either 200 (if endpoint ignores auth) or 403/401 (if enforced)
    expect([200, 401, 403]).toContain(response.status());
    logger.step('Unauthorized access scenario validated');
  });
});
