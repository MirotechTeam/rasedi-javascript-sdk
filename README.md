# Rasedi SDK

Universal Rasedi Payment Gateway SDK for Nodejs, React, Vue, Angular and React Native

## Github Repository

Check the [Github Repository](https://github.com/MirotechTeam/rasedi-javascript-sdk) for full implementations:

## Installation

```bash
npm install rasedi-sdk
```

### Initialization

Initialize the client with your credentials. Obtain your keys from the Rasedi Dashboard.

```typescript
import { RasediClient, Gateway, PaymentStatus } from 'rasedi-sdk';

const client = new RasediClient('YOUR_PRIVATE_KEY', 'YOUR_SECRET_KEY');
```

### 1. Create a Payment

Initiate a new payment request. You can specify multiple gateways and various options.

```typescript
const paymentResponse = await client.createPayment({
  amount: "1050", // Amount in smallest currency unit (e.g., cents or local equivalent)
  title: "Order #12345",
  description: "Premium Subscription Plan",
  gateways: [Gateway.CREDIT_CARD, Gateway.ZAIN], // Specify allowed payment methods
  redirectUrl: "https://your-domain.com/payment/success",
  callbackUrl: "https://your-domain.com/api/webhooks/payment", // For server-to-server notifications
  collectFeeFromCustomer: false,
  collectCustomerEmail: true,
  collectCustomerPhoneNumber: true
});

console.log(`Payment Initiated: ${paymentResponse.body.referenceCode}`);
console.log(`Redirect URL: ${paymentResponse.body.redirectUrl}`);
```

### 2. Check Payment Status

Retrieve the current status of a payment using its unique `referenceCode`. This is useful for polling or verifying payment completion.

```typescript
const statusResponse = await client.getPaymentByReference(paymentResponse.body.referenceCode);

if (statusResponse.body.status === PaymentStatus.PAID) {
  console.log("Payment successful!");
} else {
  console.log(`Current Status: ${statusResponse.body.status}`);
}
```

### 3. Cancel a Payment

Cancel a pending payment. This operation is only valid for payments that are still in a `PENDING` state.

```typescript
const cancelResponse = await client.cancelPayment(paymentResponse.body.referenceCode);

if (cancelResponse.body.status === PaymentStatus.CANCELED) {
  console.log("Payment successfully canceled.");
}
```

## Enums & Constants

### Gateway

Supported payment gateways:

| Enum Value | Description |
| :--- | :--- |
| `Gateway.FIB` | First Iraqi Bank |
| `Gateway.ZAIN` | ZainCash |
| `Gateway.ASIA_PAY` | AsiaPay |
| `Gateway.FAST_PAY` | FastPay |
| `Gateway.NASS_WALLET` | NassWallet |
| `Gateway.CREDIT_CARD` | Credit Card (Visa/Mastercard) |

### PaymentStatus

Possible states of a payment:

| Enum Value | Description |
| :--- | :--- |
| `PaymentStatus.PENDING` | Payment created and awaiting user action |
| `PaymentStatus.PAID` | Payment successfully completed |
| `PaymentStatus.FAILED` | Payment failed or was declined |
| `PaymentStatus.CANCELED` | Payment was manually canceled |
| `PaymentStatus.TIMED_OUT` | Payment session expired |

## Examples

Check the `examples` directory for full implementations:

- **[React](./examples/react-demo)**
- **[Vue](./examples/vue-demo)**
- **[Angular](./examples/angular-demo)**
- **[React Native](./examples/react-native-demo)**

## License

MIT
