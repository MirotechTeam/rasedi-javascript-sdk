# Rasedi SDK - Node.js Express Example

A simple Express.js server demonstrating how to use the Rasedi Payment Gateway SDK in a Node.js backend environment.

## Features

- Create payment links
- Check payment status
- Cancel payments
- Environment variable configuration

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example environment file and add your credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your Rasedi API credentials:

```env
RASEDI_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----your-private-key-here-----END PRIVATE KEY-----"

RASEDI_SECRET_KEY="test_your_secret_key_here"
```

### 3. Run the server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Create Payment

```bash
POST /api/payments
Content-Type: application/json

{
  "amount": "1010",
  "title": "Premium Subscription",
  "description": "Monthly subscription for premium features",
  "gateways": ["FIB", "ZAIN", "FAST_PAY"],
  "redirectUrl": "https://your-site.com/success",
  "callbackUrl": "https://your-server.com/api/webhooks/rasedi"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "referenceCode": "e3472-4ad45...",
    "redirectUrl": "https://your-site.com/e3472-4ad45...",
    "status": "PENDING",
    "amount": "1010"
  }
  
}
```

### Get Payment Status

```bash
GET /api/payments/:referenceCode
```

**Response:**
```json
{
  "success": true,
  "data": {
    "referenceCode": "e3472-4ad45...
    ",
    "amount": "1010",
    "status": "PAID",
    "paidVia": "FIB",
    "paidAt": "2026-01-21T10:30:00Z"
  }
}
```

### Cancel Payment

```bash
DELETE /api/payments/:referenceCode
```


## Testing with cURL

```bash
# Create a payment
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "1010",
    "title": "Test Payment",
    "description": "Testing the API"
  }'

# Get payment status
curl http://localhost:3000/api/payments/{reference-code}

# Cancel payment
curl -X DELETE http://localhost:3000/api/payments/{reference-code}
```

## Available Gateways

- `FIB` - First Iraqi Bank
- `ZAIN` - Zain Cash
- `ASIA_PAY` - Asia Pay
- `FAST_PAY` - Fast Pay
- `NASS_WALLET` - Nass Wallet
- `CREDIT_CARD` - Credit Card

## Payment Status Values

- `PENDING` - Payment created, waiting for customer
- `PAID` - Payment completed successfully
- `FAILED` - Payment failed
- `CANCELED` - Payment was cancelled
- `TIMED_OUT` - Payment expired

## License

MIT
