import { Gateway, PaymentStatus } from "./enums";

export interface CreatePaymentPayload {
  amount: string;
  title: string;
  description: string;
  gateways: Gateway[];
  redirectUrl: string;
  callbackUrl: string;
  collectFeeFromCustomer: boolean;
  collectCustomerEmail: boolean;
  collectCustomerPhoneNumber: boolean;
}

export interface PaymentResponseBody {
  referenceCode: string;
  amount: string;
  paidVia?: string;
  paidAt?: string;
  redirectUrl: string;
  status: PaymentStatus;
  payoutAmount?: string;
}

export interface ApiResponse<T> {
  body: T;
  headers: Record<string, string>;
  statusCode: number;
}

export interface VerifyPayload {
  keyId: string;
  content: string;
}

export interface VerifyResponse {
  isValid: boolean;
  payload?: any;
  error?: string;
}
