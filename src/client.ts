import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Auth } from "./auth";
import {
  CreatePaymentPayload,
  ApiResponse,
  PaymentResponseBody,
} from "./models";
import { PaymentStatus } from "./enums";

export class RasediClient {
  private static readonly API_BASE_URL = "https://api.rasedi.com";
  private static readonly UPSTREAM_VERSION = 1;

  private auth: Auth;
  private httpClient: AxiosInstance;
  private isTest: boolean;

  constructor(
    private privateKey: string,
    private secretKey: string,
  ) {
    this.auth = new Auth(privateKey, secretKey);
    this.isTest = secretKey.includes("test");
    this.httpClient = axios.create({
      baseURL: RasediClient.API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
      validateStatus: () => true, // Handle all statuses manually
    });
  }

  private async call<T>(
    path: string,
    method: string,
    body?: any,
  ): Promise<ApiResponse<T>> {
    const env = this.isTest ? "test" : "live";
    const relativeUrl = `/v${RasediClient.UPSTREAM_VERSION}/payment/rest/${env}${path}`;

    const signature = await this.auth.makeSignature(method, relativeUrl);

    const headers = {
      "x-signature": signature,
      "x-id": this.auth.getKeyId(),
    };

    try {
      const response: AxiosResponse = await this.httpClient.request({
        url: relativeUrl,
        method: method,
        data: body,
        headers: headers,
      });

      if (response.status < 200 || response.status > 209) {
        throw new Error(
          `Request failed with status ${response.status}: ${JSON.stringify(response.data)}`,
        );
      }

      return {
        body: response.data,
        headers: response.headers as Record<string, string>,
        statusCode: response.status,
      };
    } catch (error: any) {
      throw error;
    }
  }

  public async createPayment(
    payload: CreatePaymentPayload,
  ): Promise<ApiResponse<PaymentResponseBody>> {
    return this.call<PaymentResponseBody>("/create", "POST", payload);
  }

  public async getPaymentByReference(
    referenceCode: string,
  ): Promise<ApiResponse<PaymentResponseBody>> {
    return this.call<PaymentResponseBody>(`/status/${referenceCode}`, "GET");
  }

  public async cancelPayment(
    referenceCode: string,
  ): Promise<ApiResponse<PaymentResponseBody>> {
    return this.call<PaymentResponseBody>(`/cancel/${referenceCode}`, "PATCH");
  }

  // Placeholder for verification
  public async verify(payload: any): Promise<any> {
    throw new Error(
      "Verification not implemented for client-side SDK due to security risks of exposing public keys or logic.",
    );
  }
}
