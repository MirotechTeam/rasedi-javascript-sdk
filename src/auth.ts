import forge from "node-forge";
import elliptic from "elliptic";
import * as ed from "@noble/ed25519";

const EC = elliptic.ec;
import { Buffer } from "buffer";
import { sha512 } from "@noble/hashes/sha2.js";

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

export class Auth {
  constructor(
    private privateKeyPem: string,
    private keyId: string,
  ) {}

  public getKeyId(): string {
    return this.keyId;
  }

  public async makeSignature(
    method: string,
    relativeUrl: string,
  ): Promise<string> {
    const rawSign = `${method} || ${this.keyId} || ${relativeUrl}`;
    const data = Buffer.from(rawSign, "utf8");

    // 1. Try RSA
    try {
      if (this.privateKeyPem.includes("RSA PRIVATE KEY")) {
        const privateKey = forge.pki.privateKeyFromPem(this.privateKeyPem);
        const md = forge.md.sha256.create();
        md.update(rawSign, "utf8");
        const signature = privateKey.sign(md);
        return forge.util.encode64(signature);
      }
    } catch (e) {
      // Not RSA
    }

    // 2. Try EC (Secp256k1 / P-256)
    // Basic heuristic: check if it parses as EC or headers
    if (
      this.privateKeyPem.includes("EC PRIVATE KEY") ||
      this.privateKeyPem.includes("BEGIN PRIVATE KEY")
    ) {
      // We need to parse the PEM to get the key bytes/components.
      // node-forge can parse generic Private Key info
      try {
        // If it's Ed25519, standard PEM parsers might fail or return specific OID
        // Let's try manual check for Ed25519 first (generic PKCS8)
        const cleanPem = this.privateKeyPem
          .replace(/-----BEGIN PRIVATE KEY-----/g, "")
          .replace(/-----END PRIVATE KEY-----/g, "")
          .replace(/\s+/g, "");

        const bytes = Buffer.from(cleanPem, "base64");

        // Ed25519 OID check (approximate)
        if (
          bytes.length > 16 &&
          bytes[9] === 0x2b &&
          bytes[10] === 0x65 &&
          bytes[11] === 0x70
        ) {
          const seed = bytes.subarray(bytes.length - 32);
          try {
            // Ensure data is Uint8Array
            const dataUint8 = new Uint8Array(data);
            const signature = await ed.sign(dataUint8, seed);
            return Buffer.from(signature).toString("base64");
          } catch (err) {
            throw err;
          }
        }

        // Otherwise assume generic EC (P-256/Secp256r1 typically for this API)
        // Otherwise assume generic EC (P-256/Secp256r1 typically for this API)

        // ... (rest of code)

        const forgeKey = forge.pki.privateKeyFromPem(this.privateKeyPem) as any;
        // Check curve
        // For this SDK context, let's assume P-256 if it's EC and not Ed25519
        const ec = new EC("p256");
        // Extract private key bytes from forge object
        // forgeKey.privateKey is usually BigInteger
        const keyHex = forgeKey.privateKey.toString(16);
        const keyPair = ec.keyFromPrivate(keyHex);
        const sig = keyPair.sign(data);

        // Concatenate R and S (32 bytes each for P-256)
        const r = sig.r.toArrayLike(Buffer, "be", 32);
        const s = sig.s.toArrayLike(Buffer, "be", 32);
        return Buffer.concat([r, s]).toString("base64");
      } catch (e) {
        // Fallthrough
      }
    }

    throw new Error("Unsupported Key Format or Signing Error");
  }
}
