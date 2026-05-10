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

export interface PaymentHistoryItem {
  referenceCode: string;
  status: PaymentStatus;
  amount: string;
  gateway?: string;
  paidAt?: string;
  payoutAmount?: string;
  serviceFeeAmount?: string;
  gatewayFeeAmount?: string;
  expiresAt?: string;
}

export interface PaymentResponseBody {
  referenceCode: string;
  amount: string;
  paidVia?: string;
  paidAt?: string;
  redirectUrl: string;
  status: PaymentStatus;
  payoutAmount?: string;
  history?: PaymentHistoryItem[];
}

export interface ApiResponse<T> {
  body: T;
  headers: Record<string, string>;
  statusCode: number;
}

/** @deprecated Use status checking or webhooks instead. */
export interface VerifyPayload {
  keyId: string;
  content: string;
}

/** @deprecated Use status checking instead. */
export interface VerifyResponse {
  isValid: boolean;
  payload?: any;
  error?: string;
}
