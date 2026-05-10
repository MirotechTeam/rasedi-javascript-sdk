import { RasediClient, Gateway } from './src';

const privateKey = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIPDnRmDLxXvyxszuCOMT7F50fDCHllNHMf4XgPNJ5YWx
-----END PRIVATE KEY-----`;
const secretKey = 'test_ipstIrJ1vp2fuDogJMn_3VyP0hvA0So9D0UDMhCDF4BaIg';

const client = new RasediClient(privateKey, secretKey);

async function runTests() {
  try {
    console.log("1. Creating Payment...");
    const createResp = await client.createPayment({
      amount: "1050",
      title: "Test Payment",
      description: "Testing Rasedi SDK",
      gateways: [Gateway.ZAIN, Gateway.FIB, Gateway.CREDIT_CARD],
      redirectUrl: "https://example.com/success",
      callbackUrl: "https://example.com/webhook",
      collectFeeFromCustomer: false,
      collectCustomerEmail: true,
      collectCustomerPhoneNumber: true
    });

    const refCode = createResp.body.referenceCode;
    console.log(`✅ Payment Created!`);
    console.log(`Reference Code: ${refCode}`);
    console.log(`Payment Link: ${createResp.body.redirectUrl}`);

    console.log("\n2. Getting Payment Status...");
    const statusResp = await client.getPaymentByReference(refCode);
    console.log(`✅ Status retrieved: ${statusResp.body.status}`);

    console.log("\n3. Canceling Payment...");
    const cancelResp = await client.cancelPayment(refCode);
    console.log(`✅ Cancelation successful, new status: ${cancelResp.body.status}`);
    
  } catch (err: any) {
    if (err.response) {
      console.error("API Error:");
      console.error(err.response.data);
    } else {
      console.error(err);
    }
  }
}

runTests();
