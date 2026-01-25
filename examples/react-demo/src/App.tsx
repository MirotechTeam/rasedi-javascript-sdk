import { useState } from 'react';
import { RasediClient, Gateway } from 'rasedi-sdk';

const secretKey =
  "live_laisvaY9wQA56WI1vQQc3IR8xAF7QKgtVOfOpt9X-VAMTKXMk3QeN8qjXjYSqxgHuqbS0CQlUUDbeamHZUWL632HJTI2-9";
const privateKey = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIIXCDtl2pujtCSajfQHrRMqrpExijGhuh2fvmIgrI/t+W87
-----END PRIVATE KEY-----`;

function App() {
  const [output, setOutput] = useState<string>('Click button to start test');

  const runTest = async () => {
    setOutput('Initializing Client...');
    try {
        const client = new RasediClient(privateKey, secretKey);
        setOutput(prev => prev + '\nCreating Payment...');

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

        setOutput(prev => prev + `\nPayment Created: ${payment.body.referenceCode}\nStatus: ${payment.body.status}`);

        if (payment.body.referenceCode) {
            setOutput(prev => prev + '\nFetching Payment...');
            const details = await client.getPaymentByReference(payment.body.referenceCode);
            setOutput(prev => prev + `\nFetched Status: ${details.body.status}`);

             setOutput(prev => prev + '\nCancelling Payment...');
            const ignored = await client.cancelPayment(payment.body.referenceCode);
            setOutput(prev => prev + `\nCancelled Status: ${ignored.body.status}`);
        }

    } catch (error: any) {
        console.error(error);
        setOutput(prev => prev + `\nError: ${error.message || error}`);
        if (error.response) {
            setOutput(prev => prev + `\nResponse Data: ${JSON.stringify(error.response.data)}`);
        }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Rasedi SDK Test</h1>
      <button onClick={runTest}>Run SDK Test</button>
      <pre style={{ marginTop: 20, background: '#333', color: '#fff', padding: 10, borderRadius: 5, whiteSpace: 'pre-wrap', textAlign: 'left' }}>
        {output}
      </pre>
    </div>
  )
}

export default App
