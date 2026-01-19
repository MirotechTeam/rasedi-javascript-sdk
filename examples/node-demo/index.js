const { RasediClient, Gateway } = require("rasedi-javascript-sdk");

const SECRET_KEY =
  "live_laisxVjnNnoY1w5mwWP6YwzfPg_zmu2BnWnJH1uCOzOGcAflAYShdjVPuDAG10DLSEpTOlsOopiyTJHJjO4fbqqU";
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEID2nK2pCcGSbtS+U9jc2SCYxHWOo1eA4IR97bdif4+rx
-----END PRIVATE KEY-----`;

async function main() {
  console.log("Initializing Rasedi Client for Node.js...");
  const client = new RasediClient(PRIVATE_KEY, SECRET_KEY);

  try {
    const orderId = `order_${Math.floor(Math.random() * 10000)}`;
    console.log(`Creating payment for ${orderId}...`);

    const response = await client.createPayment({
      amount: "1050", // 10.50 currency units (e.g., SAR)
      title: "Node.js SDK Test",
      description: `Test Order ${orderId}`,
      gateways: [Gateway.CREDIT_CARD],
      redirectUrl: "https://google.com",
      callbackUrl: "https://google.com/callback",
      collectFeeFromCustomer: false,
      collectCustomerEmail: true,
      collectCustomerPhoneNumber: true,
    });

    console.log(`Payment Created: ${response.statusCode}`);
    console.log(response.body);

    if (response.body && response.body.referenceCode) {
      console.log(`Checking status for ${response.body.referenceCode}...`);
      const statusParams = await client.getPaymentByReference(
        response.body.referenceCode,
      );
      console.log(`Status: ${statusParams.statusCode}`);
      console.log(statusParams.body);

      console.log(`Cancelling payment...`);
      const cancelResponse = await client.cancelPayment(
        response.body.referenceCode,
      );
      console.log(`Cancel Result: ${cancelResponse.statusCode}`);
      console.log(cancelResponse.body);
    }
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response:", error.response.data);
    }
  }
}

main();
