import { Clarinet, Tx, Chain, Account, types } from "https://deno.land/x/clarinet@v1.0.0/index.ts";

Clarinet.test({ name: "Can book cargo", async fn(chain: Chain, accounts: Map<string, Account>) {
