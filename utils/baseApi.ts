import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from '../utils/logger';
import { env } from '../utils/envManager';
import Ajv, { JSONSchemaType } from 'ajv';

export class BaseAPI {
  private requestContext: APIRequestContext;
  private baseURL: string;
  private ajv: Ajv;

  constructor(requestContext: APIRequestContext, baseURL?: string) {
    this.requestContext = requestContext;
    this.baseURL = baseURL || env.getBaseUrl();
    this.ajv = new Ajv();
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    let url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }
    return url;
  }

  async get(endpoint: string, options?: { headers?: Record<string, string>; params?: Record<string, string> }): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, options?.params);
    logger.info(`API GET: ${url}`);
    try {
      const response = await this.requestContext.get(url, { headers: options?.headers });
      logger.info(`API Response Status: ${response.status()}`);
      return response;
    } catch (error) {
      logger.error(`API GET failed: ${url}`, error);
      throw error;
    }
  }

  async post(endpoint: string, body: any, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    const url = this.buildUrl(endpoint);
    logger.info(`API POST: ${url}`);
    try {
      const response = await this.requestContext.post(url, {
        headers: { 'Content-Type': 'application/json', ...options?.headers },
        data: body,
      });
      logger.info(`API Response Status: ${response.status()}`);
      return response;
    } catch (error) {
      logger.error(`API POST failed: ${url}`, error);
      throw error;
    }
  }

  async put(endpoint: string, body: any, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    const url = this.buildUrl(endpoint);
    logger.info(`API PUT: ${url}`);
    try {
      const response = await this.requestContext.put(url, {
        headers: { 'Content-Type': 'application/json', ...options?.headers },
        data: body,
      });
      logger.info(`API Response Status: ${response.status()}`);
      return response;
    } catch (error) {
      logger.error(`API PUT failed: ${url}`, error);
      throw error;
    }
  }

  async delete(endpoint: string, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    const url = this.buildUrl(endpoint);
    logger.info(`API DELETE: ${url}`);
    try {
      const response = await this.requestContext.delete(url, {
        headers: { 'Content-Type': 'application/json', ...options?.headers },
      });
      logger.info(`API Response Status: ${response.status()}`);
      return response;
    } catch (error) {
      logger.error(`API DELETE failed: ${url}`, error);
      throw error;
    }
  }

  async getJson<T>(response: APIResponse): Promise<T> {
    return await response.json() as T;
  }

  async verifyStatus(response: APIResponse, expectedStatus: number): Promise<void> {
    const actualStatus = response.status();
    if (actualStatus !== expectedStatus) {
      const body = await response.text();
      throw new Error(`Expected status ${expectedStatus}, got ${actualStatus} for ${response.url()}. Response: ${body}`);
    }
  }

  async validateSchema<T>(response: APIResponse, schema: JSONSchemaType<T>): Promise<void> {
    const jsondata = await this.getJson<T>(response);
    const validate = this.ajv.compile(schema);
    if (!validate(jsondata)) {
      logger.error('Schema validation failed', validate.errors);
      throw new Error(`Schema validation failed: ${JSON.stringify(validate.errors)}`);
    }
    logger.info('Schema validation passed');
  }

  // 🔑 Centralized auth helper
  async getAuthToken(username: string, password: string): Promise<string> {
    const response = await this.post('auth', { username, password }, {
      headers: { 'Content-Type': 'application/json' }
    });
    await this.verifyStatus(response, 200);
    const json = await response.json();
    return json.token;
  }
}
