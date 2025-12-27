import { Clarinet, Tx, Chain, Account, types } from "https://deno.land/x/clarinet@v1.0.0/index.ts";

Clarinet.test({ name: "Can book cargo", async fn(chain: Chain, accounts: Map<string, Account>) {
  const user = accounts.get("wallet_1")!;
  let block = chain.mineBlock([Tx.contractCall("trade-manager", "book-cargo", [types.uint(1), types.ascii("Electronics")], user.address)]);
  block.receipts[0].result.expectOk().expectUint(1);
