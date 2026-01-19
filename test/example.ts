import { RasediClient, Gateway } from "../src";

async function main() {
  const secretKey =
    "live_laisxVjnNnoY1w5mwWP6YwzfPg_zmu2BnWnJH1uCOzOGcAflAYShdjVPuDAG10DLSEpTOlsOopiyTJHJjO4fbqqU";
  const privateKey = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEID2nK2pCcGSbtS+U9jc2SCYxHWOo1eA4IR97bdif4+rx
-----END PRIVATE KEY-----`;

  console.log("Initializing Client...");
  const client = new RasediClient(privateKey, secretKey);

  console.log("Creating Payment...");
  try {
    const payment = await client.createPayment({
      amount: "10500",
      title: "Test JS SDK",
      description: "Testing Universal JS SDK",
      gateways: [Gateway.CREDIT_CARD],
      redirectUrl: "https://example.com/callback",
      callbackUrl: "https://example.com/webhook",
      collectFeeFromCustomer: true,
      collectCustomerEmail: true,
      collectCustomerPhoneNumber: false,
    });

    console.log("Payment Created:", payment.body.referenceCode);
    console.log("Status:", payment.body.status);

    if (payment.body.referenceCode) {
      console.log("Fetching Payment...");
      const details = await client.getPaymentByReference(
        payment.body.referenceCode,
      );
      console.log("Fetched Status:", details.body.status);

      console.log("Cancelling Payment...");
      const ignored = await client.cancelPayment(payment.body.referenceCode);
      console.log("Cancelled Status:", ignored.body.status);
    }
  } catch (error: any) {
    console.error("Error:", error.message || error);
    if (error.response) {
      console.error("Response Data:", error.response.data);
    }
  }
}

main();
