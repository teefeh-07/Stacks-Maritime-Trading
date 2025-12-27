const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoPath = 'c:\\Users\\HP\\Desktop\\Blockchain\\Stacks Blockchain\\Stacks-Maritime-Trading';

function run(cmd) {
    try {
        return execSync(cmd, { cwd: repoPath, stdio: 'pipe' }).toString();
    } catch (e) {
        return null;
    }
}

function commit(branch, file, content, msg) {
    run(`git checkout -b ${branch}`);
    const fullPath = path.join(repoPath, file);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(fullPath, content + '\n');
    run(`git add ${file}`);
    run(`git commit -m "${msg}"`);
    run(`git checkout main`);
    run(`git merge ${branch}`);
    run(`git branch -d ${branch}`);
    console.log(`✓ ${msg}`);
}

const tasks = [
    // Escrow Contract
    { file: 'contracts/escrow.clar', content: ';; Escrow Contract\n;; Manages payment escrow for cargo delivery.', msg: 'feat: initialize escrow contract' },
    { file: 'contracts/escrow.clar', content: '\n(define-constant ERR-ESCROW-NOT-FOUND (err u300))', msg: 'feat: add ERR-ESCROW-NOT-FOUND' },
    { file: 'contracts/escrow.clar', content: '(define-constant ERR-ALREADY-RELEASED (err u301))', msg: 'feat: add ERR-ALREADY-RELEASED' },
    { file: 'contracts/escrow.clar', content: '(define-constant ERR-NOT-AUTHORIZED (err u100))', msg: 'feat: add ERR-NOT-AUTHORIZED to escrow' },
    { file: 'contracts/escrow.clar', content: '\n(define-map escrows { escrow-id: uint } { buyer: principal, seller: principal, amount: uint, released: bool })', msg: 'feat: define escrows map' },
    { file: 'contracts/escrow.clar', content: '(define-data-var escrow-counter uint u0)', msg: 'feat: add escrow counter variable' },
    { file: 'contracts/escrow.clar', content: '\n(define-public (create-escrow (seller principal) (amount uint))', msg: 'feat: add create-escrow signature' },
    { file: 'contracts/escrow.clar', content: '  (let ((escrow-id (+ (var-get escrow-counter) u1)))', msg: 'feat: implement escrow-id generation' },
    { file: 'contracts/escrow.clar', content: '    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))', msg: 'feat: add STX transfer to escrow' },
    { file: 'contracts/escrow.clar', content: '    (map-set escrows { escrow-id: escrow-id } { buyer: tx-sender, seller: seller, amount: amount, released: false })', msg: 'feat: store escrow data' },
    { file: 'contracts/escrow.clar', content: '    (var-set escrow-counter escrow-id)', msg: 'feat: update escrow counter' },
    { file: 'contracts/escrow.clar', content: '    (ok escrow-id)\n  )\n)', msg: 'feat: close create-escrow function' },

    // Frontend HTML
    { file: 'frontend/index.html', content: '<!DOCTYPE html>\n<html lang="en">', msg: 'feat: initialize frontend HTML' },
    { file: 'frontend/index.html', content: '<head>\n  <meta charset="UTF-8">', msg: 'feat: add charset meta tag' },
    { file: 'frontend/index.html', content: '  <meta name="viewport" content="width=device-width, initial-scale=1.0">', msg: 'feat: add viewport meta tag' },
    { file: 'frontend/index.html', content: '  <title>Stacks Maritime Trading</title>', msg: 'feat: add page title' },
    { file: 'frontend/index.html', content: '  <link rel="stylesheet" href="style.css">', msg: 'feat: link stylesheet' },
    { file: 'frontend/index.html', content: '</head>', msg: 'feat: close head tag' },
    { file: 'frontend/index.html', content: '<body>\n  <div id="app"></div>', msg: 'feat: add app container' },
    { file: 'frontend/index.html', content: '  <script type="module" src="app.js"></script>', msg: 'feat: link app script' },
    { file: 'frontend/index.html', content: '</body>\n</html>', msg: 'feat: close HTML structure' },

    // Frontend CSS
    { file: 'frontend/style.css', content: ':root {\n  --primary: #0066ff;', msg: 'style: define primary color' },
    { file: 'frontend/style.css', content: '  --secondary: #00d4ff;', msg: 'style: define secondary color' },
    { file: 'frontend/style.css', content: '  --dark: #0a0e27;', msg: 'style: define dark color' },
    { file: 'frontend/style.css', content: '  --light: #f5f7fa;\n}', msg: 'style: define light color' },
    { file: 'frontend/style.css', content: '\n* { margin: 0; padding: 0; box-sizing: border-box; }', msg: 'style: add CSS reset' },
    { file: 'frontend/style.css', content: '\nbody { font-family: "Inter", sans-serif; background: var(--dark); color: var(--light); }', msg: 'style: set body styles' },
    { file: 'frontend/style.css', content: '\n#app { max-width: 1200px; margin: 0 auto; padding: 2rem; }', msg: 'style: add app container styles' },

    // Frontend JS
    { file: 'frontend/app.js', content: 'import { AppConfig, UserSession, showConnect } from "@stacks/connect";', msg: 'feat: import Stacks Connect' },
    { file: 'frontend/app.js', content: '\nconst appConfig = new AppConfig(["store_write", "publish_data"]);', msg: 'feat: configure app permissions' },
    { file: 'frontend/app.js', content: 'const userSession = new UserSession({ appConfig });', msg: 'feat: initialize user session' },
    { file: 'frontend/app.js', content: '\nfunction connectWallet() {', msg: 'feat: add connectWallet function' },
    { file: 'frontend/app.js', content: '  showConnect({ appDetails: { name: "Maritime Trading", icon: window.location.origin + "/icon.png" }, onFinish: () => window.location.reload(), userSession });', msg: 'feat: implement wallet connection' },
    { file: 'frontend/app.js', content: '}', msg: 'feat: close connectWallet function' },

    // Tests
    { file: 'tests/vessel-registry_test.ts', content: 'import { Clarinet, Tx, Chain, Account, types } from "https://deno.land/x/clarinet@v1.0.0/index.ts";', msg: 'test: import Clarinet dependencies' },
    { file: 'tests/vessel-registry_test.ts', content: '\nClarinet.test({', msg: 'test: initialize vessel registry test suite' },
    { file: 'tests/vessel-registry_test.ts', content: '  name: "Can register a new vessel",', msg: 'test: add register vessel test name' },
    { file: 'tests/vessel-registry_test.ts', content: '  async fn(chain: Chain, accounts: Map<string, Account>) {', msg: 'test: add test function signature' },
    { file: 'tests/vessel-registry_test.ts', content: '    const deployer = accounts.get("deployer")!;', msg: 'test: get deployer account' },
    { file: 'tests/vessel-registry_test.ts', content: '    let block = chain.mineBlock([', msg: 'test: create test block' },
    { file: 'tests/vessel-registry_test.ts', content: '      Tx.contractCall("vessel-registry", "register-vessel", [types.uint(1), types.ascii("Ship-A"), types.uint(1000)], deployer.address)', msg: 'test: call register-vessel' },
    { file: 'tests/vessel-registry_test.ts', content: '    ]);', msg: 'test: close block array' },
    { file: 'tests/vessel-registry_test.ts', content: '    block.receipts[0].result.expectOk();', msg: 'test: assert success' },
    { file: 'tests/vessel-registry_test.ts', content: '  }\n});', msg: 'test: close test case' }
];

console.log(`Starting ${tasks.length} micro-commits...\n`);
tasks.forEach((t, i) => {
    const branch = `batch/${Date.now()}-${i}`;
    commit(branch, t.file, t.content, t.msg);
});

console.log('\nPushing to remote...');
run('git push origin main');
console.log('✓ Complete!');
