import { randomBytes } from "node:crypto";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
} from "node:fs";
import { registerEntitySecretCiphertext } from "@circle-fin/developer-controlled-wallets";

async function main() {
  const apiKey = process.env.CIRCLE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "CIRCLE_API_KEY is required. Add it to .env.local before running this script.",
    );
  }

  const envPath = ".env.local";
  const existingEnv = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";

  if (/^CIRCLE_ENTITY_SECRET=/m.test(existingEnv)) {
    throw new Error(
      "CIRCLE_ENTITY_SECRET already exists in .env.local. Refusing to overwrite it.",
    );
  }

  const entitySecret = randomBytes(32).toString("hex");
  const recoveryDirectory = "./recovery";

  mkdirSync(recoveryDirectory, { recursive: true });

  await registerEntitySecretCiphertext({
    apiKey,
    entitySecret,
    recoveryFileDownloadPath: recoveryDirectory,
  });

  appendFileSync(envPath, `\nCIRCLE_ENTITY_SECRET=${entitySecret}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });

  console.log("Circle Entity Secret registered successfully.");
  console.log(`Entity Secret saved to ${envPath}; it was not printed to stdout.`);
  console.log(
    `Recovery material was written to ${recoveryDirectory}. Store it separately and securely.`,
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Circle Entity Secret registration failed: ${message}`);
  process.exit(1);
});
