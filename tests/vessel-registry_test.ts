import { Clarinet, Tx, Chain, Account, types } from "https://deno.land/x/clarinet@v1.0.0/index.ts";

Clarinet.test({
  name: "Can register a new vessel",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    let block = chain.mineBlock([
      Tx.contractCall("vessel-registry", "register-vessel", [types.uint(1), types.ascii("Ship-A"), types.uint(1000)], deployer.address)
    ]);
    block.receipts[0].result.expectOk();
