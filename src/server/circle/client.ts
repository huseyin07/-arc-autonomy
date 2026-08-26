import "server-only";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import { getCircleCredentials } from "@/server/env";
export function circleClient(){return initiateDeveloperControlledWalletsClient(getCircleCredentials())}
