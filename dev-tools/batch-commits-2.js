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
    // Complete escrow contract
    { file: 'contracts/escrow.clar', content: '\n(define-read-only (get-escrow (escrow-id uint))', msg: 'feat: add get-escrow read-only function' },
    { file: 'contracts/escrow.clar', content: '  (map-get? escrows { escrow-id: escrow-id })\n)', msg: 'feat: implement get-escrow body' },
    { file: 'contracts/escrow.clar', content: '\n(define-public (release-escrow (escrow-id uint))', msg: 'feat: add release-escrow signature' },
    { file: 'contracts/escrow.clar', content: '  (let ((escrow (unwrap! (get-escrow escrow-id) ERR-ESCROW-NOT-FOUND)))', msg: 'feat: add escrow retrieval in release' },
    { file: 'contracts/escrow.clar', content: '    (asserts! (is-eq tx-sender (get buyer escrow)) ERR-NOT-AUTHORIZED)', msg: 'feat: add buyer authorization check' },
    { file: 'contracts/escrow.clar', content: '    (asserts! (not (get released escrow)) ERR-ALREADY-RELEASED)', msg: 'feat: add release status check' },
    { file: 'contracts/escrow.clar', content: '    (try! (as-contract (stx-transfer? (get amount escrow) tx-sender (get seller escrow))))', msg: 'feat: implement STX release to seller' },
    { file: 'contracts/escrow.clar', content: '    (ok (map-set escrows { escrow-id: escrow-id } (merge escrow { released: true })))\n  )\n)', msg: 'feat: update escrow release status' },

    // Reputation contract
    { file: 'contracts/reputation.clar', content: ';; Reputation System\n;; Tracks reliability scores for vessels and traders.', msg: 'feat: initialize reputation contract' },
    { file: 'contracts/reputation.clar', content: '\n(define-constant ERR-INVALID-SCORE (err u400))', msg: 'feat: add ERR-INVALID-SCORE' },
    { file: 'contracts/reputation.clar', content: '(define-map reputation { user: principal } { score: uint, reviews: uint })', msg: 'feat: define reputation map' },
    { file: 'contracts/reputation.clar', content: '\n(define-public (add-review (user principal) (score uint))', msg: 'feat: add add-review signature' },
    { file: 'contracts/reputation.clar', content: '  (begin', msg: 'feat: add begin block to add-review' },
    { file: 'contracts/reputation.clar', content: '    (asserts! (<= score u5) ERR-INVALID-SCORE)', msg: 'feat: validate score range' },
    { file: 'contracts/reputation.clar', content: '    (let ((current (default-to { score: u0, reviews: u0 } (map-get? reputation { user: user }))))', msg: 'feat: get current reputation' },
    { file: 'contracts/reputation.clar', content: '      (ok (map-set reputation { user: user } { score: (+ (get score current) score), reviews: (+ (get reviews current) u1) }))\n    )\n  )\n)', msg: 'feat: update reputation score' },
    { file: 'contracts/reputation.clar', content: '\n(define-read-only (get-reputation (user principal))', msg: 'feat: add get-reputation function' },
    { file: 'contracts/reputation.clar', content: '  (map-get? reputation { user: user })\n)', msg: 'feat: implement get-reputation body' },

    // Update Clarinet.toml
    { file: 'Clarinet.toml', content: '\n[contracts.escrow]\npath = "contracts/escrow.clar"\nclarity_version = 4\nepoch = "3.3"', msg: 'chore: add escrow contract to Clarinet.toml' },
    { file: 'Clarinet.toml', content: '\n[contracts.reputation]\npath = "contracts/reputation.clar"\nclarity_version = 4\nepoch = "3.3"', msg: 'chore: add reputation contract to Clarinet.toml' },

    // Frontend components
    { file: 'frontend/components/Header.js', content: 'export function Header({ connected, onConnect }) {', msg: 'feat: create Header component' },
    { file: 'frontend/components/Header.js', content: '  return `<header class="header">', msg: 'feat: add header template start' },
    { file: 'frontend/components/Header.js', content: '    <h1>⚓ Maritime Trading</h1>', msg: 'feat: add header title' },
    { file: 'frontend/components/Header.js', content: '    <button onclick="${onConnect}">${connected ? "Connected" : "Connect Wallet"}</button>', msg: 'feat: add connect button' },
    { file: 'frontend/components/Header.js', content: '  </header>`;', msg: 'feat: close header template' },
    { file: 'frontend/components/Header.js', content: '}', msg: 'feat: close Header component' },

    { file: 'frontend/components/VesselCard.js', content: 'export function VesselCard({ vessel }) {', msg: 'feat: create VesselCard component' },
    { file: 'frontend/components/VesselCard.js', content: '  return `<div class="vessel-card">', msg: 'feat: add vessel card template' },
    { file: 'frontend/components/VesselCard.js', content: '    <h3>${vessel.name}</h3>', msg: 'feat: add vessel name display' },
    { file: 'frontend/components/VesselCard.js', content: '    <p>Capacity: ${vessel.capacity} tons</p>', msg: 'feat: add capacity display' },
    { file: 'frontend/components/VesselCard.js', content: '    <span class="status ${vessel.status}">${vessel.status}</span>', msg: 'feat: add status badge' },
    { file: 'frontend/components/VesselCard.js', content: '  </div>`;', msg: 'feat: close vessel card template' },
    { file: 'frontend/components/VesselCard.js', content: '}', msg: 'feat: close VesselCard component' },

    // More CSS
    { file: 'frontend/style.css', content: '\n.header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; background: linear-gradient(135deg, var(--primary), var(--secondary)); }', msg: 'style: add header styles' },
    { file: 'frontend/style.css', content: '\n.header h1 { font-size: 2rem; font-weight: 700; }', msg: 'style: add header title styles' },
    { file: 'frontend/style.css', content: '\nbutton { padding: 0.75rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s; }', msg: 'style: add button styles' },
    { file: 'frontend/style.css', content: '\nbutton:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 102, 255, 0.4); }', msg: 'style: add button hover effect' },
    { file: 'frontend/style.css', content: '\n.vessel-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border-radius: 12px; padding: 1.5rem; border: 1px solid rgba(255,255,255,0.1); }', msg: 'style: add vessel card glassmorphism' },
    { file: 'frontend/style.css', content: '\n.vessel-card h3 { color: var(--secondary); margin-bottom: 0.5rem; }', msg: 'style: add vessel card title' },
    { file: 'frontend/style.css', content: '\n.status { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.875rem; font-weight: 600; }', msg: 'style: add status badge base' },
    { file: 'frontend/style.css', content: '\n.status.active { background: #00ff88; color: #0a0e27; }', msg: 'style: add active status style' },

    // Documentation
    { file: 'docs/getting-started.md', content: '# Getting Started\n\n## Prerequisites\n- Clarinet\n- Node.js 18+', msg: 'docs: add prerequisites' },
    { file: 'docs/getting-started.md', content: '\n## Installation\n```bash\ngit clone https://github.com/teefeh-07/Stacks-Maritime-Trading.git\ncd Stacks-Maritime-Trading\n```', msg: 'docs: add installation steps' },
    { file: 'docs/getting-started.md', content: '\n## Running Tests\n```bash\nclarinet test\n```', msg: 'docs: add test instructions' },
    { file: 'docs/getting-started.md', content: '\n## Frontend Setup\n```bash\ncd frontend\nnpm install\nnpm run dev\n```', msg: 'docs: add frontend setup' },

    { file: 'docs/contracts/escrow.md', content: '# Escrow Contract\n\nManages secure payment escrow for cargo deliveries.', msg: 'docs: create escrow contract doc' },
    { file: 'docs/contracts/escrow.md', content: '\n## Functions\n\n### create-escrow\nCreates a new escrow holding STX until delivery confirmation.', msg: 'docs: document create-escrow' },
    { file: 'docs/contracts/escrow.md', content: '\n### release-escrow\nReleases funds to seller upon buyer confirmation.', msg: 'docs: document release-escrow' },

    { file: 'docs/contracts/reputation.md', content: '# Reputation System\n\nTracks reliability and performance scores.', msg: 'docs: create reputation doc' },
    { file: 'docs/contracts/reputation.md', content: '\n## Scoring\n- Range: 0-5 stars\n- Aggregated across all reviews', msg: 'docs: document scoring system' },

    // Config files
    { file: '.gitignore', content: 'node_modules/\n.DS_Store', msg: 'chore: add gitignore' },
    { file: '.gitignore', content: 'dist/\nbuild/', msg: 'chore: ignore build directories' },
    { file: '.gitignore', content: '*.log\n.env', msg: 'chore: ignore logs and env files' },

    { file: 'frontend/vite.config.js', content: 'import { defineConfig } from "vite";', msg: 'feat: create vite config' },
    { file: 'frontend/vite.config.js', content: '\nexport default defineConfig({ server: { port: 3000 } });', msg: 'feat: configure vite dev server' },

    // README updates
    { file: 'README.md', content: '\n## Features\n- Vessel registration and tracking', msg: 'docs: add vessel feature to README' },
    { file: 'README.md', content: '- Cargo booking and management', msg: 'docs: add cargo feature to README' },
    { file: 'README.md', content: '- Secure escrow payments', msg: 'docs: add escrow feature to README' },
    { file: 'README.md', content: '- Reputation system for trust', msg: 'docs: add reputation feature to README' },

    // More tests
    { file: 'tests/trade-manager_test.ts', content: 'import { Clarinet, Tx, Chain, Account, types } from "https://deno.land/x/clarinet@v1.0.0/index.ts";', msg: 'test: initialize trade manager tests' },
    { file: 'tests/trade-manager_test.ts', content: '\nClarinet.test({ name: "Can book cargo", async fn(chain: Chain, accounts: Map<string, Account>) {', msg: 'test: add book cargo test' },
    { file: 'tests/trade-manager_test.ts', content: '  const user = accounts.get("wallet_1")!;', msg: 'test: get test user' },
    { file: 'tests/trade-manager_test.ts', content: '  let block = chain.mineBlock([Tx.contractCall("trade-manager", "book-cargo", [types.uint(1), types.ascii("Electronics")], user.address)]);', msg: 'test: call book-cargo' },
    { file: 'tests/trade-manager_test.ts', content: '  block.receipts[0].result.expectOk().expectUint(1);', msg: 'test: assert cargo ID returned' },
    { file: 'tests/trade-manager_test.ts', content: '}});', msg: 'test: close book cargo test' }
];

console.log(`Starting ${tasks.length} additional micro-commits...\n`);
tasks.forEach((t, i) => {
    const branch = `batch2/${Date.now()}-${i}`;
    commit(branch, t.file, t.content, t.msg);
});

console.log('\nPushing to remote...');
run('git push origin main');
console.log(`✓ Complete! Total commits: ${run('git rev-list --count HEAD').trim()}`);
