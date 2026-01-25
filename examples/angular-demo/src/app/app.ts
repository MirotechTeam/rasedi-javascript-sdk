import { Component, ChangeDetectorRef } from '@angular/core';
import { RasediClient, Gateway } from 'rasedi-sdk';

const secretKey =
  'live_laisvaY9wQA6WI14vQQc3IR8JxAF7QKgtVOfOpt9X-VATKXMk3QeN8qjXjYSqxgHuqbSP0CQlUUDbeamHZUWL6TI2-9';
const privateKey = `-----BEGIN PRIVATE KEY-----
MQC4CAQAwBQYDK2VwBCIEIIXCtal2pujtCSajfQrRMqrpExijGhuh2fnvmIgr/t+W87
-----END PRIVATE KEY-----`;

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div style="padding: 20px;">
      <h1>Rasedi SDK Angular Test</h1>
      <button (click)="runTest()">Run SDK Test</button>
      <pre
        style="margin-top: 20px; background: #333; color: #fff; padding: 10px; border-radius: 5px; white-space: pre-wrap; text-align: left;"
        >{{ output }}</pre
      >
    </div>
  `,
})
export class App {
  output = 'Click button to start test';

  constructor(private cdr: ChangeDetectorRef) {}

  async runTest() {
    this.output = 'Initializing Client...';
    this.cdr.detectChanges();

    try {
      const client = new RasediClient(privateKey, secretKey);
      this.output += '\nCreating Payment...';
      this.cdr.detectChanges();

      const payment = await client.createPayment({
        amount: '10500',
        title: 'Test Angular SDK',
        description: 'Testing Universal JS SDK',
        gateways: [Gateway.CREDIT_CARD],
        redirectUrl: 'https://example.com/callback',
        callbackUrl: 'https://example.com/webhook',
        collectFeeFromCustomer: true,
        collectCustomerEmail: true,
        collectCustomerPhoneNumber: false,
      });

      this.output += `\nPayment Created: ${payment.body.referenceCode}\nStatus: ${payment.body.status}`;
      this.cdr.detectChanges();

      if (payment.body.referenceCode) {
        this.output += '\nFetching Payment...';
        this.cdr.detectChanges();

        const details = await client.getPaymentByReference(payment.body.referenceCode);
        this.output += `\nFetched Status: ${details.body.status}`;
        this.cdr.detectChanges();

        this.output += '\nCancelling Payment...';
        this.cdr.detectChanges();

        const ignored = await client.cancelPayment(payment.body.referenceCode);
        this.output += `\nCancelled Status: ${ignored.body.status}`;
        this.cdr.detectChanges();
      }
    } catch (error: any) {
      console.error(error);
      this.output += `\nError: ${error.message || error}`;
      if (error.response) {
        this.output += `\nResponse Data: ${JSON.stringify(error.response.data)}`;
      }
      this.cdr.detectChanges();
    }
  }
}
