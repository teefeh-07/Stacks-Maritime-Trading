const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoPath = 'c:\\Users\\HP\\Desktop\\Blockchain\\Stacks Blockchain\\Stacks-Maritime-Trading';

function run(cmd) {
    try {
        console.log(`> ${cmd}`);
        return execSync(cmd, { cwd: repoPath, stdio: 'inherit' });
    } catch (e) {
        console.error(`Failed: ${cmd}`);
        return null;
    }
}

function microCommitLocal(branch, file, content, msg) {
    run(`git checkout -b ${branch}`);
    fs.appendFileSync(path.join(repoPath, file), content + '\n');
    run(`git add ${file}`);
    run(`git commit -m "${msg}"`);
    run(`git checkout main`);
    run(`git merge ${branch}`);
    run(`git branch -d ${branch}`);
}

const steps = [
    { file: 'contracts/vessel-registry.clar', content: '\n;; Getters', msg: 'docs: add getters section comment to vessel-registry' },
    { file: 'contracts/vessel-registry.clar', content: '(define-read-only (get-vessel (vessel-id uint))', msg: 'feat: add get-vessel read-only function' },
    { file: 'contracts/vessel-registry.clar', content: '  (map-get? vessels { vessel-id: vessel-id })\n)', msg: 'feat: implement get-vessel body' },
    { file: 'contracts/vessel-registry.clar', content: '\n(define-public (update-vessel-status (vessel-id uint) (new-status (string-ascii 20)))', msg: 'feat: add update-vessel-status signature' },
    { file: 'contracts/vessel-registry.clar', content: '  (let ((vessel (unwrap! (map-get? vessels { vessel-id: vessel-id }) ERR-VESSEL-NOT-FOUND)))', msg: 'feat: add let block and existence check to update-vessel-status' },
    { file: 'contracts/vessel-registry.clar', content: '    (asserts! (is-eq tx-sender (get owner vessel)) ERR-NOT-AUTHORIZED)', msg: 'feat: add authorization check to update-vessel-status' },
    { file: 'contracts/vessel-registry.clar', content: '    (ok (map-set vessels { vessel-id: vessel-id } (merge vessel { status: new-status })))\n  )\n)', msg: 'feat: implement status update in vessel-registry' },
    { file: 'contracts/trade-manager.clar', content: ';; Trade Manager Contract\n;; Handles cargo booking and delivery tracking.', msg: 'feat: initialize trade-manager contract' },
    { file: 'contracts/trade-manager.clar', content: '\n(define-constant ERR-CARGO-NOT-FOUND (err u200))\n(define-constant ERR-INSUFFICIENT-FUNDS (err u201))', msg: 'feat: add error constants to trade-manager' }
];

steps.forEach((s, i) => {
    const fullPath = path.join(repoPath, s.file);
    if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, '');
    }
    const branchName = `feat/step-${Date.now()}-${i}`;
    microCommitLocal(branchName, s.file, s.content, s.msg);
});

console.log('Pushing all changes to remote...');
run('git push origin main');
