declare enum Gateway {
    FIB = "FIB",
    ZAIN = "ZAIN",
    ASIA_PAY = "ASIA_PAY",
    FAST_PAY = "FAST_PAY",
    NASS_WALLET = "NASS_WALLET",
    CREDIT_CARD = "CREDIT_CARD"
}
declare enum PaymentStatus {
    TIMED_OUT = "TIMED_OUT",
    PENDING = "PENDING",
    PAID = "PAID",
    CANCELED = "CANCELED",
    FAILED = "FAILED"
}

interface CreatePaymentPayload {
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
interface PaymentResponseBody {
    referenceCode: string;
    amount: string;
    paidVia?: string;
    paidAt?: string;
    redirectUrl: string;
    status: PaymentStatus;
    payoutAmount?: string;
}
interface ApiResponse<T> {
    body: T;
    headers: Record<string, string>;
    statusCode: number;
}
interface VerifyPayload {
    keyId: string;
    content: string;
}
interface VerifyResponse {
    isValid: boolean;
    payload?: any;
    error?: string;
}

declare class RasediClient {
    private privateKey;
    private secretKey;
    private static readonly API_BASE_URL;
    private static readonly UPSTREAM_VERSION;
    private auth;
    private httpClient;
    private isTest;
    constructor(privateKey: string, secretKey: string);
    private call;
    createPayment(payload: CreatePaymentPayload): Promise<ApiResponse<PaymentResponseBody>>;
    getPaymentByReference(referenceCode: string): Promise<ApiResponse<PaymentResponseBody>>;
    cancelPayment(referenceCode: string): Promise<ApiResponse<PaymentResponseBody>>;
    verify(payload: any): Promise<any>;
}

export { type ApiResponse, type CreatePaymentPayload, Gateway, type PaymentResponseBody, PaymentStatus, RasediClient, type VerifyPayload, type VerifyResponse };
