/**
 * Rasedi Payment Gateway - Node.js Express Example
 *
 * This example demonstrates how to use the Rasedi SDK in a server environment
 * to create payment links, check payment status, and cancel payments.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { RasediClient, Gateway } from "rasedi-sdk";

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Validate environment variables
if (!process.env.RASEDI_PRIVATE_KEY || !process.env.RASEDI_SECRET_KEY) {
  console.error("Missing required environment variables!");
  console.error(
    "Please create a .env file with RASEDI_PRIVATE_KEY and RASEDI_SECRET_KEY",
  );
  console.error("See .env.example for reference");
  process.exit(1);
}

// Initialize Rasedi Client
const rasediClient = new RasediClient(
  process.env.RASEDI_PRIVATE_KEY,
  process.env.RASEDI_SECRET_KEY,
);

// ============================================================
// ROUTES
// ============================================================

/**
 * Health check endpoint
 */
app.get("/", (req, res) => {
  res.json({
    message: "Rasedi Payment Gateway API",
    status: "running",
    endpoints: {
      createPayment: "POST /api/payments",
      getPayment: "GET /api/payments/:referenceCode",
      cancelPayment: "DELETE /api/payments/:referenceCode",
    },
  });
});

/**
 * Create a new payment link
 *
 * POST /api/payments
 * Body: {
 *   amount: string,
 *   title: string,
 *   description: string,
 *   gateways?: Gateway[],
 *   redirectUrl?: string,
 *   callbackUrl?: string
 * }
 */
app.post("/api/payments", async (req, res) => {
  try {
    const {
      amount,
      title,
      description,
      gateways = [Gateway.ZAIN, Gateway.CREDIT_CARD],
      redirectUrl = "https://your-site.com/payment/success",
      callbackUrl = "https://your-server.com/api/webhooks/rasedi",
      collectFeeFromCustomer = false,
      collectCustomerEmail = true,
      collectCustomerPhoneNumber = true,
    } = req.body;

    // Validate required fields
    if (!amount || !title || !description) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: amount, title, description",
      });
    }

    console.log("Creating payment:", { amount, title, description });

    const response = await rasediClient.createPayment({
      amount,
      title,
      description,
      gateways,
      redirectUrl,
      callbackUrl,
      collectFeeFromCustomer,
      collectCustomerEmail,
      collectCustomerPhoneNumber,
    });

    console.log("Payment created:", response.body.referenceCode);

    res.json({
      success: true,
      data: {
        referenceCode: response.body.referenceCode,
        redirectUrl: response.body.redirectUrl,
        status: response.body.status,
        amount: response.body.amount,
      },
    });
  } catch (error) {
    console.error("Error creating payment:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Get payment status by reference code
 *
 * GET /api/payments/:referenceCode
 */
app.get("/api/payments/:referenceCode", async (req, res) => {
  try {
    const { referenceCode } = req.params;

    console.log("Fetching payment status:", referenceCode);

    const response = await rasediClient.getPaymentByReference(referenceCode);

    console.log("Payment status:", response.body.status);

    res.json({
      success: true,
      data: {
        referenceCode: response.body.referenceCode,
        status: response.body.status,
      },
    });
  } catch (error) {
    console.error("Error fetching payment:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Cancel a payment
 *
 * DELETE /api/payments/:referenceCode
 */
app.delete("/api/payments/:referenceCode", async (req, res) => {
  try {
    const { referenceCode } = req.params;

    console.log("Cancelling payment:", referenceCode);

    const response = await rasediClient.cancelPayment(referenceCode);

    console.log("Payment cancelled");

    res.json({
      success: true,
      data: response.body,
    });
  } catch (error) {
    console.error("Error cancelling payment:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║             Rasedi Payment Gateway Server                  ║
╠═══════════════════════════════════════════════════════════╣
║   Server running on http://localhost:${PORT}               ║
║  SDK Mode: ${process.env.RASEDI_SECRET_KEY?.includes("test") ? "TEST (Sandbox)" : "LIVE (Production)"}                       ║
╚═══════════════════════════════════════════════════════════╝

Available endpoints:
  POST   /api/payments              - Create payment link
  GET    /api/payments/:ref         - Get payment status
  DELETE /api/payments/:ref         - Cancel payment
  `);
});

export default app;
