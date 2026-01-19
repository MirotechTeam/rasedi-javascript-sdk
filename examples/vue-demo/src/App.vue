<script setup lang="ts">
import { ref } from "vue";
import { RasediClient, Gateway } from "rasedi-sdk";

const output = ref("Click button to start test");
const secretKey =
  "live_laisxVjnNnoY1w5mwWP6YwzfPg_zmu2BnWnJH1uCOzOGcAflAYShdjVPuDAG10DLSEpTOlsOopiyTJHJjO4fbqqU";
const privateKey = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEID2nK2pCcGSbtS+U9jc2SCYxHWOo1eA4IR97bdif4+rx
-----END PRIVATE KEY-----`;

const runTest = async () => {
  output.value = "Initializing Client...";
  try {
    const client = new RasediClient(privateKey, secretKey);
    output.value += "\nCreating Payment...";

    const payment = await client.createPayment({
      amount: "10500",
      title: "Test VueJS SDK",
      description: "Testing Universal JS SDK",
      gateways: [Gateway.CREDIT_CARD],
      redirectUrl: "https://example.com/callback",
      callbackUrl: "https://example.com/webhook",
      collectFeeFromCustomer: true,
      collectCustomerEmail: true,
      collectCustomerPhoneNumber: false,
    });

    output.value += `\nPayment Created: ${payment.body.referenceCode}\nStatus: ${payment.body.status}`;

    if (payment.body.referenceCode) {
      output.value += "\nFetching Payment...";
      const details = await client.getPaymentByReference(
        payment.body.referenceCode,
      );
      output.value += `\nFetched Status: ${details.body.status}`;

      output.value += "\nCancelling Payment...";
      const ignored = await client.cancelPayment(payment.body.referenceCode);
      output.value += `\nCancelled Status: ${ignored.body.status}`;
    }
  } catch (error: any) {
    console.error(error);
    output.value += `\nError: ${error.message || error}`;
    if (error.response) {
      output.value += `\nResponse Data: ${JSON.stringify(error.response.data)}`;
    }
  }
};
</script>

<template>
  <div style="padding: 20px">
    <h1>Rasedi SDK Vue Test</h1>
    <button @click="runTest">Run SDK Test</button>
    <pre
      style="
        margin-top: 20px;
        background: #333;
        color: #fff;
        padding: 10px;
        border-radius: 5px;
        white-space: pre-wrap;
        text-align: left;
      "
      >{{ output }}</pre
    >
  </div>
</template>
