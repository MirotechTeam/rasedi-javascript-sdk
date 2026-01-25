import { StyleSheet, Button, ScrollView, Platform, Text } from "react-native";
import { useState } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { RasediClient, Gateway } from "rasedi-sdk";

const SECRET_KEY =
  "live_laisvaY9wQA56WI1vQQc3IR8xAF7QKgtVOfOpt9X-VAMTKXMk3QeN8qjXjYSqxgHuqbS0CQlUUDbeamHZUWL632HJTI2-9";
const PRIVATE_KEY =`-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIIXCDtl2pujtCSajfQHrRMqrpExijGhuh2fvmIgrI/t+W87
-----END PRIVATE KEY-----`;


export default function HomeScreen() {
  const [logs, setLogs] = useState<string>();

  const handleCreatePayment = async () => {
    setLogs("Initializing Client...");
    try {
      const client = new RasediClient(PRIVATE_KEY, SECRET_KEY);
      setLogs((prev) => prev + "\nCreating Payment...");

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

      setLogs(
        (prev) =>
          prev +
          `\nPayment Created: ${payment.body.referenceCode}\nStatus: ${payment.body.status}`,
      );

      if (payment.body.referenceCode) {
        setLogs((prev) => prev + "\nFetching Payment...");
        const details = await client.getPaymentByReference(
          payment.body.referenceCode,
        );
        setLogs((prev) => prev + `\nFetched Status: ${details.body.status}`);

        setLogs((prev) => prev + "\nCancelling Payment...");
        const ignored = await client.cancelPayment(payment.body.referenceCode);
        setLogs((prev) => prev + `\nCancelled Status: ${ignored.body.status}`);
      }
    } catch (error: any) {
      console.error(error);
      setLogs((prev) => prev + `\nError: ${error.message || error}`);
      if (error.response) {
        setLogs(
          (prev) =>
            prev + `\nResponse Data: ${JSON.stringify(error.response.data)}`,
        );
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Rasedi SDK Test</ThemedText>
        <ThemedText>Using hardcoded keys.</ThemedText>

        <ThemedView style={styles.buttonContainer}>
          <Button title="Create Payment" onPress={handleCreatePayment} />
        </ThemedView>

        <ThemedText type="subtitle" style={styles.logsTitle}>
          Logs:
        </ThemedText>
        <ScrollView style={styles.logs}>
          <Text>{logs}</Text>
        </ScrollView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    color: "black",
    backgroundColor: "white",
  },
  buttonContainer: {
    marginVertical: 5,
  },
  logsTitle: {
    marginTop: 20,
  },
  logs: {
    height: 300,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
  },
  logText: {
    fontSize: 12,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    marginBottom: 4,
    color: "#333",
  },
});
